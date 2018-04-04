const User = require('../models/User');

module.exports = {
    arrayItemCount: (arr) => {
        return arr.length
    },
    generateFollowButton: (loggedInUser, profileOwner) => {
        if (profileOwner.followers.indexOf(loggedInUser.id) !== -1) {
            return `
                <form class="mt-3" action="/users/unfollow/${profileOwner.id}" method="POST">
                    <input type="submit" value="Unfollow" class="btn btn-primary btn-block">
                </form>
            `
        } else {
            return `
                <form class="mt-3" action="/users/follow/${profileOwner.id}" method="POST">
                    <input type="submit" value="Follow" class="btn btn-primary btn-block">
                </form>
            `
        }
    },
    generateEditDeleteButtons: (loggedInUser, profileOwner, tweet) => {
        if (loggedInUser.id === profileOwner.id) {
            return `
                <div data-text="${tweet.text}" data-tweetid="${tweet.id}"></div>
                <div class="align-top">
                    <i class="fas fa-edit tweet-control align-top edit-tweet"></i>
                    <i class="fas fa-trash-alt tweet-control align-top delete-tweet"></i>
                </div>
            `
        } else {
            return ''
        }
    },
    generateFavoriteButton: (loggedInUser, tweet) => {
        if (tweet.favorited.indexOf(loggedInUser.id) !== -1) {
            return `
                <div class="favorite" data-tweet-id="${tweet.id}">
                    <small><i class="far fa-star text-primary"></i> <span>${tweet.favorited.length}</span></small>
                </div>
            `
        } else {
            return `
                <div class="favorite" data-tweet-id="${tweet.id}">
                    <small><i class="far fa-star"></i> <span>${tweet.favorited.length}</span></small>
                </div>
            `
        }
    },
    generateRetweetButton: (loggedInUser, tweet) => {
        if (tweet.retweeted.indexOf(loggedInUser.id) !== -1) {
            return `
                <div class="retweet" data-tweet-id="${tweet.id}">
                    <small><i class="fas fa-retweet text-primary"></i> <span>${tweet.retweeted.length}</span></small>
                </div>
            `
        } else {
            return `
                <div class="retweet" data-tweet-id="${tweet.id}">
                    <small><i class="fas fa-retweet"></i> <span>${tweet.retweeted.length}</span></small>
                </div>
            `
        }
    }
}