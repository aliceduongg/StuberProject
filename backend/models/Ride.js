const { Pickaxe } = require('lucide-react');
const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default: null},
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  destination: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  passengers: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
  fare: { type: Number, required: true },
});

module.exports = mongoose.model('Ride', rideSchema);