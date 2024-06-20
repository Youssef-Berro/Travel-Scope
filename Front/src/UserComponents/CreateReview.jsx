import './../css/CreateReview.css'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToursContext, UserContext } from '../App'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

function CreateReview() {
    const path = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) path('/');
    }, []);

    const { toursData } = useContext(ToursContext);
    const { userData } = useContext(UserContext);
    const [reviewPage, setReviewPage] = useState(0);
    const [selectedTour, setSelectedTour] = useState('');
    const [data, setData] = useState({ review: '', rating: 1 });

    const nextPage = () => {
        if (reviewPage === 0) setSelectedTour(document.getElementById('toursOption').value);

        setReviewPage(reviewPage + 1);
    }

    const previousPage = () => {
        setReviewPage(reviewPage - 1);
    }

    const fillData = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    }

    useEffect(() => {
        if (reviewPage === 3) {
            const postReview = async () => {
                try {
                    await axios.post(`http://127.0.0.1:3000/api/v1/tours/${selectedTour}/reviews`,
                        data,
                        { headers: { Authorization: `Bearer ${token}` } })

                    path('/');
                } catch (err) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'The review was not created successfully due to incorrect information',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    path('/user-info');
                }
            }

            postReview();
        }
    }, [reviewPage])

    useEffect(() => {
        if ((userData) && (userData.role !== 'user')) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Only users can post reviews',
                showConfirmButton: false,
                timer: 1500
            })
            path('/user-info');
        }
    }, [userData])

    // if the user refreshes the page and the tours context is an empty array, navigate to '/'
    useEffect(() => {
        if (toursData.length === 0)
            path('/');
        else setSelectedTour(toursData[0].id);
    }, [toursData]);

    return (
        <>
            {userData && userData.role === 'user' && (
                <div className='post-review-cont'>
                    <div className='review-title'>Post Review</div>
                    <form className="post-review">
                        {reviewPage === 0 && toursData !== '' && (
                            <>
                                <label
                                    htmlFor='toursOption'
                                    className='post-review-tour-title'>
                                    Select a tour
                                </label>
                                <select id="toursOption">
                                    <>
                                        {toursData.map(tour => (
                                            <option key={tour.id} value={tour.id}>{tour.name}</option>
                                        ))}
                                    </>
                                </select>
                                <button className="next" onClick={nextPage}>Next</button>
                            </>
                        )}

                        {reviewPage === 1 && (
                            <>
                                <textarea
                                    required
                                    onChange={fillData}
                                    name="review"
                                    placeholder='Review description'
                                    className="new-review-area" />
                                <div className='next-prev-container'>
                                    <button className="back" onClick={previousPage}>Back</button>
                                    <button className="next" onClick={nextPage}>Next</button>
                                </div>
                            </>
                        )}

                        {reviewPage === 2 && (
                            <>
                                <input
                                    type="number"
                                    onChange={fillData}
                                    required
                                    placeholder='Rating 1 to 5'
                                    name='rating'
                                    className='rating-input' />
                                <div className='next-prev-container'>
                                    <button className="back" onClick={previousPage}>Back</button>
                                    <button className="next" onClick={nextPage}>Next</button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            )}
        </>
    )
}

export default CreateReview;
