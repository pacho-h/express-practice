import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 8,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
    if (plainPassword === this.password) {
        callback(null, true);
    } else {
        callback(null, false);
    }
    return callback({error: 'error'});
};

export const User = mongoose.model('User', userSchema);