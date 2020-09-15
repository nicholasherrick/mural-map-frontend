const express = require('express');
const router = express.Router();
const { register, login, logout, authenticated } = require('./authRouter');
const { getMurals, createMural, deleteMural } = require('./muralRouter');
const passport = require('passport');
const passportConfig = require('../middleware/passport');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './files',
  filename(req, file, cb) {
    cb(null, `${file.originalname}-${Date.now()}`);
  },
});

const upload = multer({ storage }).single('file');

function routes(app) {
  // =====AuthRoutes=====
  router.post('/auth/register', register);

  router.post(
    '/auth/login',
    passport.authenticate('local', { session: false }),
    login
  );

  router.get(
    '/auth/logout',
    passport.authenticate('jwt', { session: false }),
    logout
  );

  router.get(
    '/auth/authenticated',
    passport.authenticate('jwt', { session: false }),
    authenticated
  );

  // =====MuralRoutes=====
  router.get('/murals', getMurals);

  router.post('/users/:id/mural/create', upload, createMural);

  router.delete('/users/:userId/mural/delete/:muralId', deleteMural);

  return router;
}

module.exports = routes;
