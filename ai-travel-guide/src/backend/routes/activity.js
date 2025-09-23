const router = require("express").Router();
const Activity = require("../models/Activity");
const escReg = require("../utils/escapeRegex");

// GET activities
router.get("/activities", async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      destination, 
      minPrice, 
      maxPrice, 
      minRating, 
      sortBy = "price", 
      order = "asc" 
    } = req.query;

    const q = {};
    if (destination) q.destination = new RegExp(escReg(destination), "i");
    if (minPrice || maxPrice) q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
    if (minRating) q.rating = { $gte: Number(minRating) };

    const total = await Activity.countDocuments(q);

    const sortOrder = order === "desc" ? -1 : 1;

    const activities = await Activity.find(q)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ 
      total, 
      count: activities.length, 
      page: Number(page), 
      limit: Number(limit), 
      activities 
    });
  } catch (err) {
    next(err);
  }
});

// Get By ID
router.get("/activities/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

// Create activity
router.post("/activities", async (req, res, next) => {
  try {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    next(err);
  }
});

// Update activity
router.put("/activities/:id", async (req, res, next) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedActivity) return res.status(404).json({ message: "Activity not found" });
    res.json(updatedActivity);
  } catch (err) {
    next(err);
  }
});

// Delete activity
router.delete("/activities/:id", async (req, res, next) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    if (!deletedActivity) return res.status(404).json({ message: "Activity not found" });
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
