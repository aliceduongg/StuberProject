"use client";

import { useState } from "react";
import Autocomplete from "./Autocomplete";
import { Button } from "@/components/ui/button";

interface RideBookingProps {
  onBookingComplete?: () => void; // call function when booking is complete
}

export function RideBooking({ onBookingComplete }: RideBookingProps) {
  const [destination, setDestination] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBookRide = async () => {
    if (!destination || !pickupLocation) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // attach token to request
        },
        body: JSON.stringify({
          destination,
          pickupLocation,
          status: "pending",
        })
      });

      const data = await response.json(); // parse response body as JSON
      if (!response.ok) { 
        throw new Error(data.msg || "Failed to book ride");
      }

      if (onBookingComplete) { 
        onBookingComplete();
      }

      setDestination("");
      setPickupLocation("");
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to book ride");
    }
  };
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Book a Ride</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pickup Location</label>
        <Autocomplete 
          onSelect={(location) => setPickupLocation(location)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Destination</label>
        <Autocomplete 
          onSelect={(location) => setDestination(location)}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button 
        onClick={handleBookRide}
        className="w-full"
      >
        Book Ride
      </Button>
    </div>
  );
}
