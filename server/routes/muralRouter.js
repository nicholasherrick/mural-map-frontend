const db = require('../models');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

exports.getMurals = async function (req, res, next) {
    try {
        let murals = await db.Mural.find().sort({ createdAt: 'desc' }).populate('user', {
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(murals);
    } catch (err) {
        return next(err);
    }
};

exports.createMural = async function (req, res, next) {
    if (req.file) {
        let path = `./files/${req.file.filename}`;
        cloudinary.uploader
            .upload(path, async function (err, image) {
                await db.Mural.create({
                    title: req.body.title,
                    artist: req.body.artist,
                    instagram: req.body.instagram,
                    lattitude: req.body.lattitude,
                    longitude: req.body.longitude,
                    cloudinaryUrl: image.url,
                    cloudinaryPublicId: image.public_id
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
        await db.Mural.create({
            title: req.body.title,
            artist: req.body.artist,
            instagram: req.body.instagram,
            lattitude: req.body.lattitude,
            longitude: req.body.longitude
        });
        res.sendStatus(200);
    }
};

exports.deleteMural = async function (req, res, next) {
    try {
        const mural = await db.Mural.findById(req.params.muralId);
        await db.Mural.findOneAndDelete({ _id: mural._id });

        if (mural.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(mural.cloudinaryPublicId, function (error, result) {
                console.log(error);
                console.log(result);
            });
        }

        return res.status(200).json({
            message: { msgBody: 'Mural successfully deleted', msgError: false }
        });
    } catch (err) {
        return next(err);
    }
};

exports.editMural = async function (req, res, next) {
    const updateMural = async (image = null) => {
        const updatedMural = await db.Mural.findOneAndUpdate(
            { _id: req.params.muralId },
            {
                $set: {
                    title: req.body.title,
                    artist: req.body.artist,
                    instagram: req.body.instagram,
                    cloudinaryUrl: image?.url,
                    cloudinaryPublicId: image?.public_id
                }
            }
        );
        res.json(updatedMural);
    };
    try {
        if (req.file) {
            let path = `./files/${req.file.filename}`;

            const imageUpload = cloudinary.uploader.upload(path, async function (err, image) {
                if (err) throw err;
                updateMural(image);
            });

            const deleteFile = fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('File successfully removed from server');
            });

            const oldImageDelete = cloudinary.uploader.destroy(
                req.body.oldCloudinaryPublicId,
                (err, result) => {
                    if (err) throw err;
                    console.log(result);
                }
            );

            await imageUpload;
            await deleteFile;
            await oldImageDelete;

            res.json(200);
        }
        updateMural();
    } catch (err) {
        return next(err);
    }
};
