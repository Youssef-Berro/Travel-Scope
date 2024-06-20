const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./UserModel');
// const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
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
        min: [1, 'Rating must be above 1.0'], // min and max works in numbers and dates,
        max: [5, 'Rating must be below 5.0'], // in case of Strings use maxlength and maxlength
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
        }] // mongoose automaticaly know which model this field reference, so no need to import User model
},{
    toJSON: { virtuals: true, getters: true }, // Include virtuals and getters in toJSON output
    toObject: { virtuals: true, getters: true }, // Include virtuals and getters in toObject output
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


// document middleware
tourSchema.pre('save', function(next) {
    this.slugedName = slugify(this.name, {lower: true, remove: null});
    next();
})


// document middleware
// tourSchema.post('save', (doc, next) => {
//     console.log(doc);
//     next();
// })


// query middleware
tourSchema.pre(/^find/, function(next) {
    this.find({secretTour : { $ne : true}})
    this.start = Date.now();
    next();
})


tourSchema.pre(/^find/, function(next) {
    this.populate({
        path : 'guides',
        select: '-__v' // exclude
    })

    next();
})


// // aggregate middleware
// tourSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({$match : {secretTour : {$ne : true}}});
//     next();
// })


// query middleware
// tourSchema.post(/^find/, function(doc, next) {
//     // don't worry by using this.start in pre and post with find event, the start var does not
//     // be included in the response because this refer to the whole response (query, header...)
//     // so the user will only get the query then start var will not be added to him
//     console.log(`The request tooks: ${Date.now() - this.start}`)
//     next();
// })




const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;


// if you need to embed the guides document in the tour model, use this pre save middleware
// also the guides field should be guides : Array, so in each index of this array we store
// the guide document from the User model
// it's prefer to use reference, instead of embedding because, let a user data are updated
// then we need to query in the tour model and check if this user also belong to the tour model
// and this operation will take a time to execute
// tourSchema.pre('save',async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })







// example of documention creation manualy
// const newDoc = Tour({
//     name: "The SSS",
//     price: 997,
//     rating: 4.5
// });

// newDoc.save()
//         .then(doc => {console.log(doc)})
//         .catch(err => {console.log(err.message)});
