// Node Dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var logger = require('morgan'); // for debugging
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping


// Initialize Express for debugging & body parsing
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Serve Static Content
app.use(express.static("public"));

// Express-Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Database Configuration with Mongoose
// ---------------------------------------------------------------------------------------------------------------

// Connect to localhost if not a production environment
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapingmongoose";

// if(process.env.NODE_ENV == 'production'){
// mongoose.connect('MONGODB_URI: mongodb://heroku_m9bhzdg6:b50mg686apsl8lqhmkoaheh37u@ds123956.mlab.com:23956/heroku_m9bhzdg6');
// }
// else{
//   mongoose.connect('mongodb://localhost/scrapingmongoose');
//   // YOU CAN IGNORE THE CONNECTION URL BELOW (LINE 41) THAT WAS JUST FOR DELETING STUFF ON A RE-DEPLOYMENT
//   //mongoose.connect('mongodb://heroku_60zpcwg0:ubn0n27pi2856flqoedo9glvh8@ds119578.mlab.com:19578/heroku_60zpcwg0');
// }

var connectionString;
if (process.env.PORT) {
    connectionString = 'MONGODB_URI: mongodb://heroku_m9bhzdg6:b50mg686apsl8lqhmkoaheh37u@ds123956.mlab.com:23956/heroku_m9bhzdg6';
} else {
    connectionString = 'mongodb://localhost/scrapingmongoose';
}


var db = mongoose.connection(connectionString);

// Show any Mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Import the Comment and Article models
var Comment = require('./models/comment.js');
var Article = require('./models/article.js');
// ---------------------------------------------------------------------------------------------------------------

// DROP DATABASE (FOR MY PERSONAL REFERENCE ONLY - YOU CAN IGNORE)
// Article.remove({}, function(err) { 
//    console.log('collection removed') 
// });

// Import Routes/Controller
var router = require('./controllers/controller.js');
app.use('/', router);


// Launch App
var port = process.env.PORT || 7000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});