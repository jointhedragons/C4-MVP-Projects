const connectDB = require('../config/db');
const Hotel = require('../models/Hotel');
const Activity = require('../models/Activity');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = (deleteAll = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (deleteAll) {
        await User.deleteMany({ role: 'admin' });
      }

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'P@$$w0rd';
      
      const existingAdmin = await User.find({ email: adminEmail });
      if (existingAdmin.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminPassword, salt);
        const adminUser = new User({ name: 'Admin', email: adminEmail, passwordHash, role: 'admin' });
        await adminUser.save();
        console.log(`Admin user created with email: ${adminEmail} and password: ${adminPassword}`);
        resolve(1);
      } else {
        console.log('Admin user already exists');
        resolve(0);
      }
    } catch (err) {
      reject(err);
    }
  });
};

async function seedHotels(deleteAll = true) {
  await connectDB(process.env.MONGO_URI || "mongodb+srv://yly741689:nodejs_1234@cluster0.8sgu0j1.mongodb.net/");

  if (deleteAll) {
    await Hotel.deleteMany({});
  }

  const hotels = [
    { name: 'Central Plaza Hotel', destination: 'Cairo', price_per_night: 55, rating: 4.1, location: 'Downtown' },
    { name: 'Nile View Inn', destination: 'Cairo', price_per_night: 85, rating: 4.6, location: 'Zamalek' },
    { name: 'Budget Stay', destination: 'Alexandria', price_per_night: 30, rating: 3.9, location: 'Corniche' },
    { name: 'Mediterranean Breeze Hotel', destination: 'Alexandria', price_per_night: 70, rating: 4.3, location: 'Stanley' },
    { name: 'Pyramids Horizon Resort', destination: 'Giza', price_per_night: 95, rating: 4.7, location: 'Pyramids Area' },
    { name: 'Luxor Palace Hotel', destination: 'Luxor', price_per_night: 60, rating: 4.2, location: 'Nile Corniche' },
    { name: 'Aswan Riverside Lodge', destination: 'Aswan', price_per_night: 50, rating: 4.0, location: 'Nile View' },
    { name: 'Desert Star Hotel', destination: 'Siwa Oasis', price_per_night: 45, rating: 4.4, location: 'Siwa Town Center' },
    { name: 'Red Sea Paradise', destination: 'Hurghada', price_per_night: 110, rating: 4.8, location: 'Beachfront' },
    { name: 'Sharm El Sheikh Retreat', destination: 'Sharm El Sheikh', price_per_night: 120, rating: 4.9, location: 'Naama Bay' },
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
    { name: 'Museum Visit', destination: 'Cairo', description: 'Explore historical artifacts', duration_minutes: 120, tags: ['history', 'museum'], rating: 4.5 },
    { name: 'Nile Boat Ride', destination: 'Cairo', description: 'Relaxing boat trip on the Nile', duration_minutes: 90, tags: ['relax', 'sightseeing'], rating: 4.7 },
    { name: 'Citadel Tour', destination: 'Cairo', description: 'Visit the citadel and mosques', duration_minutes: 180, tags: ['history', 'sightseeing'], rating: 4.4 },
    { name: 'Library of Alexandria Tour', destination: 'Alexandria', description: 'Discover the modern Library of Alexandria', duration_minutes: 150, tags: ['culture', 'library'], rating: 4.6 },
    { name: 'Stanley Bridge Walk', destination: 'Alexandria', description: 'Evening walk along the famous bridge and Corniche', duration_minutes: 60, tags: ['relax', 'sightseeing'], rating: 4.3 },
    { name: 'Pyramids of Giza Visit', destination: 'Giza', description: 'See the Great Pyramids and Sphinx', duration_minutes: 240, tags: ['history', 'landmark'], rating: 4.9 },
    { name: 'Valley of the Kings Tour', destination: 'Luxor', description: 'Explore the tombs of the pharaohs', duration_minutes: 210, tags: ['history', 'archaeology'], rating: 4.8 },
    { name: 'Felucca Ride', destination: 'Aswan', description: 'Sail a traditional boat on the Nile at sunset', duration_minutes: 75, tags: ['relax', 'culture'], rating: 4.7 },
    { name: 'Siwa Oasis Safari', destination: 'Siwa Oasis', description: 'Jeep tour across the desert and salt lakes', duration_minutes: 300, tags: ['adventure', 'nature'], rating: 4.6 },
    { name: 'Snorkeling in the Red Sea', destination: 'Hurghada', description: 'Snorkel in crystal-clear waters full of coral reefs', duration_minutes: 180, tags: ['adventure', 'water'], rating: 4.9 },
  ];

  await Activity.insertMany(activities);

  return await Activity.countDocuments();
}

// Run both if executed directly
async function seedAll(deleteAll = true) {
  seeded_hotels = await seedHotels(deleteAll);
  seeded_activities = await seedActivities(deleteAll);
  await seedAdmin(deleteAll);

  console.log(`Seeded ${seeded_hotels} hotels and ${seeded_activities} activities.`);
  process.exit(0);
}

module.exports = { seedHotels, seedActivities, seedAdmin, seedAll };

// For direct run
if (require.main === module) {
  seedAll();
}
