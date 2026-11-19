const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/userAuth');

router.post('/auth/login', async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;
        if (!mobileNumber || !password) {
            throw new Error('please enter mobile number and password');
        }

        const user = await User.findOne({ mobileNumber });
        if (!user) throw new Error('invalid credentials');

        const isMatch = await user.validatePasswordFromDB(password);
        if (!isMatch) throw new Error('incorrect password');

        const jwtToken = await user.getJWT();
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        const { _id, name, mobileNumber: phone, role } = user;
        res.json({ isLoggedIn: true, data: { _id, name, mobileNumber: phone, role } });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

router.post('/auth/logout', (req, res) => {
    res.cookie('token', null, { expires: new Date(0) });
    res.json({ message: 'logged out successfully' });
});

router.get('/auth/check', userAuth, (req, res) => {
    const { _id, name, mobileNumber, role } = req.user;
    res.json({ isLoggedIn: true, data: { _id, name, mobileNumber, role } });
});

module.exports = router;
