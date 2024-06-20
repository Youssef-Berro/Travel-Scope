import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function ChangePassword() {
    const path = useNavigate()
    const token = localStorage.getItem('token');


    useEffect(() => {
        if(!token)  path('/');
    }, [])

    const [oldPasswordValidity, setOldPasswordValidity] = useState(true)
    const [ newPasswordValidity, setNewPasswordValidity] = useState(true)

    const checkNewPasswordValidity = (passwordsObj) => {
        if((passwordsObj.newPassword !== passwordsObj.passwordConfirm)
        || (passwordsObj.newPassword.length < 8))
                return false;

        return true;
    }


    const handleNewPassword = async (event) => {
        event.preventDefault();
        const destructData = new FormData(event.target);
        let passwordsObj = Object.fromEntries(destructData.entries())
        setNewPasswordValidity(true);
        setOldPasswordValidity(true);

        if(checkNewPasswordValidity(passwordsObj)) {
            try {
                await axios.patch('http://127.0.0.1:3000/api/v1/users/update-password',
                        passwordsObj, { headers: {Authorization: `Bearer ${token}`}})

                localStorage.removeItem('token');
                path('/log-in')
            } catch(err) {
                setOldPasswordValidity(false);
                console.log(err);
            }
        }
        else {
            setNewPasswordValidity(false)
        }
    }

    return (
        <>
            <form className="form" onSubmit={handleNewPassword}>
                <p className="form-title">Change Password</p>
                {!oldPasswordValidity && <div className="not-found">incorrect old password</div>}
                {!newPasswordValidity && <div className="not-found">invalid new password</div>}
                <div className = 'input-cont'>
                    <input required type="password" name="oldPassword" className="input" />
                    <span>old Password</span>
                </div>
                <div className = 'input-cont'>
                    <input required type="password" name="newPassword" className="input" />
                    <span>new Password</span>
                </div>
                <div className = 'input-cont'>
                    <input required type="password" name="passwordConfirm" className="input" />
                    <span>password Confirm</span>
                </div>
                <div className="submit-parent">
                    <input
                        type="submit"
                        value="save"
                        className="submit"
                    />
                </div>
            </form>
        </>
    )
}


export default ChangePassword