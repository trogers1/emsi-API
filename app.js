
//import knex and connect it to our sqlite database
//first, import the knex configuration json
const knexConfig = require("./knexConfig.json");
//then import and configure knex with the json above
const knex = require("knex")(knexConfig);

//import express, which helps us handle our requests.
const express = require("express");
//this constant simply executes express like a function giving us a lot of utility methods
const app = express();
//this is importing morgan, which automatically logs requests for our api
//morgan is more "middle-ware" which will catch the requests, log it, then call 'next' and let the request continue to our scripts.
const morgan = require("morgan");

//this allows us to support url-encoded bodies and json data if, for example, sent with a  POST request
const bodyParser = require("body-parser");

//app.use sets up a "middle-ware", that requires the request to go through app.use and into whatever we pass it to. In this case, we use morgan to log our requests.
//we use app.use on morgan first, so that it is activated before we handle the requests.
app.use(morgan("dev"));//this is the format for logging requests
//now we allow body parser to check out the incoming request and parse urlencoded data...
app.use(bodyParser.urlencoded({ extended: false })); //set to true if we want to be able to parse rich data as well.
//and json data.
app.use(bodyParser.json());

//we must forward requests made to these urls to the correct files:
const cityRoutes = require("./routes/city.js");
const rankRoutes = require("./routes/rank.js");

//In this case, app.use will catch the request (req), the response (res) and anything next (next)
//here we are adding a header to our response (res)
app.use((req, res, next) => { //here, we are correcting for CORS (Cross-Origin Resource Sharing) errors by sending headers that allow sharing between servers
    res.header("Access-Control-Allow-Origin", "*"); //this sends a response header, allowing anyone from any domain to use our api. We could change "*" to whatever url we want to restrict use to that domain, such as only allowing our web app to use this api.
    res.header(
        "Access-Control-Allow-Headers",//defines which kinds of headers we accept
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"//these headers can be appended to incoming requests.
    );
    if (req.method === "OPTIONS") {//browser always sends "OPTIONS" request first when sending a "POST" or "PUT" request to see if the action is allowed.
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");//these are the allowed methods.
        return res.status(200).json({});//we return because this is the entire response we want to give to an "OPTIONS" request.
    }
    next();
});

// Routes which should handle requests
app.use("/city", cityRoutes);//any requests with /city in url will be forwarded to api/routes/city.js
app.use("/rank", rankRoutes);//same for the rank requests


//now, if neither of the above routes are used, then we can throw an error
//this will handle every request that reaches this line (which is every request that wasn't caught above by /city and /rank)
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);//this forwards the error rather than the request
});

//this catches the error created above OR an error thrown by a botched database operation, which will bypass the above error.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({//any time we use .json, it automatically creates a basic header for us.
        error: {
            message: error.message
        }
    });
});

// app.listen(3000);
//this exports all our work to app.
module.exports = app;

console.log("Submit GET or POST to http://localhost:3000/data");