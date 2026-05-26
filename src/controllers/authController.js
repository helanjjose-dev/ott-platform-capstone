const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt

// REGISTER USER (With Password Hashing)
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: "Username, email, and password are required." });
        }

        const cleanEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered!" });
        }

        // --- ENCRYPTION STEP ---
        // Generates a secure salt and hashes the plain text password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the user with the hashed password instead
        const newUser = await User.create({ 
            username, 
            email: cleanEmail, 
            password: hashedPassword, 
            role: role || 'user' 
        });

        return res.status(201).json({
            message: "User registered successfully with secure encryption!",
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "Server error during registration.", error: error.message });
    }
};

// LOGIN USER (With Encrypted Comparison)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const cleanEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // --- DECRYPTION/COMPARISON STEP ---
        // Compares incoming plain text with the hashed database string safely
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[AUTH] Login failed: Password mismatch for ${cleanEmail}`);
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'superSecretKey123',
            { expiresIn: '1d' }
        );

        console.log(`[AUTH] Success: Secure login completed for ${cleanEmail}.`);
        return res.status(200).json({
            message: "Login successful!",
            token: token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error during login.", error: error.message });
    }
};

module.exports = { register, login };