import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function useFetch(url, token = 'no-token') {
    const path = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                let resp = {};

                if(token === 'no-token')
                    resp = await axios.get(url);
                else    resp = await axios.get(url, {headers: {Authorization: `Bearer ${token}`}})

                setData(resp.data);
            } catch (err) {
                setError(err);

                // token expired {special case}
                const msg = err.response.data.message;
                if((msg === 'jwt expired') || (msg === 'invalid signature')) {
                    localStorage.clear();
                    path('log-in');
                }
            } 
        }

        fetchData();
    }, [url]);

    return { data, error };
}

export default useFetch;
