const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['rider', 'driver'], required: true },
  notificationsEnabled: { type: Boolean, default: true },
  driverLicense: {
    type: String,
    required: false
  },
  vehicleImage: {
    type: String,
    required: false
  },
  licensePlateNumber: {
    type: String,
    required: false
  },
  isDriverVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);