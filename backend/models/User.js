// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },  // Changed from name
  lastName: { type: String, required: true },   // Added lastName
  role: { type: String, enum: ['rider', 'driver'], required: true },
});

module.exports = mongoose.model('User', userSchema);