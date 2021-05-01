const passport = require('passport');
const local = require('./localStrategy');
const userService = require('../service/userService');

module.exports = () => {
    passport.serializeUser(async (userId, done) => {
        done(null, userId);
    });

    passport.deserializeUser(async (userId, done) => {
        try {
            const user = await userService.getUserInfoBy(userId);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    local();
};