import logo from '../assets/images/logo.svg';
import '../App.css';
import '../Main.css';
import Header from '../components/header';
import { useParams, Link } from 'react-router-dom';
import { apiRoot } from '../commercetools';
import { useEffect, useState, useContext, version } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBagShopping, faHeart, faHouse, faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'
library.add(faHouse, faUser, faBagShopping, faHeart, faSearch, faBars)

function Profile() {
    let { customerID } = useParams();
    let [profile, setProfile] = useState(null);
    let [valueName1, setValueName1] = useState(null);
    let [valueName2, setValueName2] = useState(null);
    let [valueName3, setValueName3] = useState(null);
    let [valueName4, setValueName4] = useState(null);
    let [valueName6, setValueName6] = useState(null);
    let [valueName10, setValueName10] = useState(null);

    useEffect(() => {
        getProfile(customerID);
    }, []);

    const getProfile = async (customerID) => {
        setValueName1(sessionStorage.getItem('custType'))
        setValueName2(sessionStorage.getItem('existingCust'))
        setValueName3(sessionStorage.getItem('custLocation'))
        setValueName4(sessionStorage.getItem('spectrumChannel'))
        setValueName6(sessionStorage.getItem('offerElgibility'))
        setValueName10(sessionStorage.getItem('customerExperienceMode'))
    };

    const submitSession = async() => {
        sessionStorage.setItem('custType', valueName1)
        sessionStorage.setItem('existingCust', valueName2)
        sessionStorage.setItem('custLocation', valueName3)
        sessionStorage.setItem('spectrumChannel', valueName4)
        sessionStorage.setItem('offerElgibility', valueName6)
        sessionStorage.setItem('customerExperienceMode', valueName10)
    }

    const onChangeType1 = async(event) => {
        setValueName1(event.target.value)
    }

    const onChangeType2 = async(event) => {
        setValueName2(event.target.value)
    }

    const onChangeType3 = async(event) => {
        setValueName3(event.target.value)
    }

    const onChangeType4 = async(event) => {
        setValueName4(event.target.value)
    }

    const onChangeType6 = async(event) => {
        setValueName6(event.target.value)
    }

    const onChangeType10 = async(event) => {
        setValueName10(event.target.value)
    }

    let firstNameSelect = valueName1 ? valueName1 : '';
    let secondNameSelect = valueName2 ? valueName2 : '';
    let thirdNameSelect = valueName3 ? valueName3 : ''; 
    let fourNameSelect = valueName4 ? valueName4 : '';
    let sixNameSelect = valueName6 ? valueName6 : '';
    let tenNameSelect = valueName10 ? valueName10 : '';

    return (
    <div className="App">
        <Header />

        <div className="container grid grid-cols-12 items-start gap-6 pt-4 pb-16">
            {/* sidebar */}
            <div className="col-span-3">
                <div className="px-4 py-3 shadow flex items-center gap-4">
                <div className="flex-shrink-0">
                    <img
                    src="../assets/images/avatar.png"
                    alt="profile"
                    className="rounded-full w-14 h-14 border border-gray-200 p-1 object-cover"
                    />
                </div>
                <div className="flex-grow">
                    <p className="text-gray-600">Hello,</p>
                    <h4 className="text-gray-800 font-medium">John Doe</h4>
                </div>
                </div>
                <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
                
                <div className="space-y-1 pl-8 pt-4">
                
                    <Link to={"/profile/orders"}
                    href="#"
                    className="relative hover:text-primary block font-medium capitalize transition"
                    >
                        <span className="absolute -left-8 top-0 text-base">
                            <i className="fa-solid fa-box-archive" />
                        </span>
                        My order history
                    </Link>
                </div>
                
                </div>
            </div>
            {/* ./sidebar */}
            {/* info */}
            <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
                <h4 className="text-lg font-medium capitalize mb-4">Profile information - Customer Grid</h4>
                <div>
                    <br />
                    <div>
                        <label htmlFor="gender">Customer Experience Preview Mode</label>
                        <select value={tenNameSelect} onChange={onChangeType10} className="input-box">
                            <option value="">Off</option>
                            <option value="on">On</option>
                        </select>
                    </div>
                    <br />
                    {(sessionStorage.getItem('customerExperienceMode') === 'on') &&
                    <div>
                    <div>
                        <label htmlFor="gender">Channel Type</label>
                        <select value={fourNameSelect} onChange={onChangeType4} className="input-box">
                            <option value="">Not Set</option>
                            <option value="agent">Agent Facing</option>
                            <option value="dotcom">Bell.ca</option>
                        </select>
                    </div>
                    <br />
                    <div>
                        <label htmlFor="gender">Customer Type</label>
                        <select value={firstNameSelect} onChange={onChangeType1} className="input-box">
                            <option value="">Not Set</option>
                            <option value="residential">Residential</option>
                            <option value="smb">SMB</option>
                        </select>
                    </div>
                    <br />
                    <div>
                        <label htmlFor="gender">Customer New/Existing</label>
                        <select value={secondNameSelect} onChange={onChangeType2} className="input-box">
                            <option value="">Not Set</option>
                            <option value="new">New</option>
                            <option value="existing">Existing</option>
                        </select>
                    </div>
                    <br />
                    <div>
                        <label htmlFor="gender">Customer Location</label>
                        <select value={thirdNameSelect} onChange={onChangeType3} className="input-box">
                        <option value="">Not Set</option>
                            <option value="nw">North West (USA)</option>
                            <option value="sw">South West (USA)</option>
                            <option value="ne">North East (USA)</option>
                            <option value="se">South East (USA)</option>
                        </select>
                    </div>
                    <br />
                    <div>
                        <label htmlFor="gender">Offer Elgibility</label>
                        <select value={sixNameSelect} onChange={onChangeType6} className="input-box">
                            <option value="">Not Set</option>
                            <option value="HUG">HUG</option>
                            <option value="NEW">NEW</option>
                        </select>
                    </div>
                    <br />
                    </div>
                    }
                </div>




                <div className="mt-4">
                <button
                    type="submit"
                    className="py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
                    onClick={() => submitSession()}
                >
                    Set Session
                </button>
                </div>
            </div>
            {/* ./info */}
        </div>


    </div>
  );
}

export default Profile;
