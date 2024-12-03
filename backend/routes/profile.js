const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Return complete user object including license plate
    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      licensePlateNumber: user.licensePlateNumber
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Update profile route
router.put('/', async (req, res) => {
  const { userId, firstName, lastName, phone, licensePlateNumber} = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    if (licensePlateNumber) {
      user.licensePlateNumber = licensePlateNumber;
    }
    await user.save();

    res.json({ msg: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
