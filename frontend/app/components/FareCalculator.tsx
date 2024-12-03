import React, { useState } from 'react';
import axios from 'axios';

interface FareCalculatorProps {
  pickupLocation: string;
  destination: string;
}

const FareCalculator: React.FC<FareCalculatorProps> = ({ pickupLocation, destination }) => {
  const [fareDetails, setFareDetails] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateFare = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/rides/calculate-fare', {
        pickupLocation,
        destination,
        rideTime: new Date().toISOString(),
      });

      setFareDetails(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Could not calculate fare');
      setFareDetails(null);
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={calculateFare} className="px-4 py-2 bg-blue-500 text-white rounded">
        Calculate Fare
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fareDetails && (
        <div>
          <h3>Fare Breakdown</h3>
          <p>Base Fare: ${fareDetails.baseFare.toFixed(2)}</p>
          <p>Distance: {fareDetails.distance.toFixed(2)} miles</p>
          <p>Distance Fare: ${fareDetails.distanceFare.toFixed(2)}</p>
          {fareDetails.isNightRide && (
            <p>Night Surcharge: ${fareDetails.nightSurcharge.toFixed(2)}</p>
          )}
          <p>
            <strong>Total Fare: ${fareDetails.totalFare.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default FareCalculator;
