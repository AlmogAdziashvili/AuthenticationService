const { Strategy } = require('passport-jwt');
const User = require('../models/user');
const { secret } = require('../.config').jwtCredentials;

const cookieExtractor = (req) => (req && req.cookies ? req.cookies.jwt : null);

module.exports = (passport) => passport.use(
  new Strategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secret,
  }, (jwt_payload, done) => {
    User.findByPk(jwt_payload.id).then(
      (user) => done(null, user),
    ).catch(
      (err) => done(err),
    );
  }),
);
