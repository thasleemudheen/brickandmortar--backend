const express=require('express')
const app=express()
const router=express.Router()
const upload=require('../config/multer')
const vendorController=require('../Controllers/vendorController')
const authMiddleWare=require('../middleWares/authMiddleWare')
const vendorAuth = require('../middleWares/vendorAuth')
router.post('/vendor/signup',upload.single('file'),vendorController.vendorSignupPost)
router.post('/vendor/verifyOtp',vendorController.verifyOtpPage)
router.post('/vendor/login',vendorController.vendorLoginPostPage)
router.post('/vendor/addProperty',vendorAuth,upload.array('image',10),vendorController.vendorAddPropertyPost)
router.get('/vendor/properties',vendorAuth,vendorController.propertyListGet)
router.patch('/vendor/editProuduct',vendorAuth,upload.array('images',10),vendorController.editVendorProperty)
module.exports=router
