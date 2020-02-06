const { Document } = require('problem-json');

const utils = {};

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

module.exports = utils;
