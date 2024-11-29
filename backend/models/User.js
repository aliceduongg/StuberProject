const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true }, 
  lastName: { type: String, required: true },  
  role: { type: String, enum: ['rider', 'driver'], required: true },
  profilePicture: { type: String, default: '' },
  phoneNumber: { type: String, required: true },
  preferredPayment: { type: String, enum: ['Credit Card', 'PayPal', 'Cash'], default: 'Cash' },
  vehicleInfo: {
    make: { type: String, default: '' },
    model: { type: String, default: '' },
    year: { type: String, default: '' },
    licensePlate: { type: String, default: '' },
  },
});

module.exports = mongoose.model('User', userSchema);
