const express = require('express');

const { ensureAuthenticated } = require('../helpers/auth');

const User = require('../models/User');
const Tweet = require('../models/Tweet');

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {

    Tweet.find({
        $or: [
            { user: { $in: req.user.following } },
            { retweeted: { $elemMatch: { $in: req.user.following } } },
            { user: req.user.id }
        ]
    })
    .populate('user')
    .sort({ datePosted: 'desc' })
    .then(tweets => {
        res.render('index', {
            tweets: tweets
        });
    })
    .catch(error => {
        console.log(error);
    });
});

module.exports = router;