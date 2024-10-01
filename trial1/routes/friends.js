const { Router } = require('express');
const FriendRequest = require('../models/friendrequest'); // Import the FriendRequest model
const authMiddleware = require('../middleware/authMiddleware'); // Import your authentication middleware
const User = require('../models/user'); // Import the User model
const router = Router();

// Send a friend request
router.post('/send-request', authMiddleware, async (req, res) => {
    const { receiverId } = req.body; // Get receiverId from request body
    const senderId = req.user.id; // Get the sender's ID from the authenticated user

    try {
        // Check if a request already exists
        const existingRequest = await FriendRequest.findOne({ senderId, receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent.' });
        }

        // Create a new friend request
        const newRequest = new FriendRequest({ senderId, receiverId });
        await newRequest.save();

        res.status(201).json({ message: 'Friend request sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Accept a friend request
router.post('/accept-request/:id', authMiddleware, async (req, res) => {
    const requestId = req.params.id; // Get the friend request ID from the URL
    const receiverId = req.user.id; // Get the receiver's ID from the authenticated user

    try {
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest || friendRequest.receiverId.toString() !== receiverId) {
            return res.status(404).json({ message: 'Friend request not found or invalid.' });
        }

        // Update the request status to accepted
        friendRequest.status = 'accepted';
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request accepted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Reject a friend request
router.post('/reject-request/:id', authMiddleware, async (req, res) => {
    const requestId = req.params.id; // Get the friend request ID from the URL
    const receiverId = req.user.id; // Get the receiver's ID from the authenticated user

    try {
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest || friendRequest.receiverId.toString() !== receiverId) {
            return res.status(404).json({ message: 'Friend request not found or invalid.' });
        }

        // Update the request status to rejected
        friendRequest.status = 'rejected';
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request rejected.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get all received friend requests for the logged-in user
router.get('/requests', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Get the user's ID from the authenticated user

    try {
        const requests = await FriendRequest.find({ receiverId: userId }).populate('senderId', 'name email'); // Populate senderId to get user details
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get all sent friend requests for the logged-in user
router.get('/sent-requests', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Get the user's ID from the authenticated user

    try {
        const sentRequests = await FriendRequest.find({ senderId: userId }).populate('receiverId', 'name email'); // Populate receiverId to get user details
        res.status(200).json(sentRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Cancel a sent friend request
router.delete('/cancel-request/:id', authMiddleware, async (req, res) => {
    const requestId = req.params.id; // Get the friend request ID from the URL
    const userId = req.user.id; // Get the user's ID from the authenticated user

    try {
        const friendRequest = await FriendRequest.findOneAndDelete({ _id: requestId, senderId: userId });
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found or already canceled.' });
        }

        res.status(200).json({ message: 'Friend request canceled successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router; // Export the router
