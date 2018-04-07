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

router.post('/reply', ensureAuthenticated, (req, res) => {
    const replyTweet = {
        user: req.user.id,
        text: req.body.replyText,
        reply: true
    }
    new Tweet(replyTweet).save().then(replyTweet => {
        Tweet.findById(req.body.tweetToReplyId).then((tweetToReply) => {
            tweetToReply.replies.push(replyTweet);
            tweetToReply.save();
        });
    });
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
        req.flash('error_msg', 'Failed to edit Tweet - please try again');
        res.sendStatus(500);
    })
});

router.put('/favorite', ensureAuthenticated, (req, res) => {
    Tweet.findById(req.body.tweetId)
    .then(tweet => {
        let index = tweet.favorited.indexOf(req.user.id);
        if (index === -1) {
            tweet.favorited.push(req.user.id);
        } else {
            tweet.favorited.splice(index, 1);
        }
        tweet.save()
        .then(() => {
            res.send(JSON.stringify({
                favorited: tweet.favorited.indexOf(req.user.id) !== -1,
                favoritedCount: tweet.favorited.length
            }));
        });
    });
});

router.put('/retweet', ensureAuthenticated, (req, res) => {
    Tweet.findById(req.body.tweetId)
    .then(tweet => {
        let index = tweet.retweeted.indexOf(req.user.id);
        if (index === -1) {
            tweet.retweeted.push(req.user.id);
        } else {
            tweet.retweeted.splice(index, 1);
        }
        tweet.save()
        .then(() => {
            res.send(JSON.stringify({
                retweeted: tweet.retweeted.indexOf(req.user.id) !== -1,
                retweetedCount: tweet.retweeted.length
            })); 
        });
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