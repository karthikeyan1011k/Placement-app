const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        // find the user and establish the identity
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    console.log("Invalid UserName or Password");
                    return done(null, false);
                }
                // match the Password
                if (user.password != password) {
                    console.log("Invalid UserName or Password");
                    return done(null, false);
                }
                return done(null, user);
            })
            .catch(err => {
                console.log("error in finding the user", err);
                return done(err);
            });
    })
);

//serialize the user to keep user id in session cookie
passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

//deserialize the user using id stored in cookies
passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            console.log('Error in finding user while deserializing: ', err);
            return done(err);
        });
});

//check for authentication
passport.checkAuthentication = function (req, res, next) {
    //if logged in then pass to next()
    if (req.isAuthenticated()) {
        return next();
    }
    //else redirect back
    return res.redirect(back);
};

//set authentication
passport.setAuthenticatedUser = function (req, res, next) {
    //if user logged in then store in locals
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;
