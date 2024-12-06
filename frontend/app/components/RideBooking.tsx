"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Autocomplete from "./Autocomplete";
import { calculateDistance, calculateFare } from "../components/fareCalculator";

interface RideBookingProps {
  onBookingComplete: (newRide: any) => void;
}

interface Location {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export function RideBooking({ onBookingComplete }: RideBookingProps) {
  const [destination, setDestination] = useState<Location | null>(null);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fare, setFare] = useState<number>(0);
  const [suggestedFare, setSuggestedFare] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Suggest fare based on pickup, destination
  const handleSuggestFare = () => {
    if (!pickupLocation?.coordinates || !destination?.coordinates || !time) {
      setError("Please fill in pickup location, destination, and time first");
      return;
    }

    try {
      const distance = calculateDistance(
        pickupLocation.coordinates,
        destination.coordinates
      );
      const calculated = calculateFare(distance, time);
      setSuggestedFare(Number(calculated.toFixed(2)));
      setFare(Number(calculated.toFixed(2))); // Optionally set the fare input to the suggested value
      setError(null);
    } catch (error) {
      console.error("Fare calculation error:", error);
      setError("Error calculating fare suggestion");
    }
  };

  // Book a ride
  const handleBookRide = async () => {
    if (
      !destination?.address ||
      !pickupLocation?.address ||
      !passengers ||
      !date ||
      !time ||
      fare <= 0
    ) {
      setError(
        "Please fill in all required fields and ensure fare is greater than 0"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to book a ride");
        return;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-auth-token": token,
      };

      const response = await fetch("http://localhost:8080/api/rides", {
        method: "POST",
        headers,
        body: JSON.stringify({
          destination: destination.address,
          pickupLocation: pickupLocation.address,
          destinationCoordinates: destination.coordinates,
          pickupCoordinates: pickupLocation.coordinates,
          passengers,
          date,
          time,
          fare,
          status: "pending",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to book ride");
      }

      // Call the onBookingComplete callback with the new ride data
      onBookingComplete(data);

      // Reset form
      // Reset form
      setDestination(null);
      setPickupLocation(null);
      setPassengers(1);
      setDate("");
      setTime("");
      setFare(0);
      setSuggestedFare(null);
      setError(null);
    } catch (error: any) {
      console.error("Error booking ride:", error);
      setError(error?.message || "Failed to book ride. Please try again.");
    }
  };

  return (
    <div className="space-y-2 p-4 border rounded-lg bg-white text-black form-card">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pickup Location</label>
        <Autocomplete onSelect={(location) => setPickupLocation(location)} />
        {pickupLocation && (
          <p className="text-sm text-gray-600 mt-1">{pickupLocation.address}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium-">Destination</label>
        <Autocomplete onSelect={(location) => setDestination(location)} />
        {destination && (
          <p className="text-sm text-gray-600 mt-1">{destination.address}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Number of Passengers
        </label>
        <Input
          type="number"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          min={1}
          className="bg-white text-black border-pastel-blue"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white text-black border-pastel-blue"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Time</label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-white text-black border-pastel-blue"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Fare ($)</label>

        <Button
          onClick={handleSuggestFare}
          className="w-full mb-2 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700 text-white shadow-lg hover:bg-blue-800 hover:scale-105 transition-transform duration-300"
        >
          Get Fare Suggestion
        </Button>

        {suggestedFare !== null && (
          <div className="text-sm text-gray-600 mb-2">
            Suggested fare: ${suggestedFare}
          </div>
        )}

        <Input
          type="number"
          value={fare}
          onChange={(e) => setFare(Number(e.target.value))}
          min={1}
          step="0.01"
          placeholder="Enter fare amount"
          className="bg-white text-black border-pastel-blue"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-center w-full">
        <Button
          onClick={handleBookRide}
          className="w-auto px-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-300 via-green-500 shadow-lg hover:bg-blue-200 hover:border-green-500 hover:text-blue-100 hover:scale-105 transition-transform duration-300 flex items-center"
          style={{ color: "white" }}
        >
          Book Ride
        </Button>
      </div>
    </div>
  );
}
