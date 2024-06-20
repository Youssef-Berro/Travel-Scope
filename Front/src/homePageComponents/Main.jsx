import { useContext, useEffect } from "react"
import './../css/Loading.css'
import { ToursContext } from '../App'
import './../css/Main.css'
import Card from './Card'
import BusiestMonth from './BusiestMonth'
import ToursStatistics from './ToursStatistics'
import useFetch from '../commonComponents/useFetch'
import SignUp from '../UserComponents/SignUp'

function Main() {
    const token = localStorage.getItem('token');
    const {toursData, setToursData} = useContext(ToursContext);
    const {data } = useFetch("http://127.0.0.1:3000/api/v1/tours");


    useEffect(() => {
        if (data !== null)    setToursData(data.data.docs);
    }, [data, setToursData])


    return (
        <>
            {toursData.length !== 0 ? (
                <>
                    <main>
                        {toursData.map((tour) => (
                            <Card className='Card' key={tour.id} tour={tour} />
                        ))}
                    </main>
                    <hr />
                    <BusiestMonth />
                    <hr />
                    <ToursStatistics />
                    {!token && 
                        <>
                            <hr />
                            <SignUp title='Sign Up' fromMain = 'true' />
                        </>
                    }
                </>
            ) : (
                <div className='loading'></div>
            )}
        </>
    )   
}


export default Main;