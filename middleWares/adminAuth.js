const express=require('express')
const jwt=require('jsonwebtoken')
const app=express()
require('dotenv').config()

const adminAuth = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.status(404).json({ message: 'admin not found' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = adminAuth;
