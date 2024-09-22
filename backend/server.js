const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 4000;
const FRONTENDURL = process.env.FRONTENDURL;

const app = express();

// Middleware
app.use(cors({ origin: FRONTENDURL }));
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', userRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
