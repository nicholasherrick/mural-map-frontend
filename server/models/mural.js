const mongoose = require('mongoose');
const User = require('./user');

const muralSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: 160,
    },
    artist: {
      type: String,
      maxLength: 160,
    },
    instagram: {
      type: String,
      maxLength: 160,
    },
    lattitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    pictures: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
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

const Mural = mongoose.model('Mural', muralSchema);

module.exports = Mural;
