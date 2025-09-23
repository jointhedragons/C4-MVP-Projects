const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const errorHandler = require('./middleware/errorHandler');
const hotelRoutes = require('./routes/hotel');
const activityRoutes = require('./routes/activity');
const seedRoutes = require('./routes/seed');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api', seedRoutes); 

app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

module.exports = app;
