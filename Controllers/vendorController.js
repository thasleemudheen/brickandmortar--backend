const express=require('express')
const app=express()
const fs=require('fs')
const path=require('path')
const crypto=require('crypto')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
app.use(cookieParser())
const otpService=require('../services/otpService')
const cloudinary=require('../config/cloudinary')
const multer = require('multer')
const upload=multer({dest:'/uploads'})
const Vendor=require('../Models/vendorModel')
const tokenService=require('../services/tokenService')
const Property = require('../Models/propertyModel')
require('dotenv').config()


function generateFileToken() {
    return crypto.randomBytes(20).toString('hex');
  }

const vendorSignupPost=async(req,res)=>{
     try {
    const {vendorName,vendorEmail,password,confirmPassword,vendorPhone}=req.body
    const vendorExist=await Vendor.findOne({vendorEmail})
    if(vendorExist){
      return res.status(409).json({message:'Mail is already exist'})
    }
    const documentProof=req.file
    const otp=otpService.generateOTP()
    await otpService.sendOTP(vendorEmail,otp)
    req.session.vendorProof=documentProof
    const fileToken = generateFileToken();

    const tempStorage = req.app.locals.tempStorage || {};
    tempStorage[fileToken] = {
      path: documentProof.path,
      originalName: documentProof.originalname,
      fieldname:documentProof.fieldname,
      encoding:documentProof.encoding,
      mimetype:documentProof.mimetype,
      destination:documentProof.destination,
      filename:documentProof.filename,
      size:documentProof.size
    };
    req.app.locals.tempStorage = tempStorage;

    res.cookie('otp',otp,{httpOnly:false,expires: new Date(Date.now() + 5 * 60 * 1000)})
    res.cookie('fileToken', fileToken, { httpOnly: false, expires: new Date(Date.now() + 30 * 60 * 1000) });
    res.status(200).json({message:'send otp to the vendor ',success:true})
     } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
     }
}
const verifyOtpPage=async(req,res)=>{
    try {
      const originOtp=req.cookies.otp
    // console.log(originOtp)
    const fileToken = req.cookies.fileToken;
    const {otp,data}=req.body
    console.log('user entered otop',otp)
    if(originOtp !==otp){
      return res.status(400).json({message:'Invalid OTP'})
    }
    const vendorName=data.vendorName
    const vendorEmail=data.vendorEmail
    const vendorPhone=data.vendorPhone
    const password=data.password
   
    const hashedPassword= await bcrypt.hash(password,10)
    // console.log(vendorName)
    const tempStorage = req.app.locals.tempStorage || {};
    if(Object.keys(tempStorage).length==0){
        return res.status(404).json({message:'you want to upload the image again'})
    }
    // console.log('Temp storage items:', tempStorage);
    const productImage=Object.values(tempStorage)
//  console.log(productImage)
//  const productImage=req.files
 let imageUrls =null

 const result = await Promise.all(productImage.map(async (image) => {
     const result = await cloudinary.uploader.upload(image.path);
    //  console.log('result after uploading to cloudinary',result)
     imageUrls=result.secure_url;
 }));  
 console.log('image that want to store for database',imageUrls)
          const newVendor=new Vendor({
            vendorName,
            vendorEmail,
            vendorPhone,
            password:hashedPassword,
            documentProof:imageUrls
          })
          await newVendor.save()
        
          delete req.app.locals.tempStorage[fileToken];
    res.status(200).json({message:'vendor registered successfully'})
    } catch (error) {
      console.log(error)
      res.status(500).json({message:'internal server error'})
    }
}
const vendorLoginPostPage=async(req,res)=>{
      // console.log(req.body)
      const {email,password}=req.body
      try {
        const vendor=await Vendor.findOne({vendorEmail:email})
          // console.log('vendor before')
        if(!vendor){
          return res.status(404).json({message:'vendor did not find '})
        }
        // console.log('vendor after')
        const originalPassword=await bcrypt.compare(password,vendor.password)
        // console.log(originalPassword)
        // console.log('vendor have value',vendor)
        if(!originalPassword){
          return res.status(404).json({message:'password is not valid'})
        }
        const isApproved=vendor.isApproved
        // console.log(isApproved)
        if(!isApproved){
          return res.status(404).json({message:'your application is under verification process'})
        }
        const token=jwt.sign({
          vendorId:vendor._id,
          vendorEmail:vendor.vendorEmail},
          process.env.JWT_SECRET,{expiresIn:'24h'}
        )
        res.cookie('vendorToken', token, { httpOnly: false, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        res.status(200).json({message:'venodor successfully logged in ',token})
      } catch (error) {
          console.log(error)
          res.status(500).json({message:"internal server error"})
      }
     
    }
    const vendorAddPropertyPost = async (req, res) => {
      // console.log(req.body);
      console.log('req.files', req.files);
    
      const propertyImages = req.files;
      const vendorId = req.vendorId;
    
      const {
        PropertyName, propertyPrice, PropertyType, State,
        location, exactlocation, description,
        distancetoNearbyplaces, AdditionalDetails
      } = req.body;
    
      try {
        // Parse the JSON strings from the request body
        let parsedAdditionalDetails, parsedDistanceNearbyPlaces;
    
        try {
          parsedAdditionalDetails = JSON.parse(AdditionalDetails); // this is additional details
          parsedDistanceNearbyPlaces = JSON.parse(distancetoNearbyplaces); // this is distance to nearby places
        } catch (err) {
          return res.status(400).json({ message: "Invalid JSON format in AdditionalDetails or distancetoNearbyplaces" });
        }
       const property=await Property.find()
        // console.log('parsed additional details:', parsedAdditionalDetails);
        // console.log('parsed distance to nearby places:', parsedDistanceNearbyPlaces);
        // console.log('vendor id', vendorId);
    
        // Uploading images to Cloudinary and storing URLs
        const imageUrls = [];
    
        // Proper use of Promise.all to handle image uploads
        await Promise.all(propertyImages.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.path);
          imageUrls.push(result.secure_url);
        }));
        const getFirstNonEmptyValue = (key, array) => {
          for (let i = 0; i < array.length; i++) {
            if (array[i][key] && array[i][key].trim() !== '') {
              return array[i][key]; // Return the first non-empty value
            }
          }
          return ''; // If all are empty, return empty string
        };
    
        // Combining parsed additional details into a single object
        const additionalDetails = {
          rooms: getFirstNonEmptyValue('Rooms', parsedAdditionalDetails),
          bathrooms: getFirstNonEmptyValue('bathrooms', parsedAdditionalDetails),
          floors: getFirstNonEmptyValue('floors', parsedAdditionalDetails)
        };
    
        // Combining parsed distance to nearby places into a single object
        const distancetoNearbyPlaces = {
          school: getFirstNonEmptyValue('School', parsedDistanceNearbyPlaces),
          hospital: getFirstNonEmptyValue('Hospital', parsedDistanceNearbyPlaces),
          placeOfWorship: getFirstNonEmptyValue('Placeofworship', parsedDistanceNearbyPlaces),
          restaurant: getFirstNonEmptyValue('restaurant', parsedDistanceNearbyPlaces)
        };
        // console.log(distancetoNearbyPlaces)
        // console.log(additionalDetails)
        // Creating new property document
        const newProperty = new Property({
          propertyName: PropertyName,
          propertyPrice: propertyPrice,
          propertyType: PropertyType,
          propertyState: State,
          propertyLocation: location,
          // Combine all fields into a single object
          additionalDetails: additionalDetails,
          distancetoNearbyPlaces:distancetoNearbyPlaces ,
          exactLocation: exactlocation,
          description: description,
          images: imageUrls, // store array of image URLs
          vendor: vendorId
        });
    
        console.log('new property ', newProperty);
        await newProperty.save();
        res.status(200).json({ message: 'Property added successfully',property });
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    const propertyListGet=async(req,res)=>{
      // console.log('get request is heerre')
      const vendorId=req.vendorId
      try {
         const properties=await Property.find({vendor:vendorId})
        //  console.log(properties)
        //  const vendorId=properties.map((pro)=>pro.vendor)
        //  console.log(vendorId)
        //  const vendor=await Vendor.findById(vendorId)
        //  console.log(vendor)
        res.status(200).json({message:'this is the property list',properties})
      } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
      }
    }
    const editVendorProperty=async(req,res)=>{
      // Log the incoming request body and files
  console.log('Request body data from the frontend:', req.body);
   const propertyId=req.body._id
   const vendorId=req.vendorId
   const {propertyName,propertyPrice,propertyType,propertyState,propertyLocation,exactLocation,description,images,imagesToDelete}=req.body
   
  // Parse the JSON fields from the form data
  const additionalDetails = JSON.parse(req.body.additionalDetails);
  const distancetoNearbyPlaces = JSON.parse(req.body.distancetoNearbyPlaces);

  console.log('Parsed additional details:', additionalDetails);
  console.log('Parsed distance to nearby places:', distancetoNearbyPlaces);

  // Handle uploaded files (images)
  console.log('Uploaded files:', req.files); // Files will be available in req.files


    }
module.exports={
   vendorSignupPost,
   verifyOtpPage,
   vendorLoginPostPage,
   vendorAddPropertyPost,
   propertyListGet,
   editVendorProperty
}