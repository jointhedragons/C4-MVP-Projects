const connectDB = require('../config/db');
const Hotel = require('../models/Hotel');
const Activity = require('../models/Activity');

async function seedHotels(deleteAll = true) {
  await connectDB(process.env.MONGO_URI || "mongodb+srv://yly741689:nodejs_1234@cluster0.8sgu0j1.mongodb.net/");

  if (deleteAll) {
    await Hotel.deleteMany({});
  }

  const hotels = [
    { name: 'Central Plaza Hotel', destination: 'Cairo', price_per_night: 55, rating: 4.1, location: 'DownTown' },
    { name: 'Nile View Inn', destination: 'Cairo', price_per_night: 85, rating: 4.6, location: 'Zamalek' },
    { name: 'Budget Stay', destination: 'Alexandria', price_per_night: 30, rating: 3.9, location: 'Corniche' },
    // add more...
  ];

  await Hotel.insertMany(hotels);

  return await Hotel.countDocuments();
}

async function seedActivities(deleteAll = true) {
  await connectDB(process.env.MONGO_URI || "mongodb+srv://yly741689:nodejs_1234@cluster0.8sgu0j1.mongodb.net/");

  if (deleteAll) {
    await Activity.deleteMany({});
  }

  const activities = [
    { name: 'Museum Visit', destination: 'Cairo', description: 'Explore historical artifacts', duration_minutes: 120, tags: ['history','museum'], rating: 4.5 },
    { name: 'Nile Boat Ride', destination: 'Cairo', description: 'Relaxing boat trip on the Nile', duration_minutes: 90, tags: ['relax','sightseeing'], rating: 4.7 },
    { name: 'Citadel Tour', destination: 'Cairo', description: 'Visit the citadel and mosques', duration_minutes: 180, tags: ['history','sightseeing'], rating: 4.4 },
    // add more...
  ];

  await Activity.insertMany(activities);

  return await Activity.countDocuments();
}

// Run both if executed directly
async function seedAll(deleteAll = true) {
  seeded_hotels = await seedHotels(deleteAll);
  seeded_activities = await seedActivities(deleteAll);

  console.log(`Seeded ${seeded_hotels} hotels and ${seeded_activities} activities.`);
  process.exit(0);
}

module.exports = { seedHotels, seedActivities, seedAll };

// For direct run
if (require.main === module) {
  seedAll();
}
