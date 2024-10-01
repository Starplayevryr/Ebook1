const { Router } = require('express');
const { 
    createBlog, 
    getAllBlogs, 
    getBlogById, 
    updateBlog, 
    deleteBlog, 
    getUserBlogs 
} = require('../controllers/blogController');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware'); // Adjust if necessary
const multer = require('../middleware/upload'); // Adjust the path to your multer configuration

// Create a new blog post with image upload
router.post('/', authMiddleware, multer.single('image'), createBlog);

// Get all blog posts
router.get('/', getAllBlogs);

// Get all blogs for the authenticated user
router.get('/my-blogs', authMiddleware, getUserBlogs); // This route will use the new function

// Get a single blog post by ID
router.get('/:id', getBlogById);

// Update a blog post by ID
router.put('/:id', authMiddleware, updateBlog);

// Delete a blog post by ID
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
