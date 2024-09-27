const express=require('express')
const jwt=require('jsonwebtoken')
require('dotenv').config()

const vendorAuth = (req, res, next) => {
    const token = req.cookies.vendorToken;
    // console.log(req)
    // console.log('token from middleware',token)
    if (!token) {
        return res.status(404).json({ message: 'not found please login and try again' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded details',decoded)
        req.vendorId = decoded.vendorId;
        console.log('req.vendorid form the middleware',req.vendorId)
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = vendorAuth;
