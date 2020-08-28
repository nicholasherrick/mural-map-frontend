const express = require('express');
const router = express.Router();
const { register, login, logout, authenticated } = require('./authRouter');
const passport = require('passport');
const passportConfig = require('../middleware/passport');

function routes(app) {
  router.post('/auth/register', register);

  router.post(
    '/auth/login',
    passport.authenticate('local', { session: false }),
    login
  );

  router.post(
    '/auth/logout',
    passport.authenticate('jwt', { session: false }),
    logout
  );

  router.post(
    '/auth/authenticated',
    passport.authenticate('jwt', { session: false }),
    authenticated
  );

  return router;
}

module.exports = routes;
