const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  description: { type: String },
  duration_minutes: { type: Number },
  tags: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  image: { type: String },
}, { timestamps: true });

activitySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    if (ret._id) {
      ret.id = ret._id.toString();
      delete ret._id;
    }
  }
});

module.exports = mongoose.model('Activity', activitySchema);
