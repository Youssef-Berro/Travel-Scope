import { useState, useEffect } from 'react'
import useFetch from '../commonComponents/useFetch'

function BusiestMonth() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [dataOne, setDataOne] = useState(null);
    const [dataTwo, setDataTwo] = useState(null);
    const [dataThree, setDataThree] = useState(null);
    
    const { data: dataOneFetch } = useFetch('http://127.0.0.1:3000/api/v1/tours/busiest-month/2021');
    const { data: dataTwoFetch } = useFetch('http://127.0.0.1:3000/api/v1/tours/busiest-month/2022');
    const { data: dataThreeFetch } = useFetch('http://127.0.0.1:3000/api/v1/tours/busiest-month/2023');

    useEffect(() => {
        if (dataOneFetch !== null) setDataOne(...dataOneFetch.data.busiestMonth);
    }, [dataOneFetch]);

    useEffect(() => {
        if (dataTwoFetch !== null) setDataTwo(...dataTwoFetch.data.busiestMonth);
    }, [dataTwoFetch]);

    useEffect(() => {
        if (dataThreeFetch !== null) setDataThree(...dataThreeFetch.data.busiestMonth);
    }, [dataThreeFetch]);


    const getMonth = number => months[number - 1];

    return (
        <div>
            {dataOne && dataTwo && dataThree && (
                <div className='busiest-month'>
                    <p className="busiest-month-title">Busiest Month</p>
                    <div className="years-container">
                        <div className="year">
                            <p className='title'>2021</p>
                            <div className='data'>
                                <div className="field one" style={{ width: '50%' }}>
                                    <p className='text'>Month:</p>
                                    <p className="value">{getMonth(dataOne._id)}</p>
                                </div>
                                <div className="field two">
                                    <p className='text'>Number of Tours in This Month:</p>
                                    <p className="value">{dataOne.count}</p>
                                </div>
                                <div className='month-tours'>
                                    <p className='text'>Tours:</p>
                                    <div className='value'>
                                        {dataOne.tours.map((tour, index) => (
                                            <div className='month-tour' key={index}>•{tour}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="year">
                            <p className='title'>2022</p>
                            <div className='data'>
                                <div className="field one" style={{ width: '50%' }}>
                                    <p className='text'>Month:</p>
                                    <p className="value">{getMonth(dataTwo._id)}</p>
                                </div>
                                <div className="field two">
                                    <p className='text'>Number of Tours in This Month:</p>
                                    <p className="value">{dataTwo.count}</p>
                                </div>
                                <div className='month-tours'>
                                    <p className='text'>Tours:</p>
                                    <div className='value'>
                                        {dataTwo.tours.map((tour, index) => (
                                            <div className='month-tour' key={index}>•{tour}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="year">
                            <p className='title'>2023</p>
                            <div className='data'>
                                <div className="field one" style={{ width: '50%' }}>
                                    <p className='text'>Month:</p>
                                    <p className="value">{getMonth(dataThree._id)}</p>
                                </div>
                                <div className="field two">
                                    <p className='text'>Number of Tours in This Month:</p>
                                    <p className="value">{dataThree.count}</p>
                                </div>
                                <div className='month-tours'>
                                    <p className='text'>Tours:</p>
                                    <div className='value'>
                                        {dataThree.tours.map((tour, index) => (
                                            <div className='month-tour' key={index}>•{tour}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BusiestMonth;
