import logo from '../assets/images/logo.svg';
import '../App.css';
import '../Main.css';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBagShopping, faHeart, faHouse, faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'
import config from '../config';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext, version } from 'react';
import { useParams } from 'react-router-dom';
import { apiRoot } from '../commercetools';
import { setQueryArgs } from '../util/searchUtil';
import { getCart, addToCart, updateCart } from '../util/cart-util';
import { useNavigate } from "react-router-dom";

library.add(faHouse, faUser, faBagShopping, faHeart, faSearch, faBars)


function Doffers() {
  let { productId } = useParams();
  let [cart, setCart] = useState(null);
  let [packageAddons, setPackageAddons] = useState(null);
  let [product, setProduct] = useState(null);
  let [variantName, setVariantName] = useState(null);
  let [selectedVariant, setSelectedVariant] = useState(null);
  let [error, setError] = useState(null);
  let [probeName, setProbeName] = useState(null);
  let [reactionSize, setReactionSize] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct(productId);
  });

  const fetchProduct = async (productId) => {
    
    if(product || !productId) {
      return;
    }
    
    const queryArgs = setQueryArgs();

    /* Last, but not least, add a couple of reference expansions to include channel and customer group data */
    queryArgs.expand = [
      'masterVariant.prices[*].channel',
      'masterVariant.prices[*].customerGroup',
      'masterVariant.prices[*].discounted.discount',
      'masterVariant.price.discounted.discount',
      'variants[*].prices[*].channel',
      'variants[*].prices[*].customerGroup',
      'variants[*].prices[*].discounted.discount',
      'variants[*].price.discounted.discount',
    ];

    let res =  await apiRoot
      .productProjections()
      .withId({ ID: productId })
      .get({ queryArgs: queryArgs })
      .execute();

      if(res && res.body) {
        setProduct({
          main: res.body,
          includedOffers: await fetchAddons(res.body.masterVariant.attributes, "includedOffers"),
          includedAddons: await fetchAddons(res.body.masterVariant.attributes, "compatibleAddOns"),
          compatibleEquipment: await fetchAddons(res.body.masterVariant.attributes, "compatibleEquipment"),
          compatiblePlans: await fetchAddons(res.body.masterVariant.attributes, "compatiblePlans")
        });
      }
  };

  const fetchAPIProduct = async (prodId) => {
    let res1 =  await apiRoot
                .products()
                .withId({ ID: prodId })
                .get()
                .execute()


    return {prodID: prodId, data: res1.body.masterData.current};
  }

  const fetchAddons = async (attributes, attrKey) => {

    let includedAddOns = [];

    // add the add ons
    for (const [key, value] of Object.entries(attributes)) {
        
        if (value.name === attrKey) {

            for (const [key, newValue] of Object.entries(value.value)) {
                let subProduct =  await fetchAPIProduct(newValue.id);
                includedAddOns.push(subProduct);
            }
        }
    }

    return includedAddOns;
  }

  const onChangeType1 = (event) => {

    for (const [key, newValue] of Object.entries(product.variants)) {

        if (event.target.value === newValue.main.sku) {
            let prompt = "";

            for (const [key, value] of Object.entries(newValue.main.attributes)) {
          
              if (value.name === "best-prompt") {
                prompt = value.value;
              }
            }

            setSelectedVariant({
              main: newValue.main,
              addOns: newValue.addOns,
              prompt: prompt
            });
            setVariantName(event.target.value);
            break;
        }
    }
  }

  const deleteCart = async() => {
    let cart = await getCart();
    sessionStorage.removeItem('cartId');
    setCart(null);    
    if(cart) {
      await apiRoot
        .carts()
        .withId({ ID: cart.id})
        .delete({
          queryArgs: {
            version: cart.version
          }
        })
        .execute();
    }
  }

  const initCart = async(currentProducts, addOns) => {
    // Add the main products
    const result = await addToCart(1, 1,{}, 1);
  }

  const submitToCart = async() => {
    //await deleteCart();

    let custom = {}

    const result = await addToCart(product.main.id, product.main.masterVariant.id, custom, 1);

    console.log(packageAddons)

    //navigate("/cart");
  }

  const addPackageAddon = async(event) => {
    await deleteCart();

    if (event) {
      let custom = {}

      await addToCart(event.prodID, event.data.masterVariant.id, custom, 1);
      await addToCart(product.compatiblePlans[0].prodID, product.compatiblePlans[0].data.masterVariant.id, custom, 1);
      navigate("/cart");

      //submitToCart();
    }
  }

  

  const onChangeType2 = (event) => {
    
  }

  if(!product) {
    return null
  }

  let typeOptions1 = "";
  let secondNameSelect =variantName ? variantName : '';
  if(product.main.variants.length) {
    typeOptions1 = product.main.variants.map(c => <option key={c.main.id} value={c.main.sku}>{c.main.sku}</option>);
  }

  var variantInfo;



  if (true) {
    variantInfo = (
        <div className="pt-4">
          
          <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
              <p className="text-xl text-primary font-semibold"></p>
            </div>
            
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
            Your Plan:
            </h3>
            <div className="flex items-center gap-2"></div>
            <div>
            {product.compatiblePlans.map((row, index) => (
                <div key={index}>
                    <h4>{row.data.name[config.locale]} - ${row.data.masterVariant.prices[0].value.centAmount / 100}</h4>
                    <br />
                    
                    <br /><br />
                </div>
                
            ))}
            </div>
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
            Choose Your Phone:
            </h3>
            <div className="flex items-center gap-2"></div>

            <div className="col-span-3">
            
            <div className="grid md:grid-cols-1 grid-cols-4 gap-6">
            {product.compatibleEquipment.map((row, index) => (
              <div key={index} className="bg-white shadow rounded overflow-hidden group">
                <div className="relative">
                  
                    <img
                    src={row.data.masterVariant.images[0].url}
                    alt="product"
                    className="w-1/2"
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center 
                          justify-center gap-2 opacity-0 group-hover:opacity-100 transition"
                  >
                    <a
                      href="#"
                      className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                      title="view product"
                    >
                      <FontAwesomeIcon icon="fas fa-search" />
                    </a>
                    <a
                      href="#"
                      className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                      title="add to wishlist"
                    >
                      <FontAwesomeIcon icon="fas fa-heart" />
                    </a>
                  </div>
                </div>
                <div className="pt-4 pb-3 px-4">
                  <Link to={`/do/${row.data.id}`}>
                    <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                      {row.data.name[config.locale]}
                    </h4>
                  </Link>
                  <div className="flex items-baseline mb-1 space-x-2">
                    <p className="text-xl text-primary font-semibold">${row.data.masterVariant.prices[0].value.centAmount / 100}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex gap-1 text-sm text-yellow-400">
                      <span>
                        <FontAwesomeIcon icon="fas fa-star" />
                      </span>
                      <span>
                        <FontAwesomeIcon icon="fas fa-star" />
                      </span>
                      <span>
                        <FontAwesomeIcon icon="fas fa-star" />
                      </span>
                      <span>
                        <FontAwesomeIcon icon="fas fa-star" />
                      </span>
                      <span>
                        <FontAwesomeIcon icon="fas fa-star" />
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-3">(150)</div>
                  </div>
                </div>

                <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                        onClick={() => addPackageAddon(row)}
                    >Add</button>

               
              </div>
              
              ))}
              
            </div>
          </div>
        </div>

      );
  } else {
    variantInfo = null;
  }


  return (
    <div className="App">
        <Header />

        <div className="container py-4 flex items-center gap-3">
          <a href="../index.html" className="text-primary text-base">
            <FontAwesomeIcon icon="fas fa-house" />
          </a>
          
          <p className="text-gray-600 font-medium">Product</p>
        </div>

        {/* product-detail */}
        <div className="container grid grid-cols-1">
          <div>
            
          </div>
          <div>
            <h2 className="text-3xl font-medium uppercase mb-2">
              {product.main.name[config.locale]}
            </h2>

            {variantInfo}
            
            
            <div className="flex gap-3 mt-4">
              
              
            </div>
          </div>
        </div>
       
        

        
    </div>
  );
}

export default Doffers;
