const mongoose=require('mongoose')

const locationSchema=new mongoose.Schema({
    locationName:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        required:true
    }
})


const adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    location:{
        type:[locationSchema],
        required:true
    }
})
const Admin= mongoose.model('Admin',adminSchema)
module.exports=Admin