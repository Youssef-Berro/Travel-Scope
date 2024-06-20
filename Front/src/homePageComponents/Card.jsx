import './../css/Card.css';
import {Link} from 'react-router-dom'

function Card(props) {
    // eslint-disable-next-line react/prop-types
    const tour = props.tour;

    const renderStars = (rating) => {
        const filledStars = Math.floor(rating);
        const starArray = [];

        for (let i = 1; i <= 5; i++) {
            starArray.push(
                <span key={i} className={i <= filledStars ? "star filled" : "star"}>
                    ★
                </span>
            );
        }

        return starArray;
    };

    const singleCard = (
        <div className="card">
            <div className="card-header">
                <div className="card-picture">
                    {/* eslint-disable-next-line react/prop-types */}
                    <img src={`./../../img/tours/${tour.imageCover}`} alt={`${tour.name}`} className="card-picture-img" />
                </div>
                {/* eslint-disable-next-line react/prop-types */}
                <div className="card-title">{tour.name}</div>
            </div>

            <div className="card-details">
                {/* eslint-disable-next-line react/prop-types */}
                <p className="card-sub-heading">{tour.difficulty} {tour.duration}-day tour</p>
                {/* eslint-disable-next-line react/prop-types */}
                <p className="card-text">{tour.summary}</p>
                <div className="rating">
                    <span className='rating-text'>rating</span>
                    {/* eslint-disable-next-line react/prop-types */}
                    <span>{renderStars(tour.ratingsAverage)}</span>
                </div>
            </div>

            <div className="card-footer">
                <p className='card-price'>
                    {/* eslint-disable-next-line react/prop-types */}
                    <span className="value">${tour.price}</span> &nbsp;&nbsp;
                    <span className="text">per person</span>
                </p>
                {/* eslint-disable-next-line react/prop-types */}
                <Link to={`${tour.slugedName}`} className="detail-btn">Details</Link>
            </div>
        </div>
    );

    return <>{singleCard}</>;
}

export default Card;
