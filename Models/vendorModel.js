const mongoose=require('mongoose')
const vendorSchema=new mongoose.Schema({
    vendorName:{
        type:String,
        required:true
    },
    vendorEmail:{
        type:String,
        required:true,
        unique:true
    },
    vendorPhone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    documentProof:{
        type:String,
        required:true
    },
    isApproved:{
        type:Boolean,
        default:false
    }
})

const Vendor=mongoose.model('Vendor',vendorSchema)
module.exports=Vendor