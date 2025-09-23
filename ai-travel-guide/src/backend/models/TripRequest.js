const mongoose = require('mongoose');

const activityItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  time: String,
  location: String,
});

const tripRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  budget: { type: Number },
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }], // suggested hotels
  itinerary: [ [activityItemSchema] ], // array of days each with activities
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('TripRequest', tripRequestSchema);
