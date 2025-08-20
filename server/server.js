// server/server.js

// require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customers');
const billRoutes = require('./routes/bills');
const cashiersRouter = require('./routes/cashiers');
const restaurantInfoRouter = require('./routes/restaurantInfo');
const menuRouter = require('./routes/menu');
const authRouter = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback-routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/cashiers', cashiersRouter); // Register the cashiers route
app.use('/api/restaurant-info', restaurantInfoRouter);
app.use('/api/menu', menuRouter);
app.use('/api/auth', authRouter);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
