const router = require("express").Router();
const Hotel = require("../models/Hotel");
const escReg = require("../utils/escapeRegex");
const { auth, authorizeRoles } = require("../middleware/auth");

// ==============================
// GET hotels (all authenticated users)
// ==============================
router.get("/", auth, async (req, res, next) => {
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

    // Build filter
    const q = {};
    if (destination) q.destination = new RegExp(escReg(destination), "i");
    if (minPrice || maxPrice) q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
    if (minRating) q.rating = { $gte: Number(minRating) };

    // Count total before pagination
    const total = await Hotel.countDocuments(q);

    // Sorting
    const sortOrder = order === "desc" ? -1 : 1;

    const hotels = await Hotel.find(q)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ 
      total, 
      count: hotels.length, 
      page: Number(page), 
      limit: Number(limit), 
      data: hotels 
    });
  } catch (err) {
    next(err);
  }
});

// ==============================
// GET By ID (all authenticated users)
// ==============================
router.get("/:id", auth, async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
});

// ==============================
// CREATE hotel (admin + ai roles)
// ==============================
router.post("/", auth, authorizeRoles("admin", "ai"), async (req, res, next) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    next(err);
  }
});

// ==============================
// UPDATE hotel (admin + ai roles)
// ==============================
router.put("/:id", auth, authorizeRoles("admin", "ai"), async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedHotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(updatedHotel);
  } catch (err) {
    next(err);
  }
});

// ==============================
// DELETE hotel (only admin)
// ==============================
router.delete("/:id", auth, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ message: "Hotel deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
