import { useContext } from "react"
import { SingleTourContext } from "./TourPage"

function TourHead()  {
    const {tour} = useContext(SingleTourContext)
    return (
        <div className="tour-head">
            <p className="title">{tour.name}</p>
            <img src={`./../../img/tours/${tour.imageCover}`} alt="Tour image"/>
        </div>
    )
}


export default TourHead;