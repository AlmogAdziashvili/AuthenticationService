const express = require('express');
const { statusCodes, generateError } = require('../handlers/utils');
const Premission = require('../models/premission');
const UserPremission = require('../models/user_premission');

const router = express.Router();

// Get all premissions objects
router.get('/',
  async (req, res) => {
    try {
      const premissions = await Premission.findAll();
      if (!premissions) return generateError(req, res, statusCodes.notFound, 'no premissions exist');
      return res.status(statusCodes.OK).json({ premissions });
    } catch (err) {
      return generateError(req, res, statusCodes.internalServerError, 'server error');
    }
  });

// Get all the premisions of one user
router.get('/:ID',
  async (req, res) => {
    try {
      const { ID } = req.params;
      if (!ID) return generateError(req, res, statusCodes.badRequest, 'missing credentials');
      const userPremissions = await UserPremission.findAll({ where: { user_id: ID } });
      if (!userPremissions) return generateError(req, res, statusCodes.notFound, 'no premissions exist');
      return res.status(statusCodes.OK).json({ userPremissions });
    } catch (err) {
      return generateError(req, res, statusCodes.internalServerError, 'server error');
    }
  });

module.exports = router;
