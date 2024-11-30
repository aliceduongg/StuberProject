// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true }, // Updated to be required
  role: { type: String, enum: ['rider', 'driver'], required: true },
  notificationsEnabled: { type: Boolean, default: true },
  // New fields for drivers
  driverLicense: { type: String }, // File path/URL
  vehicleImage: { type: String }, // File path/URL
  licensePlateNumber: { type: String },
  isDriverVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);