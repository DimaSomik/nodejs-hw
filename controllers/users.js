const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const takenEmail = await User.findOne({email});

        if (takenEmail) {
            return res.status(409).json({ message: "Email in use"});
        }

        const saltedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: saltedPassword});
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

module.exports = {
    signup,
    login,
    logout,
    current,
    changeSub,
};

