const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    favorited: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    retweeted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    reply: {
        type: Boolean,
        default: false
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tweets'
        }
    ],
    datePosted: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('tweets', TweetSchema);