const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Define user Schema
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        instagram: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        savedMurals: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Mural'
            }
        ]
    },
    {
        toJson: {
            virtuals: true
        },
        id: false
    }
);

userSchema.virtual('muralCount').get(function () {
    return this.savedMurals.length;
});

// Bcrypt hook & hash
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

// Method checks if password is correct
userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return cb(err);
        else {
            if (!isMatch) return cb(null, isMatch);
            return cb(null, this);
        }
    });
};

// Create model

const User = model('User', userSchema);

module.exports = User;
