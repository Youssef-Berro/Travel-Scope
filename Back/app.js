const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const limiter = require('./utils/functions');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouters = require('./Routing/ToursRouters');
const userRouters = require('./Routing/UserRouters');
const reviewRouters = require('./Routing/ReviewRouters');
const {ErrorHandling, errorHandlingMiddleware} = require('./Controllers/errorHandling');
const app = express();

// Choosing between SQL and NoSQL :
//  1.Data Structure and Schema:
//    - SQL: Best for structured data with a well-defined schema. SQL databases use tables with
//           predefined columns and data types.
//    - NoSQL: Suitable for semi-structured or unstructured data where the schema can evolve(updated) over time.
//           NoSQL databases allow for more flexible data models.

// 2. Scalability:
//    - SQL: Traditionally, SQL databases are vertically scalable (scale-up) by increasing
//          the CPU, RAM, or storage on a single server. Some modern SQL databases support
//          horizontal scalability but might be more complex to set up.
//    - NoSQL: Designed for horizontal scalability (scale-out).
//          NoSQL databases are often easier to scale across multiple servers or nodes.

// 3. Complex Queries:
//    - SQL: Well-suited for complex queries and joins across multiple tables.
//          SQL databases provide powerful query languages like SQL.
//    - NoSQL: Better for simple queries and aggregations. NoSQL databases
//          might not support complex joins and transactions as effectively.

// 4. Use Case:
//    - SQL: Often chosen for applications like financial systems, traditional e-commerce,
//          and applications with complex relationships between data entities.
//    - NoSQL: Suitable for content management systems, real-time analytics,
//          IoT applications, social media platforms, and situations where rapid development and scalability are priorities.



// ======================================================= Global Middlewares ==========================================================

// set security HTTP headers (to understand more helmet libarary go to => https://github.com/helmetjs/helmet)
app.use(helmet());

// multy cors access
app.use(cors());

// limit request for one single IP (execute for all routes start with /api)
app.use('/api', limiter);

// body parser (reading data from body to req.body), {limit : '10kb'} means parsing data limit is 10kb
app.use(express.json({limit : '10kb'}));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against html malicious data (xss)
app.use(xss())

// prevent parameter pollution
app.use(hpp({whitelist : [
    'duration',
    'maxGroupSize',
    'difficulty',
    'ratingsAverage',
    'ratingsQuantity',
    'price'
]}))

// access to static files
app.use(express.static(`${__dirname}/../../Front/img`));


app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/reviews', reviewRouters);
// app.use(middlewares.checkDeletedUsers);


// uncatched url's
app.all('*', (req, res, next) => {
    next(new ErrorHandling(`can't find ${req.originalUrl} in our server!`, 404))
})


app.use(errorHandlingMiddleware);




// when the callback function in middlewares containt 4 arguments, Express automaticaly will know it's an error handeling
// middleware, and when we need to call this middleware in any other middleware use next() with one argument, also
// when the next() function called with one argument, Express automaticaly will know that the passed argument is an error
// and when a error handeling middleware is called, all the middlewares in the middlewares stack will be stoped and 
// directly the error handeling middleware will execute
// also when an error happen in a middleware directly the errorHandling middle will bel called
module.exports = app;