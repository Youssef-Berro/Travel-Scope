const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
    },
    slugedName: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: { // enum only work in Strings
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'], 
        set: val => val.toFixed(2)
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // "this" keyword points to the new document created
                return val < this.price;
            },
        message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false // in response will not appear
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type :{
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
        }
    ],
    guides: [{
        type : mongoose.Schema.ObjectId,
        ref: 'User'
        }] 
},{
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
});


tourSchema.index({price : 1});
tourSchema.index({startLocation: '2dsphere'}) // for mapbox

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review', // reference model name in DB
    foreignField: 'toTour', // name of the tour reference field in review model
    localField: '_id' // for what toTour is referenced in review model
})

tourSchema.pre('save', function(next) {
    this.slugedName = slugify(this.name, {lower: true, remove: null});
    next();
})




// query middleware
tourSchema.pre(/^find/, function(next) {
    this.find({secretTour : { $ne : true}})
    this.start = Date.now();
    next();
})


tourSchema.pre(/^find/, function(next) {
    this.populate({
        path : 'guides',
        select: '-__v'
    })

    next();
})



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

