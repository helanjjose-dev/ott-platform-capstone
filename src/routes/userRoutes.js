const express = require('express');
const router = express.Router();
const { addToWatchlist, getWatchlist } = require('../controllers/userController');
const { verifyUser } = require('../middleware/authMiddleware');

// Both routes are protected—users must pass their individual token
router.post('/watchlist/add', verifyUser, addToWatchlist);
router.get('/watchlist', verifyUser, getWatchlist);

module.exports = router;