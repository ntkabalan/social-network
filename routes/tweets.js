const express = require('express');
const passport = require('passport');

const User = require('../models/User');
const Tweet = require('../models/Tweet');

const { ensureAuthenticated } = require('../helpers/auth');

const router = express.Router();

// POST requests

router.post('/tweet', ensureAuthenticated, (req, res) => {
    req.check('text', 'Tweet body empty').notEmpty();
    req.check('text', 'Tweets cannot be longer than 140 characters').isLength({ max: 140 });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error_msg', errors[0].msg);
        res.redirect('/');
    } else {
        const newTweet = {
            user: req.user.id,
            text: req.body.text
        }
        new Tweet(newTweet).save();
        res.redirect('/');
    }
});

// PUT requests

router.put('/', ensureAuthenticated, (req, res) => {
    const tweetID = req.body.tweetID;
    const newTweetText = req.body.text;

    Tweet.findById(tweetID)
    .then(tweet => {
        tweet.text = newTweetText;
        tweet.save();
        res.sendStatus(200);
    })
    .catch(error => {
        req.flash('error_msg', 'Failed to edit Tweet - please try again later');
        res.sendStatus(500);
    })
});

// DELETE

router.delete('/', ensureAuthenticated, (req, res) => {
    const tweetID = req.body.tweetID;

    Tweet.findByIdAndRemove(tweetID)
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        res.sendStatus(500);
    });
});

module.exports = router;