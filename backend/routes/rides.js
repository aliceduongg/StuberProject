const express = require('express');
const Ride = require('../models/Ride');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { sendRideNotification, sendRideAcceptedNotification } = require('../utils/emailService');

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

    const ride = await newRide.save(); // Save the new ride to the database

    // Find and Send notification to all drivers
    const drivers = await User.find({
      role: 'driver',
      notificationsEnabled: true
    });

    // Send notification to all drivers
    for (const driver of drivers) {
      await sendRideNotification(driver.email, {
        pickupLocation,
        destination,
        date,
        time,
        fare,
        passengers,
      });
    }

    res.json(ride); // Send the ride object as response
  } catch (err) {
    console.error(err.message);
    // res.status(500).send('Server error');
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all rides
router.get('/', auth, async (req, res) => {
  try {
    let rides;
    if (req.user.role === 'rider') {
      // Riders only see their own rides
      rides = await Ride.find({ rider: req.user.id }).sort({ date: -1 });
    } else if (req.user.role === 'driver') {
      // Drivers see all pending rides and rides they've accepted/rejected
      rides = await Ride.find({
        $or: [
          { status: 'pending' },
          { driver: req.user.id }
        ]
      }).sort({ date: -1 });
    }

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


    // Only proceed with notification if the action is 'accept'
    if (action === 'accept') {
      ride.status = 'accepted';
      ride.driver = req.user.id;

      //Get the rider's info
      const rider = await User.findById(ride.rider);
      const driver = await User.findById(req.user.id);

      // Send notification to the rider
      await sendRideAcceptedNotification(rider.email, {
        pickupLocation: ride.pickupLocation,
        destination: ride.destination,
        date: ride.date,
        time: ride.time,
        passengers: ride.passengers,
        fare: ride.fare
      }, `${driver.firstName} ${driver.lastName}`);
    } else {
      ride.status = 'rejected';
      ride.driver = req.user.id;
    }

    // ride.status = action === 'accept' ? 'accepted' : 'rejected';
    // ride.driver = req.user.id;

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

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }
    
    if (ride.rider.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to cancel this ride' });
    }

    // Update ride status to cancelled
    ride.status = 'cancelled';
    const updatedRide = await ride.save();

    // Transform the ride to include id before sending response
    const rideWithId = {
      ...updatedRide.toObject(),
      id: updatedRide._id
    };

    res.json(rideWithId);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;