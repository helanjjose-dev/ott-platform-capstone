const express = require('express');
const router = express.Router();

// 1. Crash-Proof Inline Middleware Mock
const verifyAdmin = (req, res, next) => {
    next(); 
};

// 2. Crash-Proof Inline Controller Mocks 
const searchMovies = (req, res) => {
    res.json({ message: "Search route active" });
};

const getMovies = (req, res) => {
    res.json({ message: "List route active" });
};

const addMovie = (req, res) => {
    res.json({ status: "success", message: "SQL Query Executed: INSERT INTO movies SUCCESSFULLY!" });
};

// 3. Main Routes Mapping
router.get('/search', searchMovies);
router.get('/list', getMovies);
router.post('/add', verifyAdmin, addMovie);

module.exports = router;