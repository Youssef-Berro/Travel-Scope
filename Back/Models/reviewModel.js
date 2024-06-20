const mongoose = require('mongoose');
const Tour = require('./TourModel')

const reviewSchema = new mongoose.Schema({
    review : {
        type : String,
        require: [true, 'review cannot be empty']
    },
    rating : { 
        type: Number,
        require : true,
        min: 1,
        max: 5
    },
    createdAt : {
        type : Date,
        default: Date.now(),
        select: false
    },
    toTour : {
        type: mongoose.Schema.ObjectId,
        ref : "Tour",
        require: [true, 'Review must belong to a tour']
    },
    fromUser : {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        require: [true, 'Review must be from a user']
    }

},{// to display the virtual of tour model
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


// user cannot make more than one review on the same tour
// 1 or -1 only matter in case of Number fields (asc, desc)
reviewSchema.index({toTour: 1, fromUser : 1}, {unique: true})


reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: {toTour : tourId}
        },
        {
            $group: {
                _id: null,
                nbOfRatings: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ])

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nbOfRatings,
        ratingsAverage: stats[0].avgRating
    })
}

reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.toTour)
})


reviewSchema.pre(/^find/, function(next) {
    this.populate('fromUser', 'name photo'); // we don't populate the tour ref to break the chain
    next();
})


const Review = mongoose.model('Review', reviewSchema)

module.exports = Review;