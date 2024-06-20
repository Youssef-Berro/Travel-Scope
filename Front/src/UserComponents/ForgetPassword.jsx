import { useEffect} from "react"
import usePostData from "../commonComponents/usePostData"
import './../css/Auth.css'
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'


function ForgetPassword() {
    const path = useNavigate();
    const {postData, error} = usePostData('http://127.0.0.1:3000/api/v1/users/forget-password');    

    const handleForgetPassword = async (event) => {
        try {
            event.preventDefault();
            const destructData = new FormData(event.target);
            let formData = Object.fromEntries(destructData.entries());

            await postData({email: formData.email});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'reset password request sended to your email reset your password under 15 min',
                showConfirmButton: false,
                timer: 3500
            })

            // in the future instead of /log-in => /reset-password
            path('/log-in')
        }catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(error)
        {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'invalid email address',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }, [error])


    return (
        <>
            <form className="form" style={{height: '10rem'}} onSubmit={handleForgetPassword}>
                <div className = 'input-cont'>
                    <input 
                        required
                        type="email" 
                        name="email" 
                        className="input" />
                    <span>Email</span>
                </div>
                <div className="submit-parent">
                    <input
                        type="submit"
                        value="Submit"
                        className="submit"/>
                </div>
            </form>
        </>
    )
}

export default ForgetPassword;