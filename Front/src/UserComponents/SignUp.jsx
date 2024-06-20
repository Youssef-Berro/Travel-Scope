import './../css/Auth.css'
import {useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import usePostData from '../commonComponents/usePostData'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'


function SignUp(props) {
    // eslint-disable-next-line react/prop-types
    const title = props.title || 'Register';
    const path = useNavigate();
    const {error, postData} = usePostData('http://127.0.0.1:3000/api/v1/users/sign-up');


    useEffect(() => {
        if(localStorage.getItem('token'))   path('/');
    }, [])


    const checkDataValidity = (data) => {
        const { name, password, passwordConfirm } = data;
        let msg = '';

        if(name.length > 30) 
            msg = 'first name with last name must be lower than 30 characters';
        else if(name.length < 7) 
            msg = 'first name with last name must be greater than 7 characters';
        else if(password !== passwordConfirm) 
            msg = 'password and password confirm must be the same';
        else if(password.length < 8) 
            msg = 'password must contain more than 8 characters';


        if(msg !== '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: msg,
                customClass: {
                    confirmButton: 'custom-ok-button'
                }
            })
            return false;
        }

        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const destructData = new FormData(event.target);
        const formData = Object.fromEntries(destructData.entries());
        formData.name = `${formData.firstname} ${formData.lastname}`;
        delete formData.firstname;
        delete formData.lastname;

        if (checkDataValidity(formData)) {
            const data = await postData(formData);
            if(error) {
                let msg = error.response.data.message;

                if(msg.includes('email must be unique'))  
                    msg = 'email already used, choose another one';

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: msg,
                        customClass: {
                            confirmButton: 'custom-ok-button'
                        }
                    })
            } else {
                const token = data.token;
                localStorage.setItem('token', token);
                path('/');
            }
        } 
    }

    return (
        <>
            <form className="form" onSubmit={handleSubmit}>
                <p className="form-title">{title}</p>
                <div className="name-field">
                    <div>
                        <input required type="text" name="firstname" className="input" />
                        <span>Firstname</span>
                    </div>
                    <div>
                        <input required type="text" name="lastname" className="input" />
                        <span>Lastname</span>
                    </div>
                </div>
                <div className = 'input-cont'>
                    <input required type="email" name="email" className="input" />
                    <span>Email</span>
                </div>
                <div className = 'input-cont'>
                    <input required type="password" name="password" className="input" />
                    <span>Password</span>
                </div>
                <div className='input-cont'>
                    <input required type="password" name="passwordConfirm" className="input" />
                    <span>Password Confirm</span>
                </div>
                <div className="submit-parent">
                    <input
                        type="submit"
                        value="Submit"
                        className="submit"
                    />
                </div>
                {/* eslint-disable-next-line react/prop-types */}
                { !props.fromMain && 
                <p className="signin">Already have an account? <Link to="/log-in">Log In</Link></p>}
            </form>
        </>
    );
}


export default SignUp