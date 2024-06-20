import Header from './commonComponents/Header'
import Main from './homePageComponents/Main'
import Footer from './commonComponents/Footer'
import { Routes, Route } from 'react-router-dom'
import { createContext, useState } from 'react'
import { TourPage } from './tourPageComponents/TourPage'
import SignUp from './UserComponents/SignUp'
import LogIn from './UserComponents/LogIn'
import UserPage from './UserComponents/UserPage'
import ChangePassword from './UserComponents/ChangePassword'
import CreateReview from './UserComponents/CreateReview'
import BecomeAGuide from './UserComponents/BecomeAGuid'
import ForgetPassword from './UserComponents/ForgetPassword'
import ResetPassword from './UserComponents/ResetPassword'
import ScrollTopBtn from './commonComponents/ScrollTopBtn'

// fix reset passsword url (thomas)
// login and sign up UI

const ToursContext = createContext();
const UserContext = createContext();

function App() {
    const [userData, setUserData] = useState({});
    const [toursData, setToursData] = useState([]);

    return (
        <>
        <ToursContext.Provider value = {{toursData, setToursData}}>
        <UserContext.Provider value = {{userData, setUserData}}>
            <Header/>
            <Routes>
                <Route path='/' element={<Main />} />
                <Route path='/:tour' element={<TourPage />} />
                <Route path='/sign-up'element={<SignUp />} />
                <Route path='/log-in' element={<LogIn/>} />
                <Route path='/user-info' element={<UserPage/>} />
                <Route path='/change-password' element={<ChangePassword/>}/>
                <Route path='/create-review' element={<CreateReview/>}/>
                <Route path='/become-a-guid' element = {<BecomeAGuide />} />
                <Route path='/forget-password' element = {<ForgetPassword />} />
                <Route path='/reset-password/:resetPasswordToken' element = {<ResetPassword />} />
            </Routes>
            <Footer />
            <ScrollTopBtn />
        </UserContext.Provider>
        </ToursContext.Provider>
        </>
    )
}

export {
    App,
    UserContext,
    ToursContext
}
