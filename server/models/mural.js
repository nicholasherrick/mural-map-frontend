const { Schema, model } = require('mongoose');
const User = require('./User');

const muralSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            maxLength: 160,
            trim: true
        },
        artist: {
            type: String,
            maxLength: 160,
            trim: true
        },
        instagram: {
            type: String,
            maxLength: 160,
            trim: true
        },
        lattitude: {
            type: Number,
            required: true,
            trim: true
        },
        longitude: {
            type: Number,
            required: true,
            trim: true
        },
        cloudinaryUrl: {
            type: String
        },
        cloudinaryPublicId: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Remove message id from User if message is deleted from database
muralSchema.pre('remove', async function (next) {
    try {
        let user = await User.findById(this.user);
        user.messages.remove(this.id);
        await user.save();
        return next();
    } catch (err) {
        return next(err);
    }
});

const Mural = model('Mural', muralSchema);

module.exports = Mural;
