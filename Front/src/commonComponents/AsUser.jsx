import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import useFetch from './useFetch';

function AsUser() {
    const path = useNavigate();
    const token = localStorage.getItem('token');
    if(!token)  path('/');

    // userData context are filled in this component
    const {userData, setUserData} = useContext(UserContext);
    const [imgBorderColor, setImgBorderColor] = useState('');
    const {data} = useFetch('http://127.0.0.1:3000/api/v1/users/me', token);
    

    useEffect(() => {
        if(data !== null) {
            setImgBorderColor('blue')
            setUserData(data.data.doc);
            if(userData.role === 'admin')   setImgBorderColor('gold')
            else if((userData.role === 'guid') || (userData.role === 'luid-guid'))
                setImgBorderColor('red')
        }
    }, [data])


    return (
        <>
            {userData &&
                (<div className='user'>
                    <Link 
                        className='user-photo' 
                        to='/user-info' >
                            <img 
                                src={`../../img/users/${userData.photo}`} 
                                style={{borderColor : `${imgBorderColor}`, borderStyle : 'solid'}}
                                alt="photo not found"/>
                    </Link>
                    <Link 
                        className='user-name' 
                        to='/user-info'>
                            {userData.name}
                    </Link>
                </div>)
            }
        </>
    )
}

export default AsUser;