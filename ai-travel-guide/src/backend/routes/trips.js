const router = require("express").Router();
const { auth, authorizeRoles } = require("../middleware/auth");
const TripRequest = require("../models/TripRequest");
const Hotel = require("../models/Hotel");
const Activity = require("../models/Activity");
const escReg = require("../utils/escapeRegex");

// ==============================
// Create trip — generate plan + save
// ==============================
const getDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + (diffDays === 1 ? " day" : " days");
}

router.post("/", auth, async (req, res, next) => {
  try {
    const { destination, start_date, end_date, budget, interests } = req.body;
    if (!destination || !start_date || !end_date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1️⃣ Call the AI API
    const aiApiUrl = (process.env.AI_API_URL || "http://localhost:8000") + "/plan";

    query = `I'm planning a trip to ${destination} for ${getDuration(start_date, end_date)}. My budget is ${budget}. My interests are: ${interests}.`;
  
    const response = await fetch(aiApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query }),
    });

    const data = await response.json();

    // 2️⃣ Replace hotel and activity IDs with objects
    const Hotel = require("../models/Hotel");
    const Activity = require("../models/Activity");

    const hotelObjects = await Hotel.find({
      _id: { $in: data.plan.recommendations.hotels }
    });

    const activityObjects = await Activity.find({
      _id: { $in: data.plan.recommendations.activities }
    });

    // Map IDs in daily itinerary to objects
    const dailyItinerary = data.plan.recommendations.daily_itinerary.map(day => ({
      day: day.day,
      theme: day.theme,
      activities: day.activities.map(actId =>
        activityObjects.find(a => a._id.toString() === actId)
      )
    }));

    // 3️⃣ Send the updated plan to frontend
    res.status(200).json({
      success: true,
      plan: {
        ...data.plan,
        recommendations: {
          hotels: hotelObjects,
          activities: activityObjects,
          daily_itinerary: dailyItinerary
        }
      }
    });

  } catch (err) {
    next(err);
  }
});

// ==============================
// List trips for current user
// ==============================
router.get("/", auth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const trips = await TripRequest.find({ user: req.user._id })
      .populate("hotels")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ count: trips.length, trips });
  } catch (err) {
    next(err);
  }
});

// ==============================
// Get single trip (owner only, or admin/ai roles)
// ==============================
router.get("/:id", auth, async (req, res, next) => {
  try {
    const trip = await TripRequest.findById(req.params.id).populate("hotels");
    if (!trip) return res.status(404).json({ message: "Not found" });

    // Allow owner, admin, or AI role
    if (
      !trip.user.equals(req.user._id) &&
      !["admin", "ai"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(trip);
  } catch (err) {
    next(err);
  }
});

// ==============================
// Update trip (owner, admin, or AI)
// ==============================
router.put("/:id", auth, async (req, res, next) => {
  try {
    const trip = await TripRequest.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Not found" });

    if (
      !trip.user.equals(req.user._id) &&
      !["admin", "ai"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (err) {
    next(err);
  }
});

// ==============================
// Delete trip (owner or admin)
// ==============================
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const trip = await TripRequest.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Not found" });

    if (!trip.user.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
