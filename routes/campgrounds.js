var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware') //index.js is what is used by default
// INDEX - show all campgrounds
router.get('/',function(req,res){
    // login will put in the user content passport create user data
    console.log(req.user)
    // Get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index',
            {
                campgrounds:allCampgrounds,
                
            });
        }
    });
    // res.render('campgrounds',{campgrounds: campgrounds});
});
// NEW - show the form to create new campground
router.get('/new',middleware.isLoggedIn, function(req,res){
    res.render('campgrounds/new');
});
// after all campgrounds/whatever route
router.get('/:id',function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
        if(err || !foundCampground){
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        } else {
            console.log(foundCampground,'content in show');
            res.render('campgrounds/show',{campground:foundCampground})
        }
    });
    
});

// post routes
// Create - add campground to database
router.post('/', middleware.isLoggedIn,function(req,res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    var newCampground = {name: name, image:image,description:desc, author:author};
    console.log(req.user);
    // campgrounds.push(newCampground)
    
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
            
        } else {
            console.log(newlyCreated)
            res.redirect('/campgrounds');
        }
    });
    // default get request
});

//Edit Campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership,function(req,res){
    // is user logged in
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});



// put request update
router.put('/:id',middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    } )
    // redirect somewhere( show name)
});

// Destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds');
        }
    })
})

module.exports = router;