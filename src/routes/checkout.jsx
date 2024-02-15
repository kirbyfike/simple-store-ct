import logo from '../assets/images/logo.svg';
import '../App.css';
import '../Main.css';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBagShopping, faHeart, faHouse, faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'
import { apiRoot } from '../commercetools';
import { getCart, addToCart, updateCart } from '../util/cart-util';
import { useNavigate } from "react-router-dom";
library.add(faHouse, faUser, faBagShopping, faHeart, faSearch, faBars)

function Checkout() {
  const navigate = useNavigate();

  const submitToCheckout = async() => {

    let cart = await getCart();
  
    let result = await apiRoot
      .carts()
      .withId({ID: cart.id})
      .post({
        body: {
          version: cart.version,
          actions: [{
            action: 'setCustomerId',
            customerId: "f6bab5fc-caed-4aeb-a048-2dc94a79e53a"
          },
          {
            action: "setShippingAddress", 
            address: {
              country: "CA"
            }
          }
        ]
        }
    }).execute();

    let result1 = await apiRoot
      .orders()
      .post({
        body: {
          customerId: 'f6bab5fc-caed-4aeb-a048-2dc94a79e53a',
          cart: {
            id: cart.id,
            version: result.body.version
          },
          version: result.body.version
        }
      })
      .execute()
      .catch((e) => console.log("here", e))

    if (result1 && result1.body) {
      navigate(`/orders/${result1.body.id}`);
    }
  }

    

    return (
      <div className="App">
          <Header />

        <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        <div className="col-span-8 border border-gray-200 p-4 rounded">
            <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="first-name" className="text-gray-600">
                    First Name <span className="text-primary">*</span>
                </label>
                <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    className="input-box"
                />
                </div>
                <div>
                <label htmlFor="last-name" className="text-gray-600">
                    Last Name <span className="text-primary">*</span>
                </label>
                <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    className="input-box"
                />
                </div>
            </div>
            <div>
                <label htmlFor="company" className="text-gray-600">
                Company
                </label>
                <input type="text" name="company" id="company" className="input-box" />
            </div>
            <div>
                <label htmlFor="region" className="text-gray-600">
                Country/Region
                </label>
                <input type="text" name="region" id="region" className="input-box" />
            </div>
            <div>
                <label htmlFor="address" className="text-gray-600">
                Street address
                </label>
                <input type="text" name="address" id="address" className="input-box" />
            </div>
            <div>
                <label htmlFor="city" className="text-gray-600">
                City
                </label>
                <input type="text" name="city" id="city" className="input-box" />
            </div>
            <div>
                <label htmlFor="phone" className="text-gray-600">
                Phone number
                </label>
                <input type="text" name="phone" id="phone" className="input-box" />
            </div>
            <div>
                <label htmlFor="email" className="text-gray-600">
                Email address
                </label>
                <input type="email" name="email" id="email" className="input-box" />
            </div>
            <div>
                <label htmlFor="company" className="text-gray-600">
                Company
                </label>
                <input type="text" name="company" id="company" className="input-box" />
            </div>
            </div>
        </div>
        <div className="col-span-4 border border-gray-200 p-4 rounded">
            <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            Payment Info
            </h4>
            <div className="space-y-2">
            <div style={{margin: "10px", padding: "10px", backgroundColor: '#efefef', borderTop: '1px solid black'}}>
            
            <div>
                <label htmlFor="company" className="text-gray-600">
                Card No
                </label>
                <input type="text" name="company" id="company" className="input-box" />
            </div>
            <div>
                <label htmlFor="company" className="text-gray-600">
                Last Four
                </label>
                <input type="text" name="company" id="company" className="input-box" />
            </div>
            <div>
                <label htmlFor="company" className="text-gray-600">
                CVV
                </label>
                <input type="text" name="company" id="company" className="input-box" />
            </div>
            </div>
            </div>
            
            <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>subtotal</p>
            <p>$1280</p>
            </div>
            <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>shipping</p>
            <p>Free</p>
            </div>
            <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
            <p className="font-semibold">Total</p>
            <p>$1280</p>
            </div>
            <div className="flex items-center mb-4 mt-2">
            <input
                type="checkbox"
                name="aggrement"
                id="aggrement"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer w-3 h-3"
            />
            <label
                htmlFor="aggrement"
                className="text-gray-600 ml-3 cursor-pointer text-sm"
            >
                I agree to the{" "}
                <a href="#" className="text-primary">
                terms &amp; conditions
                </a>
            </label>
            </div>

            <button
                href="#"
                className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
                onClick={() => submitToCheckout()}
              >
                Place order
              </button>
        </div>
        </div>
    </div>
  );
}

export default Checkout;
