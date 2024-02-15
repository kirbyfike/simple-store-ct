import logo from '../assets/images/logo.svg';
import '../App.css';
import '../Main.css';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { useEffect, useState, useContext, version } from 'react';
import { getCart, addToCart, updateCart } from '../util/cart-util';
import { faBagShopping, faHeart, faHouse, faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'
import { apiRoot } from '../commercetools';
library.add(faHouse, faUser, faBagShopping, faHeart, faSearch, faBars)

function ProfileOrders() {
    let [orders, setOrders] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchAPIProduct = async (prodId) => {
        let res1 =  await apiRoot
                    .products()
                    .withId({ ID: prodId })
                    .get()
                    .execute()
    
        return res1.body.masterData.current;
    }

    const fetchAddons = async (lineItems) => {

        let newLineItems = [];
    
        // add the add ons
        for (const [key, value] of Object.entries(lineItems)) {

            let includedOffers = []

            console.log("start______", value.variant);

            for (const [key1, value1] of Object.entries(value.variant.attributes)) {

                console.log(value1);
                
                if (value1.name === "included_options" || value1.name === "includedOffers" || value1.name === "included-offers") {
    
                    for (const [key2, newValue2] of Object.entries(value1.value)) {
                        let subProduct =  await fetchAPIProduct(newValue2.id);
                        includedOffers.push(subProduct);
                    }
                }
            }

            newLineItems.push({
                main: value,
                mainVariant: value.variant,
                sub: includedOffers
            })
        }
    
        return newLineItems;
    }

    const fetchOrders = async () => {
        const res =  await apiRoot.orders().get().execute();

        let allOrders = [];

        if(res && res.body) {
            for (const [key, value] of Object.entries(res.body.results)) {
                let formobj = {
                    mainOrder: value,
                    includedLineItems: await fetchAddons(value.lineItems)
                }

                allOrders.push(formobj);
            }
        }

        console.log(allOrders);

        setOrders(allOrders);
    }

    if(!orders) {
        return null
      }


    return (
      <div className="App">
        <Header />

        <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        
        <div className="col-span-12 border border-gray-200 p-4 rounded">
            <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            Orders
            </h4>
            <div className="space-y-2">

            {orders.map((row, index) => (
                <div key={index} className="border border-gray-300 p-14">
                    <div className="flex justify-between">
                        <div>
                        <h3 className="text-gray-800 font-medium"><b>Order ID:</b> {row.mainOrder.id}</h3>
                        <h3 className="text-gray-800 font-medium"><b>Customer ID:</b> {row.mainOrder.customerId}</h3>
                        <h3 className="text-gray-800 font-medium"><b>Date/Time:</b> {row.mainOrder.createdAt}</h3>
                        </div>
                        <p className="text-gray-800 font-medium"></p>
                        
                    </div>
                    <br></br>
                    <div>
                    <table className="table-auto border-collapse w-full text-left text-gray-600 text-sm mt-6">
                    <tr>
                        <th className="py-2 px-4 border border-gray-300 w-40 font-medium">SKU ID</th>
                        <th className="py-2 px-4 border border-gray-300 w-40 font-medium">Line Item Name</th>
                        <th className="py-2 px-4 border border-gray-300 w-40 font-medium">Price</th>
                        <th className="py-2 px-4 border border-gray-300 w-40 font-medium">SKU Attributes</th>
                        <th className="py-2 px-4 border border-gray-300 w-40 font-medium">Included Offers</th>
                    </tr>
                    {row.includedLineItems.map((item1, index1) => (
                    <tr key={index1}>
                        <td className="py-2 px-4 border border-gray-300 w-40 font-medium">{item1.mainVariant.id}</td>
                        <td className="py-2 px-4 border border-gray-300 w-40 font-medium">{item1.mainVariant.sku}</td>
                        <td className="py-2 px-4 border border-gray-300 w-40 font-medium">${row.mainOrder.totalPrice.centAmount/100}</td>
                        <td className="py-2 px-4 border border-gray-300 w-40 font-medium">{JSON.stringify(item1.mainVariant.attributes)}</td>
                        <td className="py-2 px-4 border border-gray-300 w-40 font-medium">
                            {item1.sub.map((item2, index2) => (
                                <p key={index2}>
                                    <span><b>Name:{item2.name["en-US"]}</b> <br /> <b>Attributes:</b>{JSON.stringify(item2.masterVariant.attributes)}</span>                                      
                                </p>
                            ))}
                        </td>
                    </tr>
                    )
                    )}
                    </table>
                    </div>
                </div>

            ))}
            
            </div>
            
            
            
            
            
        </div>
        </div>
    </div>
  );
}

export default ProfileOrders;
