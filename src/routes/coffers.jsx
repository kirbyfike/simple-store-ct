import logo from '../assets/images/logo.svg';
import '../App.css';
import '../Main.css';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBagShopping, faHeart, faHouse, faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'
import config from '../config'
import { useEffect, useState, useContext, version } from 'react';
import { useParams } from 'react-router-dom';
import { apiRoot } from '../commercetools';
import { setQueryArgs } from '../util/searchUtil';
import { getCart, addToCart, updateCart } from '../util/cart-util';
import { useNavigate } from "react-router-dom";

library.add(faHouse, faUser, faBagShopping, faHeart, faSearch, faBars)


function Coffers() {
  let { productId } = useParams();
  let [cart, setCart] = useState(null);
  let [packageAddons, setPackageAddons] = useState([]);
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

    await deleteCart();
    
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
          includedAddons: await fetchAddons(res.body.masterVariant.attributes, "compatibleAddOns")
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

    navigate("/cart");
  }

  const addPackageAddon = async(event) => {

    if (event) {
      console.log(event);
      let newPackageAddons = packageAddons;

      console.log(event)

      await addToCart(event.prodID, event.data.masterVariant.id, {}, 1);

      //newPackageAddons.push(event.name[config.locale]);

      //setPackageAddons(newPackageAddons);
    }
  }

  const onChangeType2 = (event) => {
    
  }

  if(!product) {
    return null
  }


  let typeOptions1 = "";
  console.log("mainnnnn", product);

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
            Included Offers:
            </h3>
            <div className="flex items-center gap-2"></div>
            <div>
            {product.includedOffers.map((row, index) => (
                <div style={{border: '1px solid', margin: '3px', padding: '3px', width: '550px', textAlign: 'center'}} key={index}>
                    <h4 style={{backgroundColor: '#efefef'}}>{row.data.name[config.locale]}</h4>
                    <br />
                    <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
                        onClick={() => addPackageAddon(row)}
                    >Included!</button>
                    <br /><br />
                </div>
                
            ))}
            </div>

            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
            Compatible Addons:
            </h3>
            <div className="flex items-center gap-2"></div>
            <div>
            {product.includedAddons.map((row, index) => (
                <div style={{border: '1px solid', margin: '3px', padding: '3px', width: '550px', textAlign: 'center'}} key={index}>
                    <h4 style={{backgroundColor: '#efefef'}}>{row.data.name[config.locale]} - ${row.data.masterVariant.prices[0].value.centAmount / 100}</h4>
                    <br />
                    <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                        onClick={() => addPackageAddon(row)}
                    >Add</button>
                    <br /><br />
                </div>
                
            ))}
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
              {product.main.name[config.locale]} - ${product.main.masterVariant.prices[0].value.centAmount / 100}
            </h2>

            {variantInfo}
            
            <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
              <button
                href="#"
                className="bg-primary border border-primary text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-primary transition"
                onClick={() => submitToCart()}
              >
                <FontAwesomeIcon icon="fas fa-shopping-bag" /> Add to cart
              </button>
              
            </div>
            <div className="flex gap-3 mt-4">
              
              
            </div>
          </div>
        </div>
        {/* ./product-detail */}
        {/* description */}
        <div className="container pb-16">
          <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium">
            Product details
          </h3>
          <div className="w-3/5 pt-6">
            <div className="text-gray-600">
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                necessitatibus deleniti natus dolore cum maiores suscipit optio itaque
                voluptatibus veritatis tempora iste facilis non aut sapiente dolor
                quisquam, ex ab.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, quae
                accusantium voluptatem blanditiis sapiente voluptatum. Autem ab,
                dolorum assumenda earum veniam eius illo fugiat possimus illum dolor
                totam, ducimus excepturi.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quia
                modi ut expedita! Iure molestiae labore cumque nobis quasi fuga,
                quibusdam rem? Temporibus consectetur corrupti rerum veritatis numquam
                labore amet.
              </p>
            </div>
           
          </div>
        </div>
        {/* ./description */}
        

        
    </div>
  );
}

export default Coffers;
