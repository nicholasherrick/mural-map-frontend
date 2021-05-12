const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/User');

// Extract JWT from request
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['access_token'];
    }
    return token;
};

// Verify JWT
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_SECRET_KEY
        },
        (payload, done) => {
            User.findById({ _id: payload.sub }, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                else return done(null, false);
            });
        }
    )
);

// Find the user in the database using the email/username and verify the password
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email }, (err, user) => {
            // Database error
            if (err) return done(err);
            // No user found
            if (!user) return done(null, false);
            //   Check if password is correct
            user.comparePassword(password, done);
        });
    })
);
