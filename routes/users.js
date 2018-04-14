const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Tweet = require('../models/Tweet');

const { ensureGuest } = require('../helpers/auth');

const router = express.Router();

// GET requests

router.get('/login', ensureGuest, (req, res) => {
    res.render('users/login');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/register', ensureGuest, (req, res) => {
    res.render('users/register');
});

router.get('/profile/:handle', (req, res) => {
    if (req.user) {
        if (req.params.handle === req.user.handle) {
            res.redirect('/');
            return;
        }
    }
    User.findOne({ handle: req.params.handle }).then(user => {
        if (user) {
            Tweet.find({ user: user.id })
            .populate('user')
            .populate('retweeted')
            .populate('replies')
            .then(tweets => {
                res.render('users/profile', {
                    profileOwner: user,
                    tweets: tweets
                });
            })
        }
    });
});

// POST requests

router.post('/register', (req, res) => {
    req.check('firstName', 'First name field is required').notEmpty();
    req.check('lastName', 'Last name field is required').notEmpty();
    req.check('email', 'Please provide a valid email address').isEmail();
    req.check('email', 'Email already in use').emailIsAvailable();
    req.check('handle', 'Handle field is required').notEmpty();
    req.check('handle', 'Handle already in use').handleIsAvailable();
    req.check('password', 'Password must be at least 4 characters long').isLength({ min: 4 });
    req.check('password', 'Password confirmation does not match').equals(req.body.confirmPassword);

    req.asyncValidationErrors()
    .then(() => {
        bcrypt.hash(req.body.password, 10).then(hash => {
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                handle: req.body.handle,
                password: hash
            }
            new User(newUser).save();
            req.flash('success_msg', 'Congrats! You are registered and can now log in.');
            res.redirect('/users/login');
        })
        .catch(error => {
            throw error
        });
    })
    .catch(errors => {
        res.render('users/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            handle: req.body.handle,
        });
    })
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.post('/follow/:id', (req, res) => {
    User.findById(req.user.id).then(loggedInUser => {
        User.findById(req.params.id).then(userToFollow => {
            loggedInUser.following.push(userToFollow.id);
            userToFollow.followers.push(loggedInUser.id);
            loggedInUser.save();
            userToFollow.save();
            res.redirect('back');
        });
    });
});

router.post('/unfollow/:id', (req, res) => {
    User.findById(req.user.id).then(loggedInUser => {
        User.findById(req.params.id).then(userToUnfollow => {
            // Remove the unfollwed user from the logged in user's following list
            loggedInUser.following.forEach((user, i) => {
                if (user == req.params.id) {
                    loggedInUser.following.splice(i, 1);
                    loggedInUser.save();
                }
            });

            // Remove the logged in user from the unfollwed user's followers list
            userToUnfollow.followers.forEach((user, i) => {
                if (user == req.user.id) {
                    userToUnfollow.followers.splice(i, 1);
                    userToUnfollow.save();
                    res.redirect('back');
                }
            });
        });
    });
});

module.exports = router;