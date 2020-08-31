const db = require('../models');
const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.getMurals = async function (req, res, next) {
  try {
    let murals = await db.Mural.find()
      .sort({ createdAt: 'desc' })
      .populate('user', {
        username: true,
        profileImageUrl: true,
      });
    return res.status(200).json(murals);
  } catch (err) {
    return next(err);
  }
};

exports.createMural = async function (req, res, next) {
  if (req.file) {
    coudinary.uploader
      .upload(`./files/${req.file.originalname}`, function (result) {
        console.log(result);
      })
      .then(function () {
        let path = `./files/${req.file.originalname}`;

        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log('File successfully removed from server');
        });
      })
      .catch(function (err) {
        console.log(err.error);
      });
    res.sendStatus(200).json(req);
  } else {
    res.sendStatus(200).json(req);
  }
};
