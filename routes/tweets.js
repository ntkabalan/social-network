const express = require('express');
const passport = require('passport');

const User = require('../models/User');
const Tweet = require('../models/Tweet');

const { ensureAuthenticated } = require('../helpers/auth');

const router = express.Router();

// POST requests

router.post('/tweet', ensureAuthenticated, (req, res) => {
    req.check('text').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.send('Handle blank tweet');
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

router.put('/:id', ensureAuthenticated, (req, res) => {
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

module.exports = router;