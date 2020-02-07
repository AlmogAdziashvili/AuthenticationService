const { Router } = require('express');
const passport = require('passport');
const { sign } = require('jsonwebtoken');
const { secret } = require('../.config').jwtCredentials;

const router = Router();

router.get(
  '/',
  (req, res, next) => (req.user ? res.redirect('/') : next()),
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);

router.get('/redirect',
  passport.authenticate('google', { session: false }),
  (req, res) => res.cookie('jwt', sign({ id: req.user.id }, secret, { expiresIn: '12h' }), { maxAge: 43200000 }).redirect('/api/current'));

module.exports = router;
