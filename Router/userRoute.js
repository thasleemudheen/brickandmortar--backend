const express=require('express')
const app=express()
const router=express.Router()
const userController=require('../Controllers/userController')

router.post('/signup',userController.signupPostpage)
module.exports=router
