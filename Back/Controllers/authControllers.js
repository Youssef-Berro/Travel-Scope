const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const User = require('./../Models/UserModel');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const {createCookie, excludeFields, generateToken} = require('./middlewares');
const {ErrorHandling, handleDuplicateFieldsDB, handleUserNotFound} = require('./errorHandling');

const signUp = async (req, res, next) => {
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            // photo: req.photo, 
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });


        const token = generateToken({id : newUser._id});
        createCookie('jwt', res, token);
        excludeFields(newUser, 'password', 'passwordChangedAt', 'active');

        res.status(201).json({
            status: 'success',
            token,
            data: {newUser}
        })
    } catch(err) {
        if(err.code == 11000) {
            const key = `${Object.keys(err.keyValue)[0]}`;
            return next(new handleDuplicateFieldsDB(400, key, err.keyValue[key]));
        }

        next(new ErrorHandling(err.message, 400));
    }
}


const logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new ErrorHandling(`provide email and password`);


        const user = await User.findOne({ email: email }).select('+password');
        if (!user)   throw new handleUserNotFound(`incorrect email or password`, 401);


        const isPasswordCorrect = await user.checkCorrectPassword(password, user.password);
        if(!isPasswordCorrect)   throw new handleUserNotFound(`incorrect email or password`, 401);


        const token = generateToken({ id: user._id });
        createCookie('jwt', res, token);


        res.status(200).json({
            status: 'success',
            token,
        })

    } catch(err) {
        if (err.name === 'UserNotFound')    return next(err);
        
        next(new ErrorHandling(err.message, 400));
    }
}



const forgetPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user)   throw new ErrorHandling('invalid email address', 404);

        
        // we save the user because after using getResetPasswordToken, passwordResetToken and
        // passwordResetTokenExpiry should be in the document 
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave : false }); 

        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new 
        password and passwordConfirm to: ${resetURL}.\nIf you didn't forget it, please ignore this message`;

        try{
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 15 min)',
                message
            });
            res.status(200).json({
                status: 'success',
                message: 'Token send to email'
            })
        } catch(err) {

            user.passwordResetToken = undefined;
            user.passwordResetTokenExpiry = undefined;
            return next(new ErrorHandling('there is an error via sending email, try again later', 500))
        }

    } catch(err) {
        if(err.message === 'invalid email address')  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const resetPassword = async (req, res, next) => {
    try{
        // same algorithm when the token was encrypted
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        
        const user = await User.findOne({passwordResetToken: hashedToken,
                                        passwordResetTokenExpiry : {$gt: Date.now() }})
        
        if(!user) throw new ErrorHandling("token no longer exist", 401);
        if((!req.body.password) || (!req.body.passwordConfirm))
            throw new ErrorHandling('you must fill your new password with confirm one', 400);
        
        // no need to check if pass == passConfirm because there is a validator in the User Schema check it
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        user.passwordChangedAt = Date.now();
        await user.save(); // we don't turn of the validators because we need to validate fields


        res.status(200).json({
            status: 'success'
        })
    } catch(err) {
        if(err.message === 'token no longer exist' ||
        err.message === 'you must fill your new password with confirm')
            return next(err)

        return next(new ErrorHandling(err.message, 400));
    }
}



const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("+password");
        if(!user)   throw new ErrorHandling('invalid user', 401);


        // check if the current password is correct
        const isPasswordCorrect = await user.checkCorrectPassword(req.body.oldPassword, user.password);
        if(!isPasswordCorrect)   throw new handleUserNotFound(`incorrect old password`, 401);


        // check if new password and confirm password found or not
        if((!req.body.newPassword) || (!req.body.passwordConfirm))
            throw new ErrorHandling('invalid password', 401)

        // we don't use User.findByIdAndUpdate because validators are not checked in updating
        // only on save and create, also the pre save middlewares will not be executed
        user.password = req.body.newPassword;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        const token = generateToken({id : user._id});
        createCookie('jwt', res, token);

        res.status(200).json({
            status: 'success',
            token
        })
    } catch (err) {
        if((err.statusCode === 401) || (err.statusCode === 403) || (err.statusCode === 404))
            return next(err);
        
        next(new ErrorHandling(err.message, 400));
    }
}

module.exports = {
    signUp,
    logIn,
    forgetPassword,
    resetPassword,
    updatePassword
}