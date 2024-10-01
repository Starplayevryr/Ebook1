const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path to your User model

const authMiddleware = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // Check if the token exists
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token
        const decoded = jwt.verify(token, "default_secret_key"); // Use your JWT secret here

        // Find the user in the database
        const user = await User.findById(decoded._id); // Assuming the user ID is in the token payload
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Attach user information to the request object
        req.user = user;
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
