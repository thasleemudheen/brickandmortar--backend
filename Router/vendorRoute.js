const express=require('express')
const app=express()
const router=express.Router()
const upload=require('../config/multer')
const vendorController=require('../Controllers/vendorController')
const authMiddleWare=require('../middleWares/authMiddleWare')
router.post('/vendor/signup',upload.single('file'),vendorController.vendorSignupPost)
router.post('/vendor/verifyOtp',vendorController.verifyOtpPage)
router.post('/vendor/login',vendorController.vendorLoginPostPage)
// router.get('/vendor/dashboard',authMiddleWare.authenticateToken,(req,res)=>{
//     res.send('vendordashboard')
// })
module.exports=router
