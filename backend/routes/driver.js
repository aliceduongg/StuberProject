const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

router.post('/information',
    auth,
    upload.fields([
        { name: 'driverLicense', maxCount: 1 },
        { name: 'vehicleImage', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            // Handle file uploads and update user record
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // Update user with driver information
            user.driverLicense = req.files.driverLicense[0].path;
            user.vehicleImage = req.files.vehicleImage[0].path;
            user.licensePlateNumber = req.body.licensePlate;

            await user.save();

            res.json({ msg: 'Driver information updated successfully' });
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

module.exports = router;