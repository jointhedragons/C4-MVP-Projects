const router = require("express").Router();
const seedHotels = require("../seed/seed").seedHotels;
const seedActivities = require("../seed/seed").seedActivities;
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/seed", auth, authorizeRoles("admin"), async (req, res, next) => {
  const { hotels = 0, activities = 0 } = req.query;
  try {
    const seeded = {};
    if (hotels > 0) {
      const count = await seedHotels(hotels);
      seeded.hotels = count;
    }
    if (activities > 0) {
      const count = await seedActivities(activities);
      seeded.activities = count;
    }
    res.json({ message: "Seeding completed", seeded });
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;