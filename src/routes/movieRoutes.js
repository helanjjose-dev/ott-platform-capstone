const express = require('express');
const router = express.Router();
const { addMovie, getMovies, searchMovies } = require('../controllers/movieController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Public route - search through the catalog using query parameters
router.get('/search', searchMovies);

// Existing routes
router.get('/list', getMovies);
router.post('/add', verifyAdmin, addMovie);

module.exports = router;