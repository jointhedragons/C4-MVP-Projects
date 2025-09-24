const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: String,
  destination: String,
  description: String,
  duration_minutes: Number,
  tags: [String],
  rating: Number,
  image: { type: String },
}, { timestamps: true });

activitySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('Activity', activitySchema);
