const Strategy = require('passport-google-oauth20');
const User = require('../models/user');
const { clientID, clientSecret } = require('../.config').googleCredentials;

module.exports = (passport) => passport.use(
  new Strategy(
    {
      clientID,
      clientSecret,
      callbackURL: '/api/google/redirect',
    }, (accessToken, refreshToken, profile, done) => {
      const {
        email, given_name, family_name,
      } = profile._json;
      return User.findOrCreate({
        where: { email },
        defaults: { firstName: given_name, lastName: family_name, googleAccount: true },
      }).then(
        ([user]) => done(null, user),
      ).catch(
        (err) => done(err),
      );
    },
  ),
);
