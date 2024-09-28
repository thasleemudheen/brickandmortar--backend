const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyName: {
    type: String,
    required: true
  },
  propertyPrice: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  propertyState: {
    type: String,
    required: true
  },
  propertyLocation: {
    type: String,
    required: true
  },
  // Set additionalDetails as an object instead of an array
  additionalDetails: {
    rooms: String,
    bathrooms: String,
    floors: String
  },
  // Set distancetoNearbyPlaces as an object instead of an array
  distancetoNearbyPlaces: {
    school: String,
    hospital: String,
    placeOfWorship: String,
    restaurant: String
  },
  exactLocation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  }
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
