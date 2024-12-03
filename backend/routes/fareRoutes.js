const express = require('express');
const router = express.Router();
const haversineDistance = require('haversine-distance');
const geocoder = require('geocoder');

// Fare calculation constants
const FARE_CONFIG = {
  BASE_FARE: 5.00,
  PER_MILE_RATE: 0.50,
  NIGHT_SURCHARGE_RATE: 0.25,
  NIGHT_START_HOUR: 22, // 10 PM
  NIGHT_END_HOUR: 6,    // 6 AM
};

// Helper function to calculate distance between addresses
function calculateDistanceBetweenAddresses(origin, destination) {
  return new Promise((resolve, reject) => {
    // Geocode origin address
    geocoder.geocode(origin, async (err1, originData) => {
      if (err1 || !originData || !originData[0]) {
        return reject(new Error('Could not geocode origin address'));
      }

      // Geocode destination address
      geocoder.geocode(destination, (err2, destData) => {
        if (err2 || !destData || !destData[0]) {
          return reject(new Error('Could not geocode destination address'));
        }

        // Calculate distance using haversine formula
        const originCoords = {
          latitude: originData[0].latitude,
          longitude: originData[0].longitude
        };

        const destCoords = {
          latitude: destData[0].latitude,
          longitude: destData[0].longitude
        };

        // Calculate distance in miles
        const distanceInMeters = haversineDistance(originCoords, destCoords);
        const distanceInMiles = (distanceInMeters / 1609.344).toFixed(2);

        resolve(parseFloat(distanceInMiles));
      });
    });
  });
}

// Helper function to check if ride is during night/early morning
function isNightRide(rideTime) {
  const time = new Date(rideTime);
  const hours = time.getHours();
  
  return (hours >= FARE_CONFIG.NIGHT_START_HOUR && hours <= 24) || 
         (hours >= 0 && hours <= FARE_CONFIG.NIGHT_END_HOUR);
}

// Route to calculate dynamic fare
router.post('/calculate-fare', async (req, res) => {
  try {
    const { pickupLocation, destination, rideTime } = req.body;

    // Calculate route distance
    const distance = await calculateDistanceBetweenAddresses(pickupLocation, destination);

    // Calculate base fare components
    const baseFare = FARE_CONFIG.BASE_FARE;
    const distanceFare = distance * FARE_CONFIG.PER_MILE_RATE;
    
    // Calculate night/early morning surcharge
    const isNight = isNightRide(rideTime);
    const surcharge = isNight 
      ? (distance * FARE_CONFIG.NIGHT_SURCHARGE_RATE) 
      : 0;

    // Total fare calculation
    const totalFare = baseFare + distanceFare + surcharge;

    res.json({
      baseFare,
      distance,
      distanceFare,
      nightSurcharge: surcharge,
      totalFare: Number(totalFare.toFixed(2)), // Round to 2 decimal places
      isNightRide: isNight
    });

  } catch (error) {
    console.error('Fare calculation error:', error);
    res.status(500).json({ 
      msg: 'Error calculating fare', 
      error: error.message 
    });
  }
});

module.exports = router;