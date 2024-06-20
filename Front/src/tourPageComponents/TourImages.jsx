import { SingleTourContext } from "./TourPage"
import { useContext } from "react"

function TourImages() {
    const {images} = useContext(SingleTourContext).tour;

    return (
        <>
            <div className="tour-images-cont">
                <div className="tour-images">
                    {images.map((image, index) => (
                        <div key={index} className="tour-image">
                            <img src={`./../../img/tours/${image}`} alt="tour image" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default TourImages;