const User = require('./../Models/UserModel')
const factory = require('./handlerFactory');
const ErrorHandling = require('./errorHandling').ErrorHandling;


// administrator can delete anyone
const deleteUser = factory.deleteOne(User);
const updateUser = factory.updateOne(User);
const getUser = factory.getOne(User);
const getUsers = factory.getAll(User);




// when a user delete himself he will be de-activated not deleted
const deleteMe = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.user.id, {active : false, de_activatedAt: Date.now()})

        res.status(204).json({
            success: 'success',
            data: null
        })

    } catch(err) {
        next(new ErrorHandling('action failed due error', 400));
    }
}


// not an endpoint
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next(); 
}



// const activateUser = async (req, res, next) => {
//     try{
//         const user = await User.findByIdAndDelete(req.user.id, {active: true, de_activatedAt: undefined}, {
//             new : true,
//             runValidators: true
//         })

//         res.status(200).json({
//             status: 'success',
//             data : {
//                 name : user.name,
//                 email: user.email,
//                 role : user.role
//             }
//         })
//     } catch(err) {
//         next(new ErrorHandling('activation failed', 400));
//     }
// }


const becomeGuid = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id,
                {role : 'guid'},
                {new: true, runValidators: true});

        if(!user)   throw new ErrorHandling('user no longer exist', 404);
        next();


    } catch(err) {
        if(err.statusCode === 404)  return next(err);

        return next(new ErrorHandling(err.message, 400));
    }
}


module.exports = {
    getUser,
    updateUser,
    deleteMe,
    deleteUser,
    getUsers,
    getMe,
    becomeGuid
}