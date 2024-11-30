const express = require('express');
const Ride = require('../models/Ride');
const auth = require('../middleware/auth');
const {sendNotification} = require('../utils/notifications');

const router = express.Router();

// Create a new ride
router.post('/', auth, async (req, res) => {
  try {
    const { destination, pickupLocation, passengers, date, time, fare } = req.body;
    const newRide = new Ride({
      rider: req.user.id,
      destination,
      pickupLocation,
      passengers,
      date,
      time,
      fare,
    });

    const ride = await newRide.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    // res.status(500).send('Server error');
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all rides
router.get('/', auth, async (req, res) => {
  try {
    const rides = await Ride.find().sort({ date: -1 });
    // Transform the rides to include id
    const ridesWithId = rides.map(ride => ({
      ...ride.toObject(),
      id: ride._id
    }));
    res.json(ridesWithId);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update ride status
router.put('/:id/:action', auth, async (req, res) => {
  try {
    const { id, action } = req.params; // Get action from URL params
    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    if (req.user.role !== 'driver') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Validate action
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ msg: 'Invalid action' });
    }

    ride.status = action === 'accept' ? 'accepted' : 'rejected';
    ride.driver = req.user.id;

    const updatedRide = await ride.save();
    // Transform the response to match frontend expectations
    res.json({
      ...updatedRide.toObject(),
      id: updatedRide._id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;