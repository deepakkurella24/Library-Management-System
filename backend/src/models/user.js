const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true
    },
    mobileNumber: {
        type: String,
        required: [true, 'mobile number is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    role: {
        type: String,
        default: 'Librarian'
    }
}, {
    timestamps: true
});

userSchema.methods.getJWT = function () {
    const user = this;
    return jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'librarySecretKey@123', { expiresIn: '7d' });
};

userSchema.methods.validatePasswordFromDB = function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

module.exports = mongoose.model('User', userSchema);
