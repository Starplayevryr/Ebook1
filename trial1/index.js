const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/routes'); // Adjust this path if necessary
const blogRoutes = require('./routes/blog');
const path = require('path'); // Import the path module
const friends = require('./routes/friends');
const http = require('http'); // Import http module
const socketIo = require('socket.io'); // Import socket.io

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server); // Initialize socket.io with the server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serves static files from 'public'
app.use(cookieParser());

// Serve static files from the 'uploads' directory using path.join
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ebbokusers', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Mounting the routes
app.use('/api', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/friend-requests', friends);

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for incoming messages
    socket.on('sendMessage', (message) => {
        // Broadcast the message to all clients
        io.emit('receiveMessage', message);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server is running on port ${PORT}`);
});
