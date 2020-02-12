const { Router } = require('express');
const passport = require('passport');
const { sign } = require('jsonwebtoken');
const { secret } = require('../.config').jwtCredentials;
const { onlyGuests, statusCodes } = require('../handlers/utils');

const router = Router();

router.get(
  '/',
  onlyGuests('/api/current'),
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);

router.get('/redirect',
  passport.authenticate('google', { session: false }),
  (req, res) => res.status(statusCodes.OK).cookie('jwt', sign({ id: req.user.id }, secret, { expiresIn: '12h' }), { maxAge: 43200000 }).redirect('/api/user/current'));

module.exports = router;
