import { useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "../App"
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Loading from './../commonComponents/Loading'

function UserInfo() {
    const path = useNavigate();
    const token = localStorage.getItem('token');
    if(!token)  path('/'); 

    const {userData, setUserData} = useContext(UserContext);
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(userData.name);
    const [loading, setLoading] = useState(false);

    
    // old name reserve useState used when the user click edit name then cancel or the new name 
    // are not valid, so we are storing the old name to remake it in this cases
    const [oldNameReserve, setOldNameReserve] = useState(userData.name);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancelClick = () => {
        setEditMode(false);
        setEditedName(userData.name);
    };

    const handleConfirmClick = async () => {
        if(userData.name === editedName) {
            setEditMode(false);
            return;
        }

            try{
                setLoading(true);
                await axios.patch('http://127.0.0.1:3000/api/v1/users',
                        {name: editedName}, {headers: {Authorization: `Bearer ${token}`}})

                setUserData({...userData, name: editedName})
                setOldNameReserve(editedName);

                setLoading(false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'updated',
                    showConfirmButton: false,
                    timer: 1000
                })
            } catch(err) {
                setLoading(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'name must contain between 8 and 30 character',
                    showConfirmButton: false,
                    timer: 2000
                })
                setEditedName(oldNameReserve)
            }

        setEditMode(false);
    }

    return (
        <>
            {loading && <Loading />}
            <div className="user-info">
                <div className="name-cont">
                    <div className="name">
                        <span className="text">name: </span>
                        {editMode ? (
                        <div className="edit-name">
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}/>
                            <button className="cancel" onClick={handleCancelClick}>Cancel</button>
                            <button className="confirm" onClick={handleConfirmClick}>Confirm</button>
                        </div>
                        ) : (
                        <>
                            <span className="value">{userData.name}</span>
                            <div>
                                <button 
                                    className="pencil" 
                                    onClick={handleEditClick}>edit
                                </button>
                            </div>
                        </>
                        )}
                    </div>
                </div>
                <div className="role">
                    <span className="text">email: </span>
                    <span className="value">{userData.email}</span>
                </div>
                <div className="role">
                    <span className="text">role: </span>
                    <span className="value">{userData.role}</span>
                </div>
            </div>
        </>
    );
}


export default UserInfo;