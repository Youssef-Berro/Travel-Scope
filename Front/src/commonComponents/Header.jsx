import './../css/Header.css';
import AsGuest from './AsGuest';
import { Link, useLocation } from 'react-router-dom';
import AsUser from './AsUser';
import { useState, useEffect } from 'react';


function Header() {
    const path = useLocation().pathname;
    const token = localStorage.getItem('token') || null;
    const [authPath, setAuthPath] = useState(false);


    // when a guest trying to log in or sign up the log-in and sign-up buttons in the header will disappear
    useEffect(() => {
        setAuthPath(false)
        if (path === '/sign-up' || path === '/log-in') {
            setAuthPath(true);
        }
    }, [path]);


    return (
        <header>
            <Link to="/" className="title">Travel Scope</Link>
            <div className="header-logo">
                <img 
                    src="https://cdn.icon-icons.com/icons2/2239/PNG/512/world_travel_icon_134812.png" 
                    alt="Travel Scope logo" />
            </div>
            <nav className="header-right-section">
                {!authPath ? (token ? <AsUser /> : <AsGuest />) : null}
            </nav>
        </header>
    )
}

export default Header;
