const db = require('../models');
const cloudinary = require('cloudinary').v2;
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
  let path = `./files/${req.file.filename}`;
  if (req.file) {
    cloudinary.uploader
      .upload(path, function (err, image) {
        db.Mural.create({
          title: req.body.title,
          artist: req.body.artist,
          instagram: req.body.instagram,
          lattitude: req.body.lattitude,
          longitude: req.body.longitude,
          pictures: image.url,
        });
      })
      .then(function () {
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
    res.sendStatus(200);
  } else {
    res.sendStatus(200);
  }
};
