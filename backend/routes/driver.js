const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: storage,
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
            if (!req.files || !req.files.driverLicense || !req.files.vehicleImage) {
                return res.status(400).json({ msg: 'Please upload all required files' });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            user.driverLicense = req.files.driverLicense[0].path;
            user.vehicleImage = req.files.vehicleImage[0].path;
            user.licensePlateNumber = req.body.licensePlate;

            await user.save();

            res.json({
                msg: 'Driver information updated successfully',
                user: {
                    driverLicense: user.driverLicense,
                    vehicleImage: user.vehicleImage,
                    licensePlateNumber: user.licensePlateNumber
                }
            });
        } catch (err) {
            console.error('Error in driver information upload:', err);
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    }
);

module.exports = router;