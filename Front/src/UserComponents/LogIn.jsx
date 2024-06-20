import { Link, useNavigate } from "react-router-dom"
import './../css/Auth.css'
import { useEffect } from "react";
import usePostData from "../commonComponents/usePostData";
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

function LogIn() {
    const path = useNavigate();
    const {postData} = usePostData('http://127.0.0.1:3000/api/v1/users/log-in');


    useEffect(() => {
        if(localStorage.getItem('token'))   path('/');
    }, [])


    const handleLogIn = async (event) => {
        event.preventDefault();
        const destructData = new FormData(event.target);
        let formData = Object.fromEntries(destructData.entries());

        try {
            const data = await postData(formData)
            const token = data.token;

            localStorage.setItem('token', token);
            path('/');
        } catch(err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'incorrect email or password',
                customClass: {
                    confirmButton: 'custom-ok-button'
                }
            })
        }
    }

    return (
        <>
            <form className="form" onSubmit={handleLogIn}>
                <p className="form-title">Log In</p>
                <div className = 'input-cont'>
                    <input required type="email" name="email" className="input" />
                    <span>Email</span>
                </div>
                <div className = 'input-cont'>
                    <input required type="password" name="password" className="input" />
                    <span>Password</span>
                </div>
                <Link to='/forget-password' className="forget-password">forget password</Link>
                <div className="submit-parent">
                    <input
                        type="submit"
                        value="Submit"
                        className="submit"
                    />
                </div>
                <p className="signin">Don&apos;t have account ?<Link to="/sign-up">Sign Up</Link></p>
            </form>
        </>
    )
}

export default LogIn