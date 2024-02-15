import logo from '../assets/images/logo.svg';
import '../App.css';
import '../Main.css';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';
import config from '../config'
import { library } from '@fortawesome/fontawesome-svg-core'
import { apiRoot } from '../commercetools';
import { useEffect, useState, useContext, version } from 'react';
import { getCart, addToCart, updateCart } from '../util/cart-util';
import { faBagShopping, faHeart, faHouse, faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'
library.add(faHouse, faUser, faBagShopping, faHeart, faSearch, faBars)

function Cart() {
    let [cart, setCart] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        let resCart = await getCart();

        if(resCart) {
            setCart({
                info: resCart,
                lineItems: await includeLineItems(resCart.lineItems),
                includedDiscounts: await fetchCartDiscounts()
            });
        }
    }

    const includeLineItems = async (lineItems) => {

        let includedAddOns = [];

        console.log("my lineItems", lineItems)
    
        // add the add ons
        for (const [key, value] of Object.entries(lineItems)) {
            
            let product =  await fetchAPIProduct(value.productId);

            let obj = {
                main: value,
                included: await fetchAddons(product.masterVariant.attributes, "includedOffers")
            }
            
            includedAddOns.push(obj)
        }
    
        return includedAddOns;
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

    const fetchAPIProduct = async (prodId) => {
        let res1 =  await apiRoot
                    .products()
                    .withId({ ID: prodId })
                    .get()
                    .execute()

        return res1.body.masterData.current;
    }

    const fetchCartDiscounts = async () => {

        let res1 =  await apiRoot
                    .cartDiscounts()
                    .get()
                    .execute()


        return res1.body.results;
    }

    if(!cart) {
        return null
      }

    console.log("heres the whole", cart);

    var discountInfo;
    let runDiscounts = false;

    if (runDiscounts) {
        discountInfo = (
            <div>
                <p><b>Discounts Applied:</b></p>
              
                {cart.includedDiscounts.map((row, index) => (
                    <div key={index} style={{backgroundColor: '#efefef', borderTop: '1px solid black'}}>
                        <h4 style={{backgroundColor: '#efefef'}}>Name: {row.name["en-CA"]}</h4>
                            {row.custom && row.custom.fields ? <p>Days Until Valid: {row.custom.fields.daysStartUntilValid}</p> : null }
                            {row.custom && row.custom.fields ? <p>Days Until Expired: {row.custom.fields.daysStartUntilExpired}</p> : null }
                            {row.custom && row.custom.fields ? <p>Discount Type: {row.custom.fields.discountType}</p> : null }
                        
                    </div>
                    
                ))}
                
            </div>
    
          );
      } else {
        discountInfo = null;
      }


    return (
        <div className="App">
        <Header />

        <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        
        <div className="col-span-12 border border-gray-200 p-4 rounded">
            <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            Cart
            </h4>
            <div className="col-span-9 space-y-4">
            {cart.info.lineItems.map((row, index) => (
                <div className="flex items-center justify-between gap-6 p-4 border-gray-200 rounded min-h-7">
                    <div className="w-28">
                    { (row.variant.images.length > 0) &&
                        <img
                        src={row.variant.images[0].url}
                        alt="product 6"
                        className="w-full"
                        />
                    }
                    </div>
                    <div className="w-3/4">
                        <h2 className="text-gray-800 text-xl font-medium uppercase">
                        {row.name[config.locale]}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Availability: <span className="text-green-600">In Stock</span>
                        </p>
                    </div>
                    <div className="w-1/4">
                        <div className="text-lg font-semibold">
                            ${row.totalPrice.centAmount / 100}
                            { (row.price.custom.fields.chargeType[0] === "oneTime") &&
                                <span className="text-black-600"> (Due Today)</span>
                            }
                            { (row.price.custom.fields.chargeType[0] === "onGoing") &&
                                <span className="text-black-600"> (Billed Monthly) </span>
                            }
                            
                        </div>
                    </div>
                    
                    <div className="text-gray-600 cursor-pointer hover:text-primary">
                        <i className="fa-solid fa-trash" />
                    </div>
                </div>
            ))}
            </div>
            <div className="border-t-2">
            <div className="flex items-center justify-between gap-6 p-4 border-gray-200 rounded min-h-7">
                <div className="w-28">
                    <p>SUBTOTAL</p>
                </div>

                <div className="w-3/4">
                </div>

                <div className="w-1/4">
                    <div className="text-lg font-semibold">
                    ${cart.info.totalPrice.centAmount / 100}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-6 p-4 border-gray-200 rounded min-h-7">
                <div className="w-28">
                    <p>SHIPPING</p>
                </div>

                <div className="w-3/4">
                </div>

                <div className="w-1/4">
                <div className="text-lg font-semibold">
                    Free
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-6 p-4 border-gray-200 rounded min-h-7">
                <div className="w-28">
                    <p>Total</p>
                </div>

                <div className="w-3/4">
                </div>

                <div className="w-1/4">
                    <div className="text-lg font-semibold">
                    ${cart.info.totalPrice.centAmount / 100}
                    </div>
                </div>
            </div>
            </div>
            
            <Link to={`/checkout`} className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium">
                Checkout
            </Link>
        </div>
        </div>
    </div>
  );
}

export default Cart;
