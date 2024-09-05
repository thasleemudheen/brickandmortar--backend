const express=require('express')
const app=express()
const Admin=require('../Models/adminModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const Vendor=require('../Models/vendorModel')
const cookieParser=require('cookie-parser')
app.use(cookieParser())
require('dotenv').config()
const postAdminLoginPage=async(req,res)=>{
    console.log('nothing in the frontend')
    try {
        const {email,password}=req.body
        // console.log(req.body)
        if(!email || !password){
         return res.status(404).json({message:'email and password are required'})
        }
        const admin=await Admin.findOne({email})
        // console.log(admin)
        if(!admin){
            return res.status(404).json({message:'admin not found'})
        }
        const token=jwt.sign({
            id:admin._id,
            email:admin.email
        },process.env.JWT_SECRET,
        {expiresIn:'24h'}
     )
     res.cookie('adminToken',token,{httpOnly:false,maxAge:86400000})
        res.status(200).json({message:'admin founded',token})
    } catch (error) {
        console.log(error)
    }
}


const locationAddPost=async(req,res)=>{
    try {
        // console.log(req.body)
        const {location}=req.body
    const token=req.cookies.adminToken
    if(!token){
        return res.status(404).json({message:'token not found'})
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const adminId=decoded.id
    const admin=await Admin.findById(adminId)
    if(!admin){
        return res.status(404).json({message:'admin not founded'})
    }
    const newLocation={
        locationName:location,
        createdAt:new Date().toISOString()
    }
     admin.location.push(newLocation)
     await admin.save()
     const locations = admin.location; // Assuming this is your array of locations
     const latestLocation = locations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
     res.status(200).json({message:'admin location added successfully',latestLocation})
    } catch (error) {
         console.log(error)
         res.status(500).json({message:'internal server error'})
    }
    
}

const locationGetPage=async(req,res)=>{
    try {
        const token=req.cookies.adminToken
        // console.log(token)
        if(!token){
            return res.status(404).json({message:'token not found'})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const adminId=decoded.id
        const admin=await Admin.findById(adminId)
        // console.log(admin)
        if(!admin){
            return res.status(404).json({message:'admin not found'})
        }
        const locations=admin.location        
        res.status(200).json({message:'location founded',locations})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'something went wrong with finding location'})
    }

}
const adminDeleteLocation=async(req,res)=>{
    const locationId=req.params.id
        try {
            const token=req.cookies.adminToken
            if(!token){
                return res.status(404).json({message:'admin not found'})
            }
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            const decodedId=decoded.id
            const admin=await Admin.findById(decodedId)
            // console.log(admin)
            
            const filteredLocation=admin.location.filter(loc=>loc._id.toString()!==locationId)
            // console.log('filtered locations',filteredLocation)
            admin.location=filteredLocation
            await admin.save()
            res.status(200).json({message:'admin location deleted successfully',filteredLocation})
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'internal server error'})
        }
}

const adminEditLocation=async(req,res)=>{
    // console.log(req)
    // console.log(req.body)
    const locationId=req.params.id
    // console.log(locationId)
    // console.log(typeof locationId)
    const {newLocationName}=req.body
    // console.log(locationName)
    const token=req.cookies.adminToken
                // console.log(token)
    if(!token){
        return res.status(404).json({message:'token not found'})
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const adminId=decoded.id
    const admin=await Admin.findById(adminId)
    // console.log(admin)
    if(!admin){
        return res.status(404).json({message:'admin not found'})
    }
    //   console.log(newLocationName);
      
        const location = admin.location.find(loc => loc._id.toString() === locationId);  // Find the location by ID
        // console.log(location.locationName)
        location.locationName=newLocationName
        await admin.save()
        const updatedLocation=admin.location
        res.status(200).json({message:'location updated successfully',updatedLocation})
                // location.locationName=newLocationName
}
const vendorsListGetPage=async(req,res)=>{
    // console.log('request is here')
    const vendors=await Vendor.find()
    console.log(vendors)
    res.status(200).json({message:'vendor details passed ',vendors})
}
const adminChangeStatusOfVendor=async(req,res)=>{
    // console.log(req)
    console.log(req.params.id)
    try {
        const vendorId=req.params.id
        const vendor=await Vendor.findById(vendorId)
        if(!vendor){
            return res.status(404).json({message:"vendor not found "})
        }
        console.log(vendor)
        vendor.isApproved=!vendor.isApproved
        await vendor.save()
        console.log('after updating the status',vendor)
        res.status(200).json({message:'status changed successfully',vendor})
          
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong with updating detials"})
    }
   
    
}
module.exports={
    postAdminLoginPage,
    locationAddPost,
    locationGetPage,
    adminDeleteLocation,
    adminEditLocation,
    vendorsListGetPage,
    adminChangeStatusOfVendor

}