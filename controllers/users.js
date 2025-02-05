const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const takenEmail = await User.findOne({email});

        if (takenEmail) {
            return res.status(409).json({ message: "Email in use"});
        }

        const saltedPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email, {s: "250", r: "pg", d: "identicon"});
        const verificationToken = uuidv4();

        const newUser = new User({ email, password: saltedPassword, avatarURL, verificationToken: verificationToken});
        await newUser.save();

        const msg = {
            to: 'example@gmail.com',
            from: 'example@gmail.com',
            subject: 'Email Verification',
            text: `Your verification link: http://localhost:3000/api/users/verify/${verificationToken}`,
        };

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          
        sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch(error => {
            console.error(error);
        });

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

        if (!user.verify) {
            return res.status(401).json({ message: "Email is not verified!"});
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

const verifyEmail = async (req, res, next) => {
    try {
        const userToVerify = await User.findOne({verificationToken: req.params.verificationToken});

        if (!userToVerify) {
            return res.status(400).json({ message: "Not Found"});
        };

        userToVerify.verificationToken = "null";
        userToVerify.verify = true;
        await userToVerify.save();

        res.json({
            status: 'Success',
            code: 200,
            message: "Verification successfull"
        });
    } catch (error) {
        console.log(error);
        next(error);
    };
};

const verifyEmailAgain = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Missing required field email"});
        };

        const userToVerify = await User.findOne({email: email});

        if (!userToVerify) {
            return res.status(400).json({ message: "Not Found"});
        };

        if (userToVerify.verificationToken === "null") {
            return res.status(400).json({ message: "Verification has already been passed"});
        }

        const msg = {
            to: 'example@gmail.com',
            from: 'example@gmail.com',
            subject: 'Email Verification',
            text: `Your verification link: http://localhost:3000/api/users/verify/${userToVerify.verificationToken}`,
        };

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          
        sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch(error => {
            console.error(error);
        });

        res.json({
            status: 'Success',
            code: 200,
            message: "Verification email sent"
        });
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
    verifyEmail,
    verifyEmailAgain,
};

