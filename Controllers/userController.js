const express=require('express')
const app=express()
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const User=require('../Models/userModel')
const otpService = require('../services/otpService')
const {generateAccessToken,generateRefreshToken}=require('../services/tokenService')

const signupPostpage=async(req,res)=>{
    console.log(req.body)
    const {userName,userEmail,password,userPhone}=req.body
    try {
        const existUser=await User.findOne({userEmail})
        if(existUser){
            return res.status(404).json({message:"the email is already exist "})
        }
        const otp=otpService.generateOTP()
        await otpService.sendOTP(userEmail,otp)
        res.cookie('uotp',otp,{httpOnly:false,expires: new Date(Date.now() + 5 * 60 * 1000)})
        res.status(200).json({message:'successfully send otp'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
   
}
const refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    // console.log('refresh token get from the cookie',refreshToken)
    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token not provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
         console.log('user i get from the when creating the new access token',user)
        const newAccessToken = generateAccessToken(user);
        console.log('newAccess token generated ',newAccessToken)
        res.status(200).json({ accessToken: newAccessToken });
    });
};

const verifyOtpForsignup=async(req,res)=>{
    console.log(req.body)
    const origin=req.cookies.uotp
    const {data,otp}=req.body
    if(origin!==otp){
        return res.status(404).json({message:'OTP is not valid'})
    }
    const password=data.password
    const hashedPassword=await bcrypt.hash(password,10)
    try {
        const newUser=new User({
            userName:data.userName,
            userEmail:data.userEmail,
            password:hashedPassword,
            userPhone:data.userPhone
        })
        await newUser.save()
        const accessToken=generateAccessToken(newUser)
        const refreshToken=generateRefreshToken(newUser)
        console.log(refreshToken)
        res.cookie('refreshToken', refreshToken, { httpOnly: false, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.status(200).json({message:'user signup successfully',accessToken})
    } catch (error) {
        
    }
    
}

const UserLoginPostPage=async(req,res)=>{
    // console.log(req)
    console.log(req.body)
    const {email,password}=req.body
    try {
        const user=await User.findOne({userEmail:email})
        if(!user){
            return res.status(404).json({message:'user not founded'})
        }
        const originalPassword=await bcrypt.compare(password,user.password)
        if(!originalPassword){
            return res.status(403).json({message:'password is not match'})
        }
        const accessToken=generateAccessToken(user)
        const refreshToken=generateRefreshToken(user)
        // console.log(refreshToken)
        res.cookie('refreshToken', refreshToken, { httpOnly: false, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        console.log('refresh token saved to cookie')
        res.status(200).json({message:'user login successfully',accessToken})
        console.log('its reached here')
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'something went wrong with login'})
    }
   
}
const userHOmePage=async(req,res)=>{
     console.log('userid find from the protected user',req.user)
     res.status(200).json({message:'this is home page and get the data'})
}
module.exports={
    signupPostpage,
    UserLoginPostPage,
    verifyOtpForsignup,
    refreshAccessToken,
    userHOmePage
}