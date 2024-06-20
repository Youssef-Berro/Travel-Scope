const express = require('express');
const tourControllers = require('./../Controllers/tourControllers')
const reviewControllers = require('./../Controllers/reviewControllers');
const middlewares = require('./../Controllers/middlewares');
const router = express.Router();


router.get('/', tourControllers.getTours)
router.get('/tour-stats', tourControllers.getStats)
router.get('/:slugedName', tourControllers.getTourBySlug);
router.get('/busiest-month/:year', tourControllers.getBusiestMonth)
router.get('/top-5-tours', middlewares.topTours, tourControllers.getTours)
router.get('/distances/:latitude/:longitude/:unit', tourControllers.calcDistances)
router.get('/nearest-tours/:distance/:latitude/:longitude/:unit', tourControllers.tourWithinRadius);


// we use this nested router because in real app we can get the tour id from the current tour,
// and the user id from the logged in user
// HARDERST 2 ROUTERS
router.route('/:tourId/reviews')
        .get(tourControllers.getTourReviews)
        .post(middlewares.checkTokenValidity, middlewares.checkAuthorizationLevel('user'),
                middlewares.setReviewReferences,
                reviewControllers.createReview)



router.use(middlewares.checkTokenValidity); // middleware

router.use(middlewares.checkAuthorizationLevel('admin', 'lead-guid')); // middleware
router.post('/', tourControllers.createTour)
router.route('/:id').patch(tourControllers.updateTour).delete(tourControllers.deleteTour)

module.exports = router;