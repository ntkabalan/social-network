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

module.exports = router;