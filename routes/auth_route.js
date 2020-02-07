const express = require('express');
const { statusCodes } = require('../handlers/utils');

const router = express.Router();

// Send the user currently logged in
router.get('/current', (req, res) => res.status(statusCodes.OK).json(req.user));

module.exports = router;
