import { useState, useEffect } from "react"
import useFetch from "../commonComponents/useFetch"
import { useContext } from "react"
import { SingleTourContext } from "./TourPage"

function TourReviews() {
    const {tour} = useContext(SingleTourContext)
    const {id: tourId, name: tourName} = tour;
    const [reviews, setReviews] = useState(null);
    const {data, error} = useFetch(`http://127.0.0.1:3000/api/v1/tours/${tourId}/reviews`);


    useEffect(() => {
        if(data !== null)   setReviews(data.reviews)
    } ,[data, setReviews]);


    return (
        <>
            {!error && reviews !== null && (
                <>
                    <div className="tour-reviews-title">{tourName} Reviews</div>
                    <div className="tour-reviews">
                        {reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <img                                        // default photo placed in user's photo dir
                                        src={`./../../img/users/${review.fromUser.photo ? review.fromUser.photo : "default.jpg"}`}
                                        alt="user photo" />
                                    <p className="review-user-name">{review.fromUser.name}</p>
                                </div>
                                <div className="review-body">
                                    <div className="review-rating">
                                        <p className="text">rating: </p>
                                        <p className="value">{review.rating} / 5</p>
                                    </div>
                                    <div className="review-description">
                                        <p className="text">review: </p>
                                        <p className="value">{review.review}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default TourReviews;