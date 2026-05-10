const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  duration: {
    type: Number,
    default: 30
  }
});

// 🔥 Location schema (GeoJSON)
const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  }
});

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  // 🔥 GEO LOCATION (UPGRADED)
  location: locationSchema,

  rating: {
    type: Number,
    default: 4
  },

  services: [serviceSchema],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

// 🔥 Geo index (VERY IMPORTANT)
hospitalSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Hospital", hospitalSchema);