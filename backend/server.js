const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
dotenv.config();


const PORT = process.env.PORT || 4000;
const FRONTENDURL = process.env.FRONTENDURL||"http://localhost:3000";
const app = express();
app.use(cors({ origin: FRONTENDURL }));
app.use(express.json());

connectDB();

//this is starting of backend api
app.use('/api/auth', userRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
