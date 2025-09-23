const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: String,
  destination: String,
  description: String,
  duration_minutes: Number,
  tags: [String],
  rating: Number
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
