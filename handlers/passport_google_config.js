const Strategy = require('passport-google-oauth20');
const User = require('../models/user');
const { clientID, clientSecret } = require('../.config').googleCredentials;
const logger = require('./logger');

module.exports = (passport) => passport.use(
  new Strategy({
    clientID,
    clientSecret,
    callbackURL: '/api/google/redirect',
  }, async (accessToken, refreshToken, profile, done) => {
    // if logged in successfully with google - find or create a new user and authenticate
    try {
      const {
        email, given_name, family_name,
      } = profile._json;
      const [user] = await User.findOrCreate({
        where: { email },
        defaults: { firstName: given_name, lastName: family_name, googleAccount: true },
      });
      logger.info(`user: ${user.id} logged in successfully using google`);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);
