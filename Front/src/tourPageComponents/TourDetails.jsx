import TourGuides from "./TourGuides"
import { useContext } from "react"
import { SingleTourContext } from "./TourPage"

function TourDetail()  {
    const {tour} = useContext(SingleTourContext)


    return (
        <div className="tour-detail">
            <div className="detail-cont1">
                <div className="quick-facts">
                    <div className='desc-title'>Quick facts</div>
                    <div className="fields">
                        <div className="field">
                            <span className='text'>next date</span> &nbsp;&nbsp;
                            <span className='value'>
                                {new Date(tour.startDates[0]).toISOString().split('T')[0]}
                            </span>
                        </div>
                        <div className="field">
                            <span className='text'>dfficulty</span> 
                            &nbsp;&nbsp;
                            <span className='value'>{tour.difficulty}</span>
                        </div>
                        <div className="field">
                            <span className='text'>participants</span> 
                            &nbsp;&nbsp;
                            <span className='value'>{tour.maxGroupSize} people</span>
                        </div>
                        <div className="field">
                            <span className='text'>rating</span> 
                            &nbsp;&nbsp;
                            <span className='value'>{tour.ratingsAverage}/5</span>
                        </div>
                    </div>
                </div>
                <div className="guides">
                    <div className="desc-title">your tour guides</div>
                    <div className="guides-info">
                        {tour.guides.map((el, index) => 
                            <TourGuides guide={el} key={`${el.id}-${index}`} />
                        )}
                    </div>
                </div>
            </div>
            <div className="detail-cont2">
                <p className='desc-title'>About {tour.name}</p>
                <div>{tour.description}</div>
            </div>
        </div>
    )
}


export default TourDetail;