const express = require('express');
const axios = require('axios'); 
const router = express.Router();
require('dotenv').config();

// Fare calculation constants
const FARE_CONFIG = {
  BASE_FARE: 5.00,
  PER_MILE_RATE: 0.50,
  NIGHT_SURCHARGE_RATE: 0.25,
  NIGHT_START_HOUR: 22, // 10 PM
  NIGHT_END_HOUR: 6,    // 5 AM
};

// Helper function to calculate distance using routing API
async function calculateRouteDistance(origin, destination) {
  try {
    // 
    const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.OPENROUTESERVICE_API_KEY}&start=${origin}&end=${destination}`,
        {
          params: {
            key: process.env.OPENROUTESERVICE_API_KEY,
          }
        }
      );
      
      

    // Assuming the API returns distance in miles
    return response.data.routes[0].legs[0].distance;
  } catch (error) {
    console.error('Distance calculation error:', error);
    throw new Error('Unable to calculate route distance');
  }
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
    const distance = await calculateRouteDistance(pickupLocation, destination);

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