import './../css/Header.css'
import { Link } from 'react-router-dom'


function AsGuest() {
    return (
        <>
            <Link to='/log-in' className="log-in">LOG IN</Link>
            <Link to='/sign-up' className="sign-up">SIGN UP</Link>

            <div className='drop-show'>
                <div className="btns">
                <Link to='/log-in' className="log-in">LOG IN</Link>
                <Link to='/sign-up' className="sign-up">SIGN UP</Link>
                </div>
            </div>
        </>
    )
}


export default AsGuest