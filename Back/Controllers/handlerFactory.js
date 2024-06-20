const APIFeatures = require('./apiFeatures');
const {ErrorHandling, handleCastErrorDB, handleDuplicateFieldsDB } = require('./errorHandling');


const getOne = (Model, populateOptions) => async (req, res, next) => {
    try{
        let query = Model.findById(req.params.id).select('-__v');
        if(populateOptions)    query = query.populate(populateOptions); // for tour reviews

        const doc = await query;

        if(!doc) throw new ErrorHandling(`there is no document with ID: ${req.params.id}`, 404);

        res.status(200).json({
            status: 'success',
            data: {doc}
        })
    } catch(err) {
        if(err.name === 'CastError')    return next(new handleCastErrorDB(400, err.path, err.value));

        next(new ErrorHandling(err.msg, 400));
    }
}


const deleteOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if(!doc)   throw new ErrorHandling(`no document found with ID: ${req.params.id}`, 404);

        res.status(204).json({
            status : 'success',
            data: null
        })
    } catch (err) {
        if(err.code === 404)    return next(err);
        next(new ErrorHandling(err.message, 400));
    }
}


const updateOne = Model => async (req, res, next) => {
    try{
        // req.user.id is valid when the request pass to checkTokenValidity middleware
        const id = req.user.id || req.params.id;
        let doc;

        // when the request contain file mean update for user photo
        if(req.file) {
            const photo = req.file.filename;
            doc = await Model.findByIdAndUpdate(id, {photo}, {
                new: true, 
                runValidators: true 
            })
        }
        else {
            // we use findByIdAndUpdate to avoid pre save middlewares because they check if 
            // confirm password == password which always display error in this case
            // because there is no password operations here (this comment for userUpdate)
            doc = await Model.findByIdAndUpdate(id, req.body, {
                new: true, // means we need the updated document be returned (default value false)
                runValidators: true // its important to make this option to true, because when its false,
                // any patch method don't respect our schema validators
            }) 
        }

        if(!doc)   throw new ErrorHandling(`there is no document with id : ${id}`, 404);
        res.status(200).json({
            status: 'success',
            data: {doc}
        })
    } catch (err) {
        if(err.code === 404)    return next(err);
        next(new ErrorHandling(err.message, 400));
    }
}

const createOne = Model => async (req, res, next) => {
    try{
        const newDoc = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {newDoc}
        })

    }catch(err) {

        // this condition is important for tour model because there is some fields should be unique
        if(err.code == 11000){
            const key = `${Object.keys(err.keyValue)}`;
            return next(new handleDuplicateFieldsDB(400, key, err.keyValue[key]));
        }

        return next(new ErrorHandling(err.message, 400));
    }
}

const getAll = Model => async (req, res, next) => {
    try{
        const features = new APIFeatures(Model.find(), req.query)
                .filter()
                .sort()
                .fieldsLimiting()
                .pagination()

        const docs = await features.query;

        res.status(200).json({
            status : 'success',
            nbOfResults: docs.length,
            data: {docs}
        })
    }
    catch(err) {
        next(new ErrorHandling(err.message, 400));
    }
}




// "action failed due error" use this message in case of no detected error 
module.exports = {
    getOne,
    deleteOne,
    updateOne,
    createOne,
    getAll
}

