import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import './../css/UserSettings.css'
import { useContext, useState } from 'react'
import { UserContext } from '../App'
import Loading from '../commonComponents/Loading'

function Settings() {
    const path = useNavigate();
    const token = localStorage.getItem('token');
    const {userData, setUserData} = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    if(!token)  path('/');


    const deleteAccount = async () => {
        Swal.fire({
            title: 'Are you sure you need to delete your account?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'custom-confirm-button'
            }
        }).then(async (result) => {
            if(result.isConfirmed) {
                try {
                    await axios.delete('http://127.0.0.1:3000/api/v1/users/delete-me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    localStorage.removeItem('token');
                    path('/sign-up');

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Account deleted!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } catch (error) {
                    console.error('Error deleting account:', error);
                }
            }
        });
    };
    


    const logOut = () => {
        Swal.fire({
            title: 'Are you sure you need to log out?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'custom-confirm-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                path('/log-in');

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Logged Out!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }


    const handleUpdateImage = async (e) => {
        const photo = e.target.files[0];
        const formData = new FormData();
        const photoName = `${Date.now()}_${photo.name}`
        formData.append('photo', photo, photoName);

        try {
            setLoading(true);
            await axios.patch('http://127.0.0.1:3000/api/v1/users', formData, {
                headers : {
                    'Content-Type': 'multipart/form-data',
                    Authorization : `Bearer ${token}`
                }
            })

            setUserData({...userData, photo: photoName});

            setLoading(false);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Updated',
                showConfirmButton: false,
                timer: 1500
            })
        }catch(err) {
            setLoading(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error',
                showConfirmButton: false,
                timer: 1000
            })
        }
    }
    return (
        <>
            {loading && <Loading />}
            <div className='settings'>
                <div className="title">Settings</div>
                <div className="setting-options">
                    <Link to = '/' className='home-page url'>All Tours</Link>
                    <Link to = '/change-password' className='change-password url'>Change Password</Link>
                    <Link to = '/become-a-guid' className='become-guide url'>Become a guide</Link>
                    <Link to = '/create-review' className='create-review url'>post a tour review</Link>
                    <button className='log-out url' onClick={logOut}>Log out</button>
                    <form encType="multipart/form-data">
                        <label htmlFor="fileInput" className="change-photo url">
                            change photo
                        </label>
                        <input 
                            id="fileInput"
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleUpdateImage}
                            className='change-photo' />
                    </form>
                    <button className='delete' onClick={deleteAccount}>Delete Account</button>
                </div>
            </div>
        </>
    )
}


export default Settings;