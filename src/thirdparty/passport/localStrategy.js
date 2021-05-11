const passport = require('passport');
const LocalStrategy = require('passport-local');

const userService = require('../../service/userService');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
    }, async (id, password, done) => {
        try {
            const result = await userService.authenticate({id, password});
            if(result.isValid) {
                done(null, id, result);
            } else {
                done(null, false, result);
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    }));
}