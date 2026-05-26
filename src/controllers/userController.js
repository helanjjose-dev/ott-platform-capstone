const User = require('../models/userModel');

// ADD TO WATCHLIST
const addToWatchlist = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.user.id; // Pulled straight from the verified JWT token

        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required." });
        }

        // Find user and add the movieId to the watchlist array if it's not already there ($addToSet prevents duplicates)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { watchlist: movieId } },
            { new: true }
        ).populate('watchlist');

        return res.status(200).json({
            message: "Movie added to your watchlist successfully!",
            watchlist: updatedUser.watchlist
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error updating watchlist.", error: error.message });
    }
};

// GET USER WATCHLIST
const getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const userProfile = await User.findById(userId).populate('watchlist');
        if (!userProfile) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            username: userProfile.username,
            watchlist: userProfile.watchlist
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error fetching watchlist.", error: error.message });
    }
};

module.exports = { addToWatchlist, getWatchlist };