const express = require('express');
const router = express.Router();
const middlewares = require('./../Controllers/middlewares');
const authControllers = require('./../Controllers/authControllers');
const userControllers = require('./../Controllers/userControllers');
const tourControllers = require('./../Controllers/tourControllers');
const multer = require('multer');


router.post('/sign-up',  authControllers.signUp)
router.post('/log-in', authControllers.logIn)
router.post('/forget-password', authControllers.forgetPassword)
router.patch('/reset-password/:token', authControllers.resetPassword)


router.use(middlewares.checkTokenValidity);

router.patch('/become-a-guid',
                middlewares.checkAuthorizationLevel('user'),
                userControllers.becomeGuid,
                tourControllers.addGuid)

router.get('/me', userControllers.getMe, userControllers.getUser);
router.patch('/update-password', authControllers.updatePassword); 
router.delete('/delete-me', userControllers.deleteMe); // => active : false


const storage = multer.diskStorage({
        destination: (req, file, cb) => {
                return cb(null, './../Front/img/users');
        },
                filename: (req, file, cb) => {
                return cb(null, file.originalname);
        }
})

const upload = multer({storage});
router.patch('/', 
        upload.single('photo'), 
        middlewares.filterBodyForUserUpdating, 
        userControllers.updateUser);



router.use(middlewares.checkAuthorizationLevel('admin'));

router.get('/', userControllers.getUsers)
router.route('/:id')
        .get(userControllers.getUser)
        .delete(userControllers.deleteUser);

// router.delete('/activate-user', userControllers.activateUser);



module.exports = router;