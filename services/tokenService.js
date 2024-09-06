const jwt=require('jsonwebtoken')
require('dotenv').config()

const generateAccessToken=(user)=>{
    const payload = {
        userId:user._id,
        email:user.userEmail,   
    }
    return jwt.sign(payload , process.env.ACCESS_TOKEN, { expiresIn: '15m' });
}

const generateRefreshToken=(user)=>{
    return jwt.sign({ userId: user._id, userEmail: user.userEmail}, process.env.REFRESH_TOKEN, { expiresIn: '7d' });
}

module.exports={generateAccessToken,generateRefreshToken}