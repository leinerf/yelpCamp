var express = require('express');
var router = express.Router({mergeParams: true});
// uses parent req.params.id 
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// ============================
// Comments Routes
// ============================

// get request
// comments new 
router.get('/new',middleware.isLoggedIn ,function(req,res){
    // find campground through id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new',{campground:campground});
        }
    });
});

// post request
router.post('/',middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                    req.flash('error', "Something went wrong")
                } else {
                    //add username and id to comment
                    comment.author.id = req.user.id
                    comment.author.username = req.user.username
                    comment.save()
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added comment');
                    res.redirect('/campgrounds/' + campground.id);
                }
            });
        }
    });
});
// comments edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership,function(req, res){
    console.log(req.params.comment_id)
    Comment.findById(req.params.comment_id, function(err, foundComment){
        console.log(foundComment)
        if(err){
            res.redirect('back');
        } else {
           res.render('comments/edit',{campground_id: req.params.id, comment: foundComment});
        }
    });
});

// comment update
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// Comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect('back');
       } else {
           req.flash('success','Comment Deleted');
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
});


module.exports = router;