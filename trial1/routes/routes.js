const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();
const FriendRequest = require('../models/friendrequest');


router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('name email'); // Fetch all users and select only the name and email fields
        res.json(users); // Send the user data
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, age, gender } = req.body;

        // Check for missing fields
        if (!email || !password || !name || !age || !gender) {
            return res.status(400).send({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "Email is already registered" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the user to the database
        const user = new User({ name, email, password: hashedPassword, age, gender });
        const result = await user.save();

        // Create a JWT token
        const token = jwt.sign({ _id: result._id }, "default_secret_key", { expiresIn: '1d' });

        // Set the JWT as a cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).send({ message: "Registration successful" });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).send({ message: "Validation error: " + error.message });
        }
        if (error.code === 11000) {
            return res.status(400).send({ message: "Email is already registered" });
        }
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ _id: user._id },  "default_secret_key", { expiresIn: '1d' });

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).send({ message: "Login successful", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get User Route
router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        if (!cookie) {
            return res.status(401).send({ message: "Unauthenticated" });
        }

        let claims;
        try {
            claims = jwt.verify(cookie, "default_secret_key");
        } catch (err) {
            console.error('JWT verification error:', err);
            return res.status(401).send({ message: "Unauthenticated or token expired" });
        }

        const user = await User.findById(claims._id);
        if (!user) {
            return res.status(401).send({ message: "Unauthenticated" });
        }

        const { password, ...data } = user.toJSON();
        res.send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send({ message: 'Logout successful' });
});

// Fetch User by ID Route
router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select('name email'); // Fetch user details, adjust fields as needed
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/users/:id', authMiddleware, async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, age, gender } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, password, age, gender }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User details updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// In your routes file
// In your routes file
router.put('/update-settings', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Ensure req.user is populated by your authMiddleware
    const { name, email, age, gender, password } = req.body;

    // Create an object for the updates
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (age) updates.age = age;
    if (gender) updates.gender = gender;

    // Check if a new password is provided
    if (password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            updates.password = hashedPassword; // Store the hashed password
        } catch (error) {
            return res.status(500).json({ message: "Error hashing password." });
        }
    }

    try {
        // Use findByIdAndUpdate instead of your custom updateSettings method
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User settings updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user settings:', error); // Log error for debugging
        res.status(400).json({ message: error.message });
    }
});
//friend-requests

  
module.exports = router;
