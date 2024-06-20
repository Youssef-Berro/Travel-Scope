const Tour = require('./../Models/TourModel');
const factory = require('./handlerFactory');
const { ErrorHandling } = require('./errorHandling');


// in case the user add feild not found in the tour Schema they will not added
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);
const getTour = factory.getOne(Tour, 'reviews');
const getTours = factory.getAll(Tour);


const getTourBySlug = async (req, res, next) => {
    try{
        const tour = await Tour.findOne({slugedName : req.params.slugedName})
        if(!tour)   throw new ErrorHandling('tour not found!', 404);

        res.status(200).json({
            status: 'success',
            data: {tour}
        })
    } catch(err) {
        if(err.statusCode === 404)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const getTourReviews = async (req, res, next) => {
    try{
        const tour = await Tour.findById(req.params.tourId).populate('reviews', '-createdAt -__v');
        const reviews = tour.reviews;


        res.status(200).json({
            status: 'success',
            nbOfReviews: reviews.length,
            reviews
        })
    } catch(err) {
        next(new ErrorHandling(err.message, 400));
    }
}

// /nearest-tours/:distance/:latitude/:longitude/:unit
const tourWithinRadius = async (req, res, next) => {
    try{
        const {distance, latitude, longitude, unit} = req.params;

        if(!latitude || !longitude)
            throw new ErrorHandling('provide latitude and longitude in the second param as lat,lin format', 400)

        if(isNaN(distance))
            throw new ErrorHandling('provide a distance as number in the first param', 400)

        if((unit !== 'km') && (unit !== 'mi'))
            throw new ErrorHandling('unit must be km or ml in the third(last) param', 400)


        const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
        const tours = await Tour.find({
            startLocation: { $geoWithin : {$centerSphere: [[longitude, latitude], radius]}}
        })


        res.status(200).json({
            status: 'success',
            nbOfResults: tours.length,
            data: {...tours}
        })

    } catch(err) {
        if(err.statusCode === 400)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


// distances/:latitude/:longitude/:unit
const calcDistances = async (req, res, next) => {
    try{
        const {latitude, longitude, unit} = req.params;

        if(!latitude || !longitude)   throw new ErrorHandling('provide latitude and longitude in params as lat/lin format', 400)
        if((unit !== 'km') && (unit !== 'mi'))  throw new ErrorHandling('unit must be km or ml in the third(last) param', 400)
        
        const multiplier = unit === 'km' ? 0.001 : 0.000621371
        const distances = await Tour.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [Number(longitude), Number(latitude)]
                    },
                    distanceField: 'distance', // field name
                    distanceMultiplier: multiplier // convert m to km
                }
            },
            {
                $project: {
                    distance: 1,
                    name: 1
                }
            }
        ])
        distances.forEach(el => el.distance = Number(el.distance.toFixed(2)));


        res.status(200).json({
            status: 'success',
            nbOfResults: distances.length,
            data: {distances}
        })

    } catch(err) {
        if(err.statusCode === 400)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }   
}



// aggregate used when we have an advanced or complex data processing operations
const getStats = async (req, res, next) => {
    try{
        const stats = await Tour.aggregate([
            {
                $group : { // to do aggregate without grouping make the _id : null
                    _id: { $toUpper :'$difficulty'},
                    numTours: {$sum : 1},
                    nbOfRatings: {$sum : '$ratingsQuantity'},
                    avrRatings : {$avg : '$ratingsAverage'},
                    avgPrice: {$avg : '$price'},
                    minPrice: { $min : '$price'},
                    maxPrice: { $max : '$price'}
                }
            },
            {
                $sort : {avgPrice : 1} // 1 mean asc, -1 desc
            }
        ])
        stats.forEach(ele => {
            ele.avrRatings = Number( ele.avrRatings.toFixed(2));
            ele.avgPrice = Number(ele.avgPrice.toFixed(2));
        })
        res.status(200).json({
            status: 'success',
            stats
        })
    }catch (err) {
        next(new ErrorHandling(err.message, 400));
    }
}

// get the month that contain the highest number of tours in the passed year
const getBusiestMonth = async (req, res, next) => {
    try{
        const year = req.params.year;
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);


        const busiestMonth = await Tour.aggregate([
            // $unwind used to destruct and array and create an object for each element in this array
            // for example : {name: youssef, skills : [HTML, CSS, JS]}
            // result : {name: youssef, skills : HTML}, {name: youssef, skills : CSS}, {name: youssef, skills : JS}
            { $unwind: '$startDates' }, 
            {
                $match: {
                    $and: [
                        { startDates: { $gte: startDate } },
                        { startDates: { $lt: endDate } }
                    ]
                }
            },
            {
                $group: {
                    _id : { $month : '$startDates'},
                    count : {$sum : 1},
                    tours : {$push : '$name'} // push used to create an array
                }
            },
            // { $addFields: {month : '$_id'} }
            { $sort : {count : -1} }, // desc
            { $limit : 1 } // display the first result (don't forget after sorting in descending order)
        ])

        res.status(200).json({
            status : 'success',
            data: {busiestMonth}
        })
    } catch(err){
        next(new ErrorHandling(err.message, 400));
    }
}

const addGuid = async (req, res, next) => {
    try {
        if (!req.body.tourId)   throw new ErrorHandling('you must pass a tour id', 400);

        const tour = await Tour.findByIdAndUpdate(req.body.tourId,
                    { $push: { guides: req.user.id } },
                    { new: true, runValidators: true })

        if (!tour)    throw new ErrorHandling('tour not found', 404);

        res.status(200).json({
            status: 'success',
            data : {tour}
        })

    } catch (err) {
        if (err.message === 'tour not found' || err.message === 'you must pass a tour id') {
            return next(err);
        }

        return next(new ErrorHandling(err.message, 400));
    }
}



module.exports = {
    getTour,
    getTours,
    createTour,
    updateTour,
    deleteTour,
    getStats,
    getBusiestMonth,
    getTourReviews,
    tourWithinRadius,
    calcDistances,
    getTourBySlug,
    addGuid
}