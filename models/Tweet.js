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
    datePosted: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('tweets', TweetSchema);