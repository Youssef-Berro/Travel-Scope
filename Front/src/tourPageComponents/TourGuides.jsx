/* eslint-disable react/prop-types */
function TourGuides(props) {
    const guide = props.guide;


    return (
        <div className="guide">
            <img className="guide-image" src={`./../../img/users/${guide.photo}`} alt="image" />
            <p className="guide-name">{guide.name}</p>
        </div>
    )
}

export default TourGuides;