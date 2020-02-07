const Strategy = require('passport-google-oauth20');
const User = require('../models/user');
const { clientID, clientSecret } = require('../.config').googleCredentials;
const { promiseHandler } = require('./utils');
const logger = require('./logger');

module.exports = (passport) => passport.use(
  new Strategy({
    clientID,
    clientSecret,
    callbackURL: '/api/google/redirect',
  }, (accessToken, refreshToken, profile, done) => {
    // if logged in successfully with google - find or create a new user and authenticate
    const {
      email, given_name, family_name,
    } = profile._json;
    return promiseHandler(
      User.findOrCreate({
        where: { email },
        defaults: { firstName: given_name, lastName: family_name, googleAccount: true },
      }),
      ([user]) => {
        logger.info(`user: ${user.id} logged in successfully using google`);
        return done(null, user);
      },
      (err) => done(err),
    );
  }),
);
