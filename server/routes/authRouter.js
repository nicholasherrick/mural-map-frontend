const JWT = require('jsonwebtoken');
const User = require('../models/user');

const signToken = (userId) => {
  return JWT.sign(
    {
      iss: 'jwtMagic',
      sub: userId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '24h' }
  );
};

exports.login = async function (req, res, next) {
  try {
    if (req.isAuthenticated()) {
      const { _id, email, username } = await req.user;
      const token = await signToken(_id);
      res.cookie('access_token', token, { httpOnly: true, sameSite: true });
      res
        .status(200)
        .json({ isAuthenticated: true, user: { _id, email, username } });
    }
  } catch (err) {
    return next({ status: 400, message: 'Invalid Email/Password' });
  }
};

exports.register = async function (req, res, next) {
  try {
    let user = await User.create(req.body);
    let { id, email, username } = user;
    let token = signToken(id);
    return res.status(201).json({
      id,
      email,
      username,
      token,
      message: {
        msgBody: 'Account created successfully',
        msgError: false,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Sorry, that email and/or username is already taken';
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.logout = function (req, res) {
  debugger;
  res.clearCookie('access_token');
  res.json({ user: { _id: '', email: '', username: '' }, success: true });
  debugger;
};

exports.authenticated = function (req, res) {
  const { _id, email, username } = req.user;
  res
    .status(200)
    .json({ isAuthenticated: true, user: { _id, email, username } });
};
