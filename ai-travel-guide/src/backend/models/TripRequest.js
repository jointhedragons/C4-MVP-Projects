const mongoose = require('mongoose');

const activityItemSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true }, // reference to activity
  time: { type: String, default: '' }, // optional: Morning, Afternoon, Evening
});

const dayItinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  theme: { type: String, default: '' },
  activities: [activityItemSchema],
});

const tripRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  budget: { type: Number }, // optional, can be AI calculated
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }], // suggested hotels
  itinerary: [dayItinerarySchema], // array of days, each with activities
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('TripRequest', tripRequestSchema);
