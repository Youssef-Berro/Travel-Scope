const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: './../config.env'});
const User = require('./../Models/UserModel');
const {ErrorHandling} = require('./errorHandling');




const topTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulaty,__v';
    req.query.sort = '-ratingsAverage,price';
    next();
}


const checkTokenValidity = async (req, res, next) => {
    try{
        let token = req.headers.authorization;

        if(!token)  throw new ErrorHandling('you are not log in', 401);

        if(!token.startsWith('Bearer'))   throw new ErrorHandling('token must start with Bearer ', 403); 
        token = token.split(' ')[1];

        const decode = jwt.verify(token, process.env.SECRET_JWT);

        const decodedUser = await User.findById(decode.id);
        if(!decodedUser)   throw new ErrorHandling('the user belonging to this token does no longer exist', 401)

        // check if the user change his password after the token was generated
        if(decodedUser.isChangedPassword(decode.iat))
            throw new ErrorHandling('user recently changed password, log in again', 401)

        req.user = decodedUser;
        next();
    } catch(err) {
        if(err.statusCode)  return next(err);

        return next(new ErrorHandling(err.message, 400));
    }
}


// 403 : forbidden
const checkAuthorizationLevel = (...roles) => {
    return (req, res, next) => {

        if(!roles.includes(req.user.role)) {
            const error = new ErrorHandling("you don't have the permission to perform this action", 403);
            return next(error);
        }
        next();
    }
}


// const checkDeletedUsers = async (req, res, next) => {
//     thirtyDays = 30 * 24 * 60 * 60 * 1000;
//     await User.deleteMany({active: false, de_activatedAt : { $lt : Date.now() - thirtyDays}});

//     next();
// }



function excludeFields(obj, ...fields) {
    fields.forEach(el => obj[el] = undefined);
}

// cookie name should be unique so when a cookie be sended with the response and there is before a cookie
// this the same name => overwrite
function createCookie(name, response, token) {
    response.cookie(name, token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 24 * 60 * 60 * 1000),
        // secure = true mean cookies will only be send on an encrypted connection (HTTPS)
        secure : process.env.JWT_COOKIE_EXPIRED_IN === 'production',
        httpOnly: true // mean the cookie cannot be accessed or modified by the browser, only we can recieve and send a cookie
    }) 
}


function generateToken(payload)
{
    return jwt.sign(payload , process.env.SECRET_JWT, {
        expiresIn: process.env.JWT_EXPIRED_IN
    })
}



const filterBodyForUserUpdating = (req, res, next) => {
    if((req.body.password) || (req.body.passwordConfirm))
        throw new ErrorHandling(`you cannot update password here, if you need to update your password go to /update-password`, 400);

    // from this route the user only can update his name, email and photo
    req.body = filterObj(req.body, 'name', 'email', 'photo');

    next();
}


const filterObj = (obj, ...fields) => {
    const result = {};

    Object.keys(obj).forEach(ele => {
        if(fields.includes(ele))    result[ele] = obj[ele];
    })

    return result;
}


const setReviewReferences = (req, res, next) => {
    if(!req.body.fromUser)  req.body.fromUser = req.user.id; // from checkTokenValidity middleware
    if(!req.body.toTour)    req.body.toTour = req.params.tourId; // tour endpoint param

    next();
}



module.exports = {
    topTours,
    checkTokenValidity,
    checkAuthorizationLevel,
    excludeFields,
    generateToken,
    createCookie,
    filterBodyForUserUpdating,
    setReviewReferences
}
