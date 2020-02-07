const express = require('express');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const {
  statusCodes, redirectUserIfLoggedIn, generateError, promiseHandler,
} = require('../handlers/utils');
const { indexPage } = require('../.config').webServerUrls;
const User = require('../models/user');
const logger = require('../handlers/logger');
const { secret } = require('../.config').jwtCredentials;

const router = express.Router();

// Send the user currently logged in
router.get('/current', (req, res) => res.status(statusCodes.OK).json(req.user));

// User registeration
router.post('/user',
  redirectUserIfLoggedIn(indexPage),
  (req, res) => {
    const {
      email,
      first_name,
      last_name,
      password,
    } = req.body;
    if (
      !email
      || !first_name
      || !last_name
      || !password
    ) return generateError(req, res, statusCodes.badRequest, 'missing credentials');
    if (
      password.length < 8
      || !first_name.match(/^[A-Za-z]+$/)
      || !last_name.match(/^[A-Za-z]+$/)
      || !email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ) return generateError(req, res, statusCodes.badRequest, 'unvalid credentials');
    return promiseHandler(
      User.findOne({ where: { email } }),
      (user) => {
        if (user) return generateError(req, res, statusCodes.badRequest, 'user exists');
        return bcrypt.genSalt(10, (err, salt) => {
          if (err) return generateError(req, res, statusCodes.internalServerError, err);
          return bcrypt.hash(password, salt, (hashErr, hash) => {
            if (hashErr) return generateError(req, res, statusCodes.internalServerError, hashErr);
            return promiseHandler(
              User.create({
                email, firstName: first_name, lastName: last_name, password: hash,
              }),
              () => {
                logger.info(`new user registered, email: ${email}`);
                return res.sendStatus(statusCodes.created);
              },
              () => generateError(req, res, statusCodes.internalServerError, 'server error'),
            );
          });
        });
      },
      () => generateError(req, res, statusCodes.internalServerError, 'server error'),
    );
  });

// User log in
router.post('/auth',
  redirectUserIfLoggedIn(indexPage),
  (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return generateError(req, res, statusCodes.badRequest, 'missing credentials');
    return promiseHandler(
      User.findOne({ where: { email } }),
      (user) => {
        if (!user || !user.password) return generateError(req, res, statusCodes.unauthorized, 'bad credentials');
        return bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return generateError(req, res, statusCodes.internalServerError, 'server error');
          if (!isMatch) return generateError(req, res, statusCodes.unauthorized, 'bad credentials');
          logger.info(`user: ${user.id} logged in successfully using google`);
          return res.status(statusCodes.OK).cookie('jwt', sign({ id: req.user.id }, secret, { expiresIn: '12h' }), { maxAge: 43200000 }).redirect('/api/current');
        });
      },
      () => generateError(req, res, statusCodes.internalServerError, 'server error'),
    );
  });

module.exports = router;
