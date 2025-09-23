const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: String,
  destination: String,
  price_per_night: Number,
  rating: Number,
  location: String,
  source: String,
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
