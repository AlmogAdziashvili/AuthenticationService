const Strategy = require('passport-google-oauth20');
const User = require('../models/user');

module.exports = (passport) => passport.use(
  new Strategy(
    {
      callbackURL: '/users/google/redirect',
      clientID:
        '119869408866-4ub3a2n96sthv20ivp1atcit1ps4p4t1.apps.googleusercontent.com',
      clientSecret: 'P6d9NHWql1LF6JljwoXAkAJn',
    },
    (accessToken, refreshToken, profile, done) => {
      const {
        email, givenName, familyName, picture,
      } = profile._json;
      User.findOne({ email }).then((user) => {
        if (user) {
          if (!user.picture) {
            const updatedUserObj = user;
            updatedUserObj.picture = picture;
            return updatedUserObj
              .save()
              .then((updatedUser) => done(null, updatedUser));
          }
          return done(null, user);
        }
        const newUserObj = new User({
          email,
          first_name: givenName,
          last_name: familyName,
          picture,
        });
        return newUserObj.save().then((newUser) => done(null, newUser));
      });
    },
  ),
);
