const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({path: './../config.env'});

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'a user must contain a name'],
        maxlength: [30, 'user name must be less than 40 character'],
        minlength: [8, 'user name must bi greater than 10 character']
    },
    email : {
        type: String,
        required: [true, 'a user must contain an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'invalid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type : String,
        enum: { // enum only work in Strings
            values: ['user', 'guid', 'lead-guid', 'admin'],
            message: 'role is either: user, guid, lead-guid or admin'
        },
        default: 'user'
    },
    password: {
        type : String,
        required: [true, 'a user must contain a password'],
        minlength: [8, 'a password must contain at least 8 characters'],
        select: false
    },
    passwordConfirm: {
        type : String,
        required: [true, 'a user must contain a confirm password'],
        validate: {
            validator: function(val) { // remember only work in create and save
                return val === this.password;
            },
            message: 'password confirm not equal to your password'
        }
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetTokenExpiry: Date,
    active : {
        type : Boolean,
        default: true,
        select: false
    },
    de_activatedAt : {
        type : Date,
        default : undefined
    }
})


userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))    return next(); 

    // efficient salt = 12, because it doesn't take to long time and it's fine encrypted
    this.password = await bcrypt.hash(this.password, 12); 
    this.passwordConfirm = undefined;
    next();
})


userSchema.pre('save', async function(next) {
    if(!this.isModified("password") && this.isNew)  return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})


userSchema.pre(/^find/, function(next) {
    this.find( {active : { $ne : false} });
    next();
})



userSchema.methods.checkCorrectPassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}

userSchema.methods.isChangedPassword = function(tokenIssuedTime) {
    return this.passwordChangedAt ? (this.passwordChangedAt.getTime() > (tokenIssuedTime * 1000)) : false;
}


userSchema.methods.getResetPasswordToken = function() {
    let resetToken = crypto.randomBytes(32).toString('hex');

    // resetToken will stay at the original token and passwordResetToken attrb will be 
    // the hashed version, so after that when we need to verify if the token is true
    // we hash the resetToken variable and compare it the passwordResetToken
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiry = Date.now() + (15 * 60 * 1000) // 15 min

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;