const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Update profile route
router.put('/profile', async (req, res) => {
  const { userId, firstName, lastName, phone } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    await user.save();

    res.json({ msg: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
