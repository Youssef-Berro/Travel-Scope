import { useEffect, useState } from "react"
import useFetch from "../commonComponents/useFetch"

function ToursStatistics() {
    const [stats, setStats] = useState([])
    const {data} = useFetch('http://127.0.0.1:3000/api/v1/tours/tour-stats');

    useEffect(() => {
        if(data !== null)    setStats(data.stats)
    }, [data]);


    return (
        <>
            <div className="difficult-statictics">
                <p className="stats-title">Statistics for each difficulty</p>
                <div className="stats-container">
                    {stats.map(stat => (
                        <div key={stat._id} className="stat-card">
                            <p className='title'>{stat._id}</p>
                            <div className='data'>
                                <div>
                                    <p className='text'>Average Price:</p>
                                    <p className="value">{stat.avgPrice}</p>
                                </div>
                                <div>
                                    <p className='text'>Average Rating:</p>
                                    <p className="value">{stat.avrRatings}</p>
                                </div>
                                <div>
                                    <p className='text'>Max Price:</p>
                                    <p className="value">{stat.maxPrice}</p>
                                </div>
                                <div>
                                    <p className='text'>Min Price:</p>
                                    <p className="value">{stat.minPrice}</p>
                                </div>
                                <div>
                                    <p className='text'>Number of ratings:</p>
                                    <p className="value">{stat.nbOfRatings}</p>
                                </div>
                                <div>
                                    <p className='text'>Number of Tours:</p>
                                    <p className="value">{stat.numTours}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}


export default ToursStatistics;