const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const takenEmail = await User.findOne({email});

        if (takenEmail) {
            return res.status(409).json({ message: "Email in use"});
        }

        const saltedPassword = await bcrypt.hash(password, 10);

        const avatarURL = gravatar.url(email, {s: "250", r: "pg", d: "identicon"});

        const newUser = new User({ email, password: saltedPassword, avatarURL});
        await newUser.save();

        res.json({
            status: 'Created',
            code: 201,
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    };
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).json({ message: "Email or password is wrong"});
        };

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return res.status(401).json({ message: "Email or password is wrong"});
        };

        const newToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        user.token = newToken;
        await user.save();

        res.json({
            status: 'Success',
            code: 200,
            token: newToken,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    };
};

const logout = async (req, res, next) => {
    try {
        req.user.token = null;
        await req.user.save();
        res.status(204).send();
    } catch (error) {
      console.log(error);
      next(error);  
    };
};

const current = async (req, res, next) => {
    try {
        res.json({
            status: 'Success',
            code: 200,
            user: {
                email: req.user.email,
                subscription: req.user.subscription,
            },
        });
    } catch (error) {
      console.log(error);
      next(error);  
    };
};

const changeSub = async (req, res, next) => {
    try {
        const { subscription } = req.body;
        const user = req.user;

        user.subscription = subscription;
        await user.save();

        res.json({
            status: 'Success',
            code: 200,
            user: {
                email: req.user.email,
                subscription: req.user.subscription,
            },
        });
    } catch (error) {
        console.log(error);
        next(error);      
    };
};

const updateAvatar = async (req, res, next) => {
    try {
        const { path: tmpPath, originalname} = req.file;
        const { _id } = req.user;

        const fileName = `${_id}_${uuidv4()}${path.extname(originalname)}`;
        const avatarsPath = path.join(__dirname, "..", "public", "avatars");
        const imgPath = path.join(avatarsPath, fileName);

        await fs.mkdir(avatarsPath, { recursive: true });

        try {
            const img = await Jimp.read(tmpPath);
            await img.resize({
                w: 250,
                h: 250,
            });
            await img.write(imgPath);
            await fs.unlink(tmpPath);

            const avatarURL = `/avatars/${fileName}`;
            await User.findByIdAndUpdate(_id, { avatarURL });

            res.json({
                status: "Success",
                avatarURL,
                message: "Avatar was uploaded successfully!",
            });
        } catch (error) {
            await fs.unlink(tmpPath).catch(console.error(error));
        };
    } catch (error) {
        console.log(error);
        next(error);
    };
};

module.exports = {
    signup,
    login,
    logout,
    current,
    changeSub,
    updateAvatar,
};

