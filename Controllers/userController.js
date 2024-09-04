const express=require('express')
const app=express()
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const User=require('../Models/userModel')

const signupPostpage=async(req,res)=>{
    console.log(req.body)
    const {userName,userEmail,password,userPhone}=req.body
    try {
        const existUser=await User.findOne({userEmail})
        if(existUser){
            return res.status(404).json({message:"the email is already exist "})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        console.log(hashedPassword)

        const newUser=new User({
            userName,
            userEmail,
            password:hashedPassword,
            userPhone
        })
        await newUser.save()
        res.status(200).json({message:'user signup successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
   
}
const UserLoginPostPage=async(req,res)=>{
    console.log(req.body)
}
module.exports={
    signupPostpage,
    UserLoginPostPage
}