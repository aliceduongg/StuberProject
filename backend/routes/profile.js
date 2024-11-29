const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware for verifying token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// GET Profile with authentication
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    console.log("Fetching profile for user:", req.params.userId); // Debug log
    const user = await User.findById(req.params.userId).select(
      "firstName lastName email phoneNumber preferredPayment"
    );
    if (!user) {
      console.log("User not found for ID:", req.params.userId); // Debug log
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err); // Debug log
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE Profile with authentication
router.put('/:userId', authenticateToken, async (req, res) => {
  const { firstName, lastName, phoneNumber, preferredPayment } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { firstName, lastName, phoneNumber, preferredPayment },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;





