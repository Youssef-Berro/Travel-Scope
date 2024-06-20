const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});


// always this listenner at the top
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
})


const app = require('./app');
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
// const DB = process.env.DATABASE_LOCAL; // in case of using local server for db


// mongoose.connect return a promise
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => {
    console.log("connection succesfull✅")
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("listening...");
})

process.on('unhandledRejection' , err => {
    console.log(err.name, err.message);
    process.exit(1) // passing 1 => error, 0 => no error
})




// we use the following event in case of making the app.listen outside the then function
// and in this case we should close the server before exiting
// // server = app.listen(...)
// process.on('unhandledRejection', err => {
//     console.log(err.name, err.message);
//     server.close(() => {
//         process.exit(1);
//     })
// })



// mongodb+srv://youssef:<password>@cluster0.cpw7trp.mongodb.net/?retryWrites=true&w=majority
// <password> will be your database password
// cluster0.cpw7trp.mongodb.net will be our host
// between / and ? make your database name
// for example DATABASE=mongodb+srv://youssef:jsdijsids@127.0.0.1:27017/natours?retryWrites=true&w=majority
// in case of local db => DATABASE_LOCAL=mongodb://localhost:port/dbName
// in case of using local db don't close the server terminal
// npm i mongodb to install mongodb
// npm i mongoose@5 to install mongoose
// as summary for MongoDB, always use mongoose to install it : npm i mongoose
// then if we need to create a local database, start the server from the
// terminal and leave in on in code do : mongodb://localhost:port/dbName
// and if we need to connect to a host one, use atlas by getting a string from application connection
// also we connect our host server(from atlas) to compass by using compass connection