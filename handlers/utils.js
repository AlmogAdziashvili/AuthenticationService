const { Document } = require('problem-json');
const passport = require('passport');

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

// Handle Promises by getting onFulfillment and onRejection functions
utils.promiseHandler = (
  promise,
  onFulfillment,
  onRejection,
) => promise
  .then(onFulfillment, onRejection)
  .catch(onRejection);

// RFC 7807 Error Object Constructor
utils.generateError = (req, res, code, detail) => res.status(code).json(new Document({
  type: req.path,
  title: getKeyByValue(utils.statusCodes, code),
  detail,
}));

// Middleware - attach user to req object or send an error to the client
utils.jwtAutenticator = () => (req, res, next) => passport.authenticate('jwt', { session: false },
  (err, user) => {
    if (err) return utils.generateError(req, res, utils.statusCodes.internalServerError, 'Could not serialize user');
    req.user = user;
    return next();
  })(req, res, next);

// Redirect the user to a selected path only if the user is currently logged
utils.redirectUserIfLoggedIn = (path) => (req, res, next) => (
  req.user ? res.redirect(path) : next()
);

// Redirect the user to a selected path only if the user is not currently logged
utils.redirectGuest = (path) => (req, res, next) => (
  req.user ? next() : res.redirect(path)
);

module.exports = utils;
