const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const auth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        
        if (!header) {
            return res.status(401).json({ message: "No authorization headers!"});
        };

        const [bearer, token] = header.split(" ");
        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Wrong authorization header format!"});
        };

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(verifyToken._id);
        if (!user || user.token !== token) {
            return res.status(401).json({ message: "Not authorized!"});
        };

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
      console.error(error);
      next(error);  
    };
};

module.exports = auth;