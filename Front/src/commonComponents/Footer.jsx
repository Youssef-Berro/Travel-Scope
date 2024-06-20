import './../css/Footer.css'
import { Link } from 'react-router-dom';

function Footer(){
    return(
        <>
            <footer>
                <div className="footer-logo">
                    <img 
                        src="https://cdn.icon-icons.com/icons2/2239/PNG/512/world_travel_icon_134812.png" 
                        alt="Travel Scope logo" />
                </div>
                <div className="right-section">
                    <div className="footer-nav">
                        <Link to="/">• About us</Link>&nbsp;
                        <Link to="/">• Download apps</Link>&nbsp;
                        <Link to="/">• Careers</Link>&nbsp;
                        <Link to="/">• Contact</Link>&nbsp;
                    </div>
                    <p className="footer-copyright">&copy; by Youssef Berro .</p>
                </div>
            </footer>
        </>
    )

}

export default Footer;