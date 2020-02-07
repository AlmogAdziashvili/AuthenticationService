const { Strategy } = require('passport-jwt');
const User = require('../models/user');
const { secret } = require('../.config').jwtCredentials;
const { promiseHandler } = require('./utils');

// Extractor Function for 'jwt' cookie
const cookieExtractor = (req) => (req && req.cookies ? req.cookies.jwt : null);

module.exports = (passport) => passport.use(
  new Strategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secret,
  }, (jwt_payload, done) => promiseHandler(
    User.findByPk(jwt_payload.id),
    (user) => done(null, user),
    (err) => done(err),
  )),
);
