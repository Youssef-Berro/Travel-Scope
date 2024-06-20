const reviewControllers = require('./../Controllers/reviewControllers');
const express = require('express');
const router = express.Router();
const middlewares = require('./../Controllers/middlewares');

// now all the following routers are protected
router.use(middlewares.checkTokenValidity);


router.route('/')
        .get(reviewControllers.getAllReviews)
        .post(middlewares.checkAuthorizationLevel('user'), reviewControllers.createReview);


// there is no update or delete review endpoints
router.get('/:id', reviewControllers.getReview);


module.exports = router;