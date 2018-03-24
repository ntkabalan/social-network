const User = require('../models/User');

module.exports = {
    arrayItemCount: (arr) => {
        return arr.length
    },
    generateFollowButton: (loggedInUser, profileOwner) => {
        if (profileOwner.followers.indexOf(loggedInUser.id) != -1) {
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
                    <i class="fas fa-trash-alt tweet-control align-top  delete-tweet"></i>
                </div>
            `
        } else {
            return ''
        }
    }
}