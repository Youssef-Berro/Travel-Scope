import axios from 'axios'
import { ToursContext, UserContext } from '../App'
import {useState, useContext, useEffect } from "react"
import './../css/UserSettings.css'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

function BecomeAGuid() { 
    const token = localStorage.getItem('token');
    const path = useNavigate();


    const {toursData} = useContext(ToursContext);
    const {userData} = useContext(UserContext);
    const [selectedTour, setSelectedTour] = useState(null)


    const renderFormData = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target.form);
        setSelectedTour(formData.get('selectedTour'));
    }


    const becomeGuid = async (event) => {
        event.preventDefault();

        try {
            await axios.patch('http://127.0.0.1:3000/api/v1/users/become-a-guid',
                    {tourId : selectedTour}, {headers : {Authorization : `Bearer ${token}`}});

            path('/');
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(userData.role === 'admin') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Admin cannot become a guid',
                showConfirmButton: false,
                timer: 1500
            })
            path('/user-info')
        }
        else if(userData.role === 'guid' || userData.role === 'lead-guid') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'You are already a guid',
                showConfirmButton: false,
                timer: 1500
            })
            path('/user-info')
        }
    }, [userData])


    // when the user refresh the page the tours context be an empty array
    useEffect(() => {
        if(toursData.length === 0)   path('/')
    }, [toursData]);

    return (
        <>
            {token ? (
                    userData.role === 'user' ? (
                        <form className="Become-guid-form" onSubmit={becomeGuid}>
                            <label htmlFor='toursOption' className='post-review-tour-title'>
                                Select the tour that you need to become a guid in it:
                            </label>
                            <select id="toursOption" name="selectedTour" onChange={renderFormData}>
                                {toursData.map((tour) =>
                                    tour.guides.length < 4 ? (
                                        <option key={tour.id} value={tour.id}>
                                            {tour.name}
                                        </option>
                                    ) : null
                                )}
                            </select>
                            <input type="submit" value="Submit" className="submit-btn" />
                        </form>
                    ) : null
            ): null}
        </>
    );
}

export default BecomeAGuid;