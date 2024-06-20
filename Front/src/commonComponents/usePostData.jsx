import { useState} from "react"
import axios from "axios"

function usePostData(url, token = 'no-token') {
    const [error, setError] = useState(null);

    const postData = async (data) => {
        try {
            let resp = {};

            if(token === 'no-token')
                resp = await axios.post(url, data);
            else    resp = await axios.post(url, data, {headers: {Authorization: `Bearer ${token}`}})

            return resp.data;
        } catch (err) {
            setError(err);
        } 
    }

    return { error, postData };
}

export default usePostData;
