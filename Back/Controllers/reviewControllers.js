const Review = require('./../Models/reviewModel');
const factory = require('./handlerFactory');

const createReview = factory.createOne(Review);
const getReview = factory.getOne(Review);
const getAllReviews = factory.getAll(Review);


module.exports = {
    getAllReviews,
    createReview,
    getReview
}