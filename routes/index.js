var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// get routes
// index route
router.get('/',function(req,res){
    res.render('landing');
});

// ===================
// Auth Routes
// ===================
router.get('/register', function(req,res){
    res.render('register');
});

// handle sign up logic
router.post('/register', function(req, res){
    req.body.username = req.body.username.trim();
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error',err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

//  show login form 
router.get('/login', function(req,res){
    res.render('login');
});

router.post('/login', passport.authenticate('local', 
    {
        //middelware will call authenticate method
        successRedirect:'/campgrounds', 
        failureRedirect:'/login'
    }) ,function(req, res){
});

// logout route
router.get('/logout', function(req, res){
    req.flash('success','logged you out!');
    req.logout();
    res.redirect('/campgrounds');
});



module.exports = router