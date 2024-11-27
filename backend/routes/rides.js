const express = require('express');
const Ride = require('../models/Ride');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new ride
router.post('/', auth, async (req, res) => {
  try {
    const { destination, passengers, date, time, fare } = req.body;
    const newRide = new Ride({
      rider: req.user.id,
      destination,
      passengers,
      date,
      time,
      fare,
    });

    const ride = await newRide.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all rides
router.get('/', auth, async (req, res) => {
  try {
    const rides = await Ride.find().sort({ date: -1 });
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update ride status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    if (req.user.role !== 'driver') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    ride.status = status;
    ride.driver = req.user.id;

    await ride.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;