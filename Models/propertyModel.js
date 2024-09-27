const mongoose=require('mongoose')

const propertySchema=new mongoose.Schema({
    propertyName:{
        type:String,
        required:true
    },
    propertyPrice:{
        type:String,
        required:true
    },
    propertyType:{
        type:String,
        required:true
    },
    propertyState:{
        type:String,
        required:true
    },
    propertyLocation:{
        type:String,
        required:true
    },
    additionalDetails: {
        type: [{
            rooms: { type: String, required: true },
            bathrooms: { type: String, required: true },
            floors: { type: String, required: true }
        }],
        required: true
    },
    nearByPlace: {
        type: [{
            place: { type: String, required: true },
            distance: { type: String, required: true } // Store distances as strings or numbers based on requirement
        }],
        required: true
    },
    exactLocation:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    vendor:{
         type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true } 
})
const Property=mongoose.model('Property',propertySchema)
module.exports=Property