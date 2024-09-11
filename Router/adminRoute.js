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
router.patch('/admin/changeStatus/:id',adminController.adminChangeStatusOfVendor)
router.get('/admin/users',adminController.userListGetPage)
router.patch('/admin/blockUser/:id',adminController.adminBlockUser)
router.post('/admin/addProperty',adminController.adminAddPropertyType)
router.get('/admin/property',adminController.propertyListGetPage)
module.exports=router;