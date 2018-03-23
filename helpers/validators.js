const User = require('../models/User');

module.exports = {
    emailIsAvailable: (value) => {
        return new Promise((resolve, reject) => {
            User.findOne({ email: value }).then(user => {
                if (user) reject();
                else {
                    resolve();
                }
            });
        })
    },
    handleIsAvailable: (value) => {
        return new Promise((resolve, reject) => {
            User.findOne({ handle: value }).then(user => {
                if (user) reject();
                else {
                    resolve();
                }
            });
        })
    }
}