const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                return done(null, false, { message: 'Email not found' });
            }
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}