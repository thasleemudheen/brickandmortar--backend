const express=require('express')
const app=express()
const Admin=require('../Models/adminModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const Vendor=require('../Models/vendorModel')
const cookieParser=require('cookie-parser')
const User=require('../Models/userModel')
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
    // console.log(newLocationName)
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
    // console.log(vendors)
    res.status(200).json({message:'vendor details passed ',vendors})
}
const adminChangeStatusOfVendor=async(req,res)=>{
    // console.log(req)
    // console.log(req.params.id)
    try {
        const vendorId=req.params.id
        const vendor=await Vendor.findById(vendorId)
        if(!vendor){
            return res.status(404).json({message:"vendor not found "})
        }
        // console.log(vendor)
        vendor.isApproved=!vendor.isApproved
        await vendor.save()
        // console.log('after updating the status',vendor)
        res.status(200).json({message:'status changed successfully',vendor})
          
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong with updating detials"})
    }
}

const userListGetPage=async(req,res)=>{
    try {
        const users=await User.find()
        // console.log(users)
        res.status(200).json({message:'users list',users})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'something went wrong'})
    }
}

const adminBlockUser=async(req,res)=>{
    const userId=req.params.id
//    console.log('user id form the paramas',userId)
    try {
    const user=await User.findById(userId)
    if(!user){
        return res.status(404).json({message:'user not found'})
    }
    // console.log(user)
    
    // console.log('Current user status:', user.isBlocked);
    // Toggle the isBlocked status
    user.isBlocked = !user.isBlocked;

    // console.log('Toggled user status:', user.isBlocked);

    // Save the updated user document
    await user.save();

    // console.log('Updated user status after save:', user.isBlocked);
    res.status(200).json({message:'user blocked ',user})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }  
}
const adminAddPropertyType=async(req,res)=>{
    // console.log('admin add property type ',req.body)
    const {PropertyName}=req.body
    try {
        // console.log('this is the property name',PropertyName)
    const admin=await Admin.findOne()
    if(!admin){
        return res.status(404).json({message:'admin not found'})
    }
    admin.propertyType.push({ propertyName: PropertyName })
    await admin.save()
    // const propertyType=admin.propertyType
    const addedProperty = admin.propertyType[admin.propertyType.length - 1];

    res.status(200).json({message:'property name added successfully',propertyType: addedProperty})
    console.log('after saving the details to the database',admin)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
} 
const propertyListGetPage=async(req,res)=>{
    try {
        const admin=await Admin.findOne()
        //  console.log(admin)
         const propertyType=admin.propertyType
        //  console.log(propertyType)
         res.status(200).json({message:'this is the property type list',propertyType})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

const adminEditPropertyName=async(req,res)=>{
    // console.log(req.body)
    // console.log('id for editing',req.params.id)
    const {newPropertyName}=req.body
    const editId=req.params.id
    const token=req.cookies.adminToken
    
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const adminId=decoded.id
        const admin=await Admin.findById(adminId)
        if(!admin){
            return res.status(404).json({message:'amdin not found'})
        }
        // console.log('editId:', editId);
        // console.log('admin.propertyType:', admin.propertyType);
        const property=admin.propertyType.find(loc=>loc._id.toString()===editId)
        // console.log('property',property)
        if(!property){
            return res.status(403).json({message:'property not found'})
        }
        property.propertyName=newPropertyName
        // console.log('property.propertyName',property.propertyName);
        
        await admin.save()
        const updatedProperty=admin.propertyType
        // console.log('updatedProperty',updatedProperty)
        res.status(200).json({message:"property name changed successfully",updatedProperty})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}
const adminDeletePorpertyType=async(req,res)=>{
       console.log(req.params.id)
       const editId=req.params.id
    //    console.log(req);
       
       const token=req.cookies.adminToken
       console.log(token)

       try {
          const decoded=jwt.verify(token,process.env.JWT_SECRET)
          const adminId=decoded.id
          const admin=await Admin.findById(adminId)
          if(!admin){
            return res(404).json({message:'admin not found'})
          }
          const filtered=admin.propertyType.filter(pro=>pro._id.toString()!==editId)
          admin.propertyType=filtered
          await admin.save()
           res.status(200).json({message:'deleted Successfully',filtered})
       } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
       }
}
module.exports={
    postAdminLoginPage,
    locationAddPost,
    locationGetPage,
    adminDeleteLocation,
    adminEditLocation,
    vendorsListGetPage,
    adminChangeStatusOfVendor,
    userListGetPage,
    adminBlockUser,
    adminAddPropertyType,
    propertyListGetPage,
    adminEditPropertyName,
    adminDeletePorpertyType

}