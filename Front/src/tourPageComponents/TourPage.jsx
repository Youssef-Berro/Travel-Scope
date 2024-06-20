import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useFetch from "../commonComponents/useFetch"
import TourHead from './TourHead'
import TourDetails from './TourDetails'
import './../css/TourPage.css'
import TourReviews from './TourReviews'
import TourImages from "./TourImages"
import Map from './Map'
import { createContext } from "react"
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const SingleTourContext = createContext();

function TourPage() {
    const path = useNavigate();
    const params = useParams();
    const {data, error} = useFetch(`http://127.0.0.1:3000/api/v1/tours/${params.tour}`)
    const [tour, setTour] = useState(null);

    useEffect(() => {
        if(data !== null)   setTour(data.data.tour)
    }, [data])

    useEffect(() => {
        if(error)
        {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'invalid tour',
                showConfirmButton: false,
                timer: 1500
            })
            path('/');
        }
    }, [error])
    
    return (
        <SingleTourContext.Provider value = {{tour, setTour}}>
            {tour !== null ? (
                <>
                    <TourHead/>
                    <TourDetails/>
                    <TourImages />
                    <Map />
                    <TourReviews/>
                </>
            ) : <div className="loading"></div>}
        </SingleTourContext.Provider>
    )
}

export { 
    TourPage,
    SingleTourContext
};