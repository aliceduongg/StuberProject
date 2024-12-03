"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Autocomplete from "./Autocomplete";
import FareCalculator from "./FareCalculator";

interface RideBookingProps {
  onBookingComplete: (newRide: any) => void;
}

export function RideBooking({ onBookingComplete }: RideBookingProps) {
  const [destination, setDestination] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fare, setFare] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleBookRide = async () => {
    console.log({ destination, pickupLocation, passengers, date, time, fare }); 
    if (!destination || !pickupLocation || !passengers || !date || !time || fare <= 0) {
      setError("Please fill in all required fields and ensure fare is greater than 0");
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
        "Authorization": `Bearer ${token}`,
        "x-auth-token": token
      };

      const response = await fetch("http://localhost:8080/api/rides", {
        method: "POST",
        headers,
        body: JSON.stringify({
          destination,
          pickupLocation,
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
      setDestination("");
      setPickupLocation("");
      setPassengers(1);
      setDate("");
      setTime("");
      setFare(0);
      setError(null);
      
    } catch (error: any) {
      console.error("Error booking ride:", error);
      setError(error?.message || "Failed to book ride. Please try again.");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Book a Ride</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Pickup Location</label>
        <Autocomplete onSelect={(location) => setPickupLocation(location)} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Destination</label>
        <Autocomplete onSelect={(location) => setDestination(location)} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Number of Passengers</label>
        <Input
          type="number"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          min={1}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Time</label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Fare Suggestion</label>
        <FareCalculator pickupLocation={pickupLocation} destination={destination}/>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Fare ($)</label>
        <Input
          type="number"
          value={fare}
          onChange={(e) => setFare(Number(e.target.value))}
          min={1}
          step="0.10"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button onClick={handleBookRide} className="w-full">
        Book Ride
      </Button>
    </div>
  );
}


