const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
    index: true
  },
  farmerId: {
    type: String,
    required: true,
    index: true
  },
  
  // Property Details
  propertyName: {
    type: String,
    required: true,
    trim: true
  },
  propertyType: {
    type: String,
    enum: ['Agricultural Land', 'Farm House', 'Plantation', 'Mixed Use', 'Other'],
    default: 'Agricultural Land'
  },
  area: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'bigha', 'guntha'],
      default: 'acres'
    }
  },
  
  // Location Information
  location: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]], // Array of coordinate arrays for polygon
      required: true
    }
  },
  address: {
    village: String,
    taluka: String,
    district: String,
    state: String,
    pincode: String
  },
  
  // Map Coordinates (center point for display)
  centerCoordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  
  // Soil and Crop Information
  soilType: {
    type: String,
    enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain', 'Other']
  },
  currentCrop: String,
  irrigationType: {
    type: String,
    enum: ['Rainfed', 'Drip', 'Sprinkler', 'Flood', 'Mixed']
  },
  
  // Legal Documents
  documents: [{
    documentType: {
      type: String,
      enum: ['Land Ownership', '7/12 Extract', 'Survey Document', 'Tax Receipt', 'Other'],
      required: true
    },
    documentName: String,
    fileId: mongoose.Schema.Types.ObjectId, // GridFS file ID
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Property Status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
propertySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);
