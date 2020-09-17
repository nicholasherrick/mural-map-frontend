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
      const { _id, email, username, instagram } = await req.user;
      const token = await signToken(_id);
      res.cookie('access_token', token, { httpOnly: true, sameSite: true });
      res.status(200).json({
        isAuthenticated: true,
        user: { _id, email, username, instagram },
      });
    }
  } catch (err) {
    return next({ status: 400, message: 'Invalid Email/Password' });
  }
};

exports.register = async function (req, res, next) {
  try {
    const requestEmail = req.body.email;
    User.findOne({ requestEmail }, async (err, user) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: { msgBody: 'Error has occurred', msgError: true } });
      } else if (user) {
        res.status(400).json({
          message: { msgBody: 'Email is already taken', msgError: true },
        });
      } else {
        let user = await User.create(req.body);
        let { id, email, username, instagram } = user;
        let token = signToken(id);
        return res.status(201).json({
          id,
          email,
          username,
          instagram,
          token,
          message: {
            msgBody: 'Account created successfully',
            msgError: false,
          },
        });
      }
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
  res.json({
    user: { _id: '', email: '', username: '', instagram: '' },
    success: true,
  });
  debugger;
};

exports.authenticated = function (req, res) {
  const { _id, email, username } = req.user;
  res.status(200).json({
    isAuthenticated: true,
    user: { _id, email, username, instagram: '' },
  });
};
