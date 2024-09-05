const jwt = require('jsonwebtoken');
require('dotenv').config()
const protectRoute = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];
    console.log('token form the middleware',token)
    jwt.verify(token,process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;  
        console.log('its log from the middleware',req.user)
        next();
    });
};

module.exports = protectRoute;
