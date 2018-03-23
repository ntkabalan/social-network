const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    handle: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }        
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }        
    ]
});

module.exports = mongoose.model('users', userSchema);