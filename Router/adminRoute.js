const express=require('express')
const app=express()
const router=express.Router()
const adminController=require('../Controllers/adminController')


router.post('/admin/login',adminController.postAdminLoginPage)
router.post('/admin/addlocation',adminController.locationAddPost)
router.get('/admin/location',adminController.locationGetPage)
router.delete('/admin/deleteLocation/:id',adminController.adminDeleteLocation)
router.patch('/admin/editLocation/:id',adminController.adminEditLocation)
router.get('/admin/vendors',adminController.vendorsListGetPage)
module.exports=router;