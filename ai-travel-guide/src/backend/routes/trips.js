const router = require("express").Router();
const { auth, authorizeRoles } = require("../middleware/auth");
const TripRequest = require("../models/TripRequest");
const Hotel = require("../models/Hotel");
const Activity = require("../models/Activity");
const escReg = require("../utils/escapeRegex");

// ==============================
// Create trip — generate plan + save
// ==============================
router.post("/", auth, async (req, res, next) => {
  try {
    const { destination, start_date, end_date, budget, interests } = req.body;
    if (!destination || !start_date || !end_date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔹 TODO: replace naive planner with AI service call later

    const hotels = await Hotel.find({
      destination: new RegExp(escReg(destination), "i"),
    }).limit(3);

    const activities = await Activity.find({
      destination: new RegExp(escReg(destination), "i"),
    }).limit(20);

    // build itinerary by splitting days
    const sd = new Date(start_date);
    const ed = new Date(end_date);
    const days = Math.max(
      1,
      Math.ceil((ed - sd) / (1000 * 60 * 60 * 24)) + 1
    );

    const itinerary = [];
    for (let d = 0; d < days; d++) {
      const dayActivities = [];
      for (let i = 0; i < Math.min(3, activities.length); i++) {
        const idx = (d * 3 + i) % activities.length;
        const a = activities[idx];
        dayActivities.push({
          name: a.name,
          description: a.description,
          time: `${9 + i * 3}:00`,
        });
      }
      itinerary.push(dayActivities);
    }

    const trip = await TripRequest.create({
      user: req.user._id,
      destination,
      start_date: sd,
      end_date: ed,
      budget,
      interests,
      hotels: hotels.map((h) => h._id),
      itinerary,
    });

    const populated = await TripRequest.findById(trip._id).populate("hotels");
    res.status(201).json(populated);
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
