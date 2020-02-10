const express = require('express');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const {
  statusCodes, redirectUserIfLoggedIn, generateError, redirectGuest,
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
  async (req, res) => {
    try {
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
      const user = await User.findOne({ where: { email } });
      if (user) return generateError(req, res, statusCodes.badRequest, 'user exists');
      const hash = await bcrypt.hash(password, 10);
      await User.create({
        email,
        firstName: first_name,
        lastName: last_name,
        password: hash,
      });
      logger.info(`new user registered, email: ${email}`);
      return res.sendStatus(statusCodes.created);
    } catch (err) {
      return generateError(req, res, statusCodes.internalServerError, 'server error');
    }
  });

// User log in
router.post('/auth',
  redirectUserIfLoggedIn(indexPage),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return generateError(req, res, statusCodes.badRequest, 'missing credentials');
      const user = await User.findOne({ where: { email } });
      if (!user) return generateError(req, res, statusCodes.unauthorized, 'bad credentials');
      if (!user.password) return generateError(req, res, statusCodes.unauthorized, 'google account');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return generateError(req, res, statusCodes.unauthorized, 'bad credentials');
      logger.info(`user: ${user.id} logged in successfully`);
      return res.status(statusCodes.OK).cookie('jwt', sign({ id: req.user.id }, secret, { expiresIn: '12h' }), { maxAge: 43200000 }).redirect('/api/current');
    } catch (err) {
      return generateError(req, res, statusCodes.internalServerError, 'server error');
    }
  });

// User info update
router.put('/user',
  redirectGuest('/'),
  async (req, res) => {
    try {
      const { first_name, last_name } = req.body;
      if (!first_name && !last_name) return generateError(req, res, statusCodes.badRequest, 'missing credentials');
      if (last_name) {
        if (!last_name.match(/^[A-Za-z]+$/)) return generateError(req, res, statusCodes.badRequest, 'unvalid credentials');
        req.user.lastName = last_name;
      }
      if (first_name) {
        if (!first_name.match(/^[A-Za-z]+$/)) return generateError(req, res, statusCodes.badRequest, 'unvalid credentials');
        req.user.firstName = first_name;
      }
      await req.user.save();
      logger.info(`user updated info, email: ${req.user.email}`);
      return res.sendStatus(statusCodes.OK);
    } catch (err) {
      return generateError(req, res, statusCodes.internalServerError, 'server error');
    }
  });

// User account delete
router.delete('/user/:ID',
  // TODO: Authorization check
  async (req, res) => {
    try {
      const { ID } = req.params;
      if (Number.isNaN(parseInt(ID))) return generateError(req, res, statusCodes.badRequest, 'unvalid credentials');
      await User.destroy({ where: { id: ID } });
      logger.info(`user deleted, id: ${ID}`);
      return res.sendStatus(statusCodes.OK);
    } catch (err) {
      return generateError(req, res, statusCodes.internalServerError, 'server error');
    }
  });

module.exports = router;
