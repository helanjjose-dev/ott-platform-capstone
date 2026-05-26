const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// 1. ALL ROUTE IMPORTS (Keep them together at the top)
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes'); // Moved up here!

const app = express();
app.use(express.json());

// 2. MIDDLEWARE & ROUTE SETUP
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes); // Now it knows exactly what userRoutes is!

app.get('/health', (req, res) => {
    res.status(200).json({ status: "Success", message: "OTT Platform API backend is running smoothly!" });
});

// 3. SERVER CONFIGURATION
const PORT = process.env.PORT || 3000;
const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/ott-capstone';

console.log("[SERVER] Attempting connection to local Windows MongoDB...");

// 4. DATABASE CONNECTION & START
mongoose.connect(LOCAL_MONGO_URI)
    .then(() => {
        console.log(`[DATABASE] Success: Connected locally to Windows MongoDB successfully!`);
        app.listen(PORT, () => {
            console.log(`[SERVER] Success: Server listening locally on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`[DATABASE] Error: Local connection failed!`, error.message);
    });