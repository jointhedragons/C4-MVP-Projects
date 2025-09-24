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

hotelSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

hotelSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);
