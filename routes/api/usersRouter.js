const express = require('express');
const {
    signup,
    login,
    logout,
    current,
    changeSub } = require('../../controllers/users');
const auth = require('../../validation/authorization');
const { checkUser, checkSub } = require('../../validation/userValidation');

const router = express.Router();

router.post('/signup', checkUser, signup);

router.post('/login', checkUser, login);

router.get('/logout', auth, logout);

router.get('/current', auth, current);

router.patch('/', auth, checkSub, changeSub);

module.exports = router;