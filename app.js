// express object
var express = require('express');
var app = express();

// body parser to get content from req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
// views engine
app.set('view engine','ejs');
app.set('views','./views');

// css folder setup
app.use(express.static(__dirname + '/public'));
// console.log(__dirname + '/public');

// seeds file
var seedDB = require('./seeds');
// seedDB();
// using the database with mongoose ODM
var mongoose = require('mongoose');
mongoose.connect('mongodb://leinerf:March201997@ds161584.mlab.com:61584/yelpcamp',{useMongoClient:true});
mongoose.Promise = global.Promise;
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user')

// flash messages
var flash = require('connect-flash');
app.use(flash());

// require authentication
var passport = require('passport');
var localStrategy = require('passport-local');

app.use(require('express-session')({
    secret: 'Once again Rusty wins cutest dog!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    // res.locals is whatever is in our templates
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success')
    next();
})

// overide library
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

// routes
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');



app.use('/',indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);



// Campground.create({
//         name: 'Salmon Creek', 
//         image:'http://www.photosforclass.com/download/7626464792',
//         description: 'The salmons in the creek were beautiful, they were also tasty and juicy'
    
//     }, function(err,campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log('NEWLY CREATED CAMPGROUND');
//             console.log(campground);
//         }
//     });

// Campground.create({
//     name: 'Granted Hill',
//     image: 'http://www.photosforclass.com/download/5641024448',
//     description: 'This is a huge granite hill, no bathrooms. No water. Beautiful granite hill'
// }, function(err,campground){
//     if(err){
//         console.log(err);
//     } else {
//         console.log('NEWLY CREATED CAMP')
//     }
// });

// sudo database
var campgrounds = [
            {name: 'Salmon Creek', image:'http://www.photosforclass.com/download/7626464792'},
            {name: 'Granted Hill', image:'http://www.photosforclass.com/download/5641024448'},
            {name: 'Mountain Goat\'s Rest', image:'http://www.photosforclass.com/download/4812576807'},
            {name: 'Salmon Creek', image:'http://www.photosforclass.com/download/7626464792'},
            {name: 'Granted Hill', image:'http://www.photosforclass.com/download/5641024448'},
            {name: 'Mountain Goat\'s Rest', image:'http://www.photosforclass.com/download/4812576807'},
            {name: 'Salmon Creek', image:'http://www.photosforclass.com/download/7626464792'},
            {name: 'Granted Hill', image:'http://www.photosforclass.com/download/5641024448'},
            {name: 'Mountain Goat\'s Rest', image:'http://www.photosforclass.com/download/4812576807'}
        ];


// listening on server
var port = process.env.PORT || 3000;
var ip = process.env.IP || null
app.listen(port,ip,function(){
    console.log('server')
})

