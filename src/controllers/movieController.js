const Movie = require('../models/movieModel');

// ADD NEW MOVIE (Admin Only)
const addMovie = async (req, res) => {
    try {
        const { title, genre, duration } = req.body;

        if (!title || !genre || !duration) {
            return res.status(400).json({ message: "All fields (title, genre, duration) are required." });
        }

        const newMovie = await Movie.create({ title, genre, duration });

        return res.status(201).json({
            message: "Movie added to OTT catalog successfully!",
            movie: newMovie
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error while adding movie.", error: error.message });
    }
};

// GET ALL MOVIES (Public Route)
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        return res.status(200).json(movies);
    } catch (error) {
        return res.status(500).json({ message: "Server error while fetching movies.", error: error.message });
    }
};

module.exports = { addMovie, getMovies };
// SEARCH & FILTER MOVIES (Public Route)
const searchMovies = async (req, res) => {
    try {
        const { title, genre } = req.query;
        let queryObj = {};

        // If a title is provided, search using a case-insensitive regex pattern
        if (title) {
            queryObj.title = { $regex: title, $options: 'i' };
        }

        // If a genre is provided, match it directly (case-insensitive)
        if (genre) {
            queryObj.genre = { $regex: genre, $options: 'i' };
        }

        const results = await Movie.find(queryObj);
        
        return res.status(200).json({
            count: results.length,
            movies: results
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error during movie search.", error: error.message });
    }
};

// Make sure to add searchMovies to your exports layout at the very bottom!
module.exports = { addMovie, getMovies, searchMovies };