import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

function ResetPassword() {
    let resetPasswordToken = useParams().resetPasswordToken;
    const path = useNavigate();


    const handleResetPassword = async (event) => {
        try {
            event.preventDefault();
            const destructData = new FormData(event.target);
            let {password, passwordConfirm} = Object.fromEntries(destructData.entries());

            // some request are executed without any reusable fetch component(useFetch , postData),
            // because it require a conditional call while using custom hook cannot be nested
            await axios.patch(`http://127.0.0.1:3000/api/v1/users/reset-password/${resetPasswordToken}`,
                {password, passwordConfirm})

            path('/log-in');
        } catch(err) {
            console.log(err);
        }
    }


    return (
        <>
            <form className="form" style={{height: '18rem'}} onSubmit={handleResetPassword}>
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
            </form>
        </>
    )
}

export default ResetPassword;