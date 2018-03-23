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
    }
}