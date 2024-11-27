const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET Profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE Profile
router.put('/:userId', async (req, res) => {
  const { name, profilePicture, phoneNumber, preferredPayment, vehicleInfo } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { name, profilePicture, phoneNumber, preferredPayment, vehicleInfo },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;

