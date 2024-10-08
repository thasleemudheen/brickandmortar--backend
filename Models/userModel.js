const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    userEmail:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userPhone:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
})

const User=mongoose.model('User',userSchema)
module.exports=User