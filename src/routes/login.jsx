import logo from '../assets/images/logo.svg';
import '../App.css';
import '../Main.css';
import Header from '../components/header';
import AppContext from '../appContext';
import { authClient, setAccessToken } from '../commercetools';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState, useContext, version } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBagShopping, faHeart, faHouse, faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'
library.add(faHouse, faUser, faBagShopping, faHeart, faSearch, faBars)

function Login() {

    const [email, setEmail] = useState(null);
    const [status, setStatus] = useState(null);
    const [password, setPassword] = useState(null);
    const [context, setContext] = useContext(AppContext);
    

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }
    
    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }
    
    const login = async () => {
        console.log('calling login');
        let res = await authClient.customerPasswordFlow({
        username: email,
        password: password
        });
        console.log('login result',res);
        if(res) {
        // Figure out what to do here
        setAccessToken(res.access_token);
        setContext({...context,loggedIn:true});
        } else {
        setStatus('Login failed');
        }
        return false;
    };

    const logout = async () => {
        //TODO
    };

    return (
        <div className="App">
            <Header />

            <div className="contain py-16">
            <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
                <h2 className="text-2xl uppercase font-medium mb-1">Login</h2>
                <p className="text-gray-600 mb-6 text-sm">welcome back customer</p>
                <form action="#" method="post" autoComplete="off">
                <div className="space-y-2">
                    <div>
                    <label htmlFor="email" className="text-gray-600 mb-2 block">
                        Email address
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                        placeholder="youremail.@domain.com"
                        onChange={onChangeEmail}
                    />
                    </div>
                    <div>
                    <label htmlFor="password" className="text-gray-600 mb-2 block">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                        placeholder="*******"
                        onChange={onChangePassword}
                    />
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label
                        htmlFor="remember"
                        className="text-gray-600 ml-3 cursor-pointer"
                    >
                        Remember me
                    </label>
                    </div>
                    <a href="#" className="text-primary">
                    Forgot password
                    </a>
                </div>
                <div className="mt-4">
                    <button
                    type="submit"
                    className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
                    onClick={login}
                    >
                    Login
                    </button>
                </div>
                </form>
                {/* login with */}
                <div className="mt-6 flex justify-center relative">
                <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">
                    Or login with
                </div>
                <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200" />
                </div>
                <div className="mt-4 flex gap-4">
                <a
                    href="#"
                    className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700"
                >
                    facebook
                </a>
                <a
                    href="#"
                    className="w-1/2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500"
                >
                    google
                </a>
                </div>
                {/* ./login with */}
                <p className="mt-4 text-center text-gray-600">
                Don't have account?{" "}
                <a href="register.html" className="text-primary">
                    Register now
                </a>
                </p>
            </div>
            </div>
        </div>
  );
}

export default Login;
