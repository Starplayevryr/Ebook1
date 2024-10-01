const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      unique: true,
      required: true
   },
   age: {
      type: Number,
      required: true
   },
   gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'], // Options for gender
      required: true // You can make it required if necessary
   },
   password: {
      type: String,
      required: true
   }
});

 
// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
