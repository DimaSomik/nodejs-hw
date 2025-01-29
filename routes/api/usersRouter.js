const express = require('express');
const {
    signup,
    login,
    logout,
    current,
    changeSub,
    updateAvatar } = require('../../controllers/users');
const auth = require('../../middlewares/authorization');
const upload = require('../../middlewares/upload');
const { checkUser, checkSub, checkAvatar } = require('../../middlewares/userValidation');

const router = express.Router();

router.post('/signup', checkUser, signup);

router.post('/login', checkUser, login);

router.get('/logout', auth, logout);

router.get('/current', auth, current);

router.patch('/', auth, checkSub, changeSub);

router.patch('/avatars', auth, upload.single('avatar'), checkAvatar, updateAvatar);

module.exports = router;