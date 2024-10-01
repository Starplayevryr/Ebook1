const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,  // Removes whitespace from the title
    },
    description: {
        type: String,
        required: true,
        trim: true,  // Removes whitespace from the description
    },
    image: {
        type: String,  // Can store the URL/path to the image
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Refers to the User model
        ref: 'User',
        required: true,
    },
    tags: {
        type: [String],
        default: []  // Array of strings to store tags for the blog post
    },
    likes: {
        type: Number,
        default: 0,  // Stores the number of likes for the post
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true }); // Automatically handles createdAt and updatedAt

module.exports = mongoose.model('Blog', blogSchema);
