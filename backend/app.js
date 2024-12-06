const express = require('express');
const mongoose = require('mongoose');
const candidateRoutes = require('./routes/candidateRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors());  // Enable CORS for cross-origin requests
app.use(bodyParser.json());  // Parse incoming JSON requests

// Routes
app.use('/api/candidates', candidateRoutes);

// MongoDB connection
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);  // Exit the process with failure code
    }
};

connectToMongoDB();

// Export the app
module.exports = app;
