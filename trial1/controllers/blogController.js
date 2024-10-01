const Blog = require('../models/blog'); // Adjust the path if necessary

// Create a new blog post
const createBlog = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        // Validate input
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        // Ensure req.file exists and replace backslashes with forward slashes in the image path
        const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

        // Create a new blog post with the data
        const newBlog = new Blog({
            title,
            description,
            image: imagePath, // Save the corrected image path
            user: req.user._id, // Use the authenticated user's ID
            tags: tags ? JSON.parse(tags) : [], // Ensure tags are an array
            likes: 0,
            comments: []
        });

        // Save the new blog post to the database
        await newBlog.save();

        // Respond with success and the new blog data
        res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
    } catch (error) {
        console.error(error);
        // Respond with error if something went wrong
        res.status(500).json({ message: "Error creating blog.", error: error.message });
    }
};



// Get all blog posts
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('user', 'name') // Populate user name if needed
            .sort({ createdAt: -1 }); // Sort blogs by creation date (latest first)
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get a single blog post by ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('user', 'name');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all blogs for the authenticated user
const getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user._id }).populate('user', 'name');
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a blog post by ID
const updateBlog = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const updates = { title, description, tags };

        if (req.file) {
            updates.image = req.file.path; // Update the image if a new one is uploaded
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a blog post by ID
const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    getUserBlogs, // Export the new function
    updateBlog,
    deleteBlog,
};
