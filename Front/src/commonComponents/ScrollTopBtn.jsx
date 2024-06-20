import { useEffect, useState } from 'react';
import './../css/ScrollTopBtn.css'
function ScrollTopBtn() {

    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 300) 
            setIsVisible(true);
        else    setIsVisible(false);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);


    return (
        <button className={`scroll-top-btn ${isVisible ? 'visible' : ''}`} onClick={scrollToTop}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 3l-9 9h6v9h6v-9h6z" />
            </svg>
        </button>
    )
}

export default ScrollTopBtn;