const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/current', (req, res, next) => passport.authenticate(
  'jwt',
  { session: false },
  (err, user) => res.send(user),
)(req, res, next));

module.exports = router;
