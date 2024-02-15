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
import { useParams } from 'react-router-dom';
import { faBagShopping, faHeart, faHouse, faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'
library.add(faHouse, faUser, faBagShopping, faHeart, faSearch, faBars)

function Orders() {
    let { orderId } = useParams();

    let [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrder(orderId);
    }, []);

    const fetchOrder = async (orderId) => {

        let res =  await apiRoot
        .orders()
        .withId({ ID: orderId })
        .get()
        .execute();

        console.log(res);
        if(res && res.body) {
            setOrder(res.body);
        }
    }

    if(!order) {
        return null
    }

    return (
        <div className="App">
        <Header />

        <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        
        <div className="col-span-12 border border-gray-200 p-4 rounded">
            <h2 className="text-black-800 text-lg mb-4 font-medium uppercase">
            Thanks for your Order!
            </h2>
            <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            Order Summary
            </h4>
            <div className="space-y-2">

            {order.lineItems.map((row, index) => (
                <div key={index}>
                <div className="flex justify-between">
                    <div>
                    <h3 className="text-gray-800 font-medium">{row.name[config.locale]}</h3>
                    <p className="text-sm text-gray-600">{row.variant.sku}</p>
                    </div>
                    <p className="text-gray-600">{row.quantity}</p>
                    <p className="text-gray-800 font-medium">${row.totalPrice.centAmount / 100}</p>
                    
                </div>
                <br></br>
                <div>
                
                </div>
                </div>

            ))}
            
            </div>
            <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>subtotal</p>
            <p>${order.totalPrice.centAmount / 100}</p>
            </div>
            <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>shipping</p>
            <p>Free</p>
            </div>
            <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
            <p className="font-semibold">Total</p>
            <p>${order.totalPrice.centAmount / 100}</p>
            </div>
        </div>
        </div>
    </div>
  );
}

export default Orders;
