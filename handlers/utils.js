const { Document } = require('problem-json');
const passport = require('passport');
const logger = require('./logger');

const utils = {};

// Find a key of a specific value in an object
const getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value);

// HTTP status codes
utils.statusCodes = {
  OK: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  internalServerError: 500,
};

// RFC 7807 Error Object Constructor
utils.generateError = (req, res, code, detail) => {
  logger.warn(`Error at ${req.path} - error code: ${code} - error message: ${detail}`);
  return res.status(code).json(new Document({
    type: req.path,
    title: getKeyByValue(utils.statusCodes, code),
    detail,
  }));
};

// Middleware - attach user to req object or send an error to the client
utils.jwtAutenticator = () => (req, res, next) => passport.authenticate('jwt', { session: false },
  (err, user) => {
    if (err) return utils.generateError(req, res, utils.statusCodes.internalServerError, 'Could not serialize user');
    req.user = user;
    return next();
  })(req, res, next);

// Redirect the user to a selected path only if the user is currently logged
utils.onlyGuests = () => (req, res, next) => (
  req.user ? utils.generateError(req, res, utils.statusCodes.unauthorized, 'not authorized') : next()
);

// Redirect the user to a selected path only if the user is not currently logged
utils.onlyUsers = () => (req, res, next) => (
  req.user ? next() : utils.generateError(req, res, utils.statusCodes.unauthorized, 'not authorized')
);

module.exports = utils;
