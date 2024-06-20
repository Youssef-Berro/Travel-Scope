import UserInfo from "./UserInfo"
import './../css/UserSettings.css'
import Settings from './Settings'
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


function UserSettings() {
    const path = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem('token'))  path('/');
    })

    return (
        <div className="container">
            <UserInfo />
            <Settings />
        </div>
    )
}


export default UserSettings;