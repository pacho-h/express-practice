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

const User = mongoose.model('User', userSchema);