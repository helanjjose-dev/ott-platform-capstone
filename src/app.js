const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. ALL ROUTE IMPORTS (Keep them together at the top)
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes'); // Moved up here!

const app = express();
app.use(cors());
app.use(express.json());

// 2. MIDDLEWARE & ROUTE SETUP
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes); // Now it knows exactly what userRoutes is!

app.get('/health', (req, res) => {
    res.status(200).json({ status: "Success", message: "OTT Platform API backend is running smoothly!" });
});
// POST route to add a new movie to MongoDB
app.post('/api/movies/add', async (req, res) => {
  try {
    const { title, genre, duration, posterUrl, backdropUrl, rating, year, description } = req.body;
    
    // Simple validation to ensure required fields are present
    if (!title || !genre || !duration) {
      return res.status(400).json({ message: "Title, genre, and duration are required." });
    }

    // Replace 'Movie' with whatever you named your Mongoose Model variable
    const newMovie = new Movie({
      title,
      genre,
      duration: Number(duration),
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      backdropUrl: backdropUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200',
      rating: rating || 'PG-13',
      year: year || new Date().getFullYear().toString(),
      description: description || 'No summary overview currently available for this title asset catalog item.'
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    console.error("Error saving movie:", err);
    res.status(500).json({ message: "Internal Server Error mapping asset to database." });
  }
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