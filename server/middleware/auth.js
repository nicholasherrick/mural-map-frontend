const jwt = require('jsonwebtoken');
const { default: next } = require('next');

exports.loginRequired = function (req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
      if (decoded) {
        return next();
      } else {
        res.status(401).json({
          message: { msgBody: 'Please log in first', msgError: true },
        });
      }
    });
  } catch (err) {
    return res
      .status(401)
      .json({ message: { msgBody: 'Please log in first', msgError: true } });
  }
};

exports.ensureCorrectUser = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.veryfy(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
      if (decoded && decoded.id === req.params.userId) {
        return next();
      } else {
        res
          .status(401)
          .json({ message: { msgBody: 'Unauthorized', msgError: true } });
      }
    });
  } catch (err) {
    res
      .status(401)
      .json({ message: { msgBody: 'Unauthorized', msgError: true } });
  }
};
