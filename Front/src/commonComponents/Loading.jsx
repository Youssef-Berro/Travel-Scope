import './../css/Common.css'

function Loading() {
    return (
        <>
            <div className="loader">
                <span className="loader-text">loading</span>
                <span className="load"></span>
            </div>
            <div className="overlay"></div>
        </>
    )
}

export default Loading;