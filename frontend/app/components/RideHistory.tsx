"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Car, MapPin, Calendar, Clock, DollarSign } from "lucide-react";

type HistoricalRide = {
  id: string;
  destination: string;
  pickupLocation: string;
  passengers: number;
  date: string;
  time: string;
  status: string;
  fare: number;
};

export default function RideHistoryPage() {
  const [historicalRides, setHistoricalRides] = useState<HistoricalRide[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/rides/history", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch ride history");

      const data = await response.json();
      setHistoricalRides(data);
    } catch (error) {
      console.error("Error fetching ride history:", error);
    }
  };

  return (
    <div className="space-y-4 overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-70 min-h-screen p-4">
      <Card className="border-pastel-blue">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-pastel-blue">
            Ride History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historicalRides.length > 0 ? (
            <div className="space-y-4">
              {historicalRides.map((ride) => (
                <Card
                  key={ride.id}
                  className="bg-white bg-opacity-80 backdrop-blur-md"
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Car className="text-pastel-blue mr-2" />
                          <span className="font-semibold">
                            Status: {ride.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center text-green-600">
                          <DollarSign className="mr-1" />
                          <span className="font-bold">{ride.fare}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="text-pastel-blue mr-2" />
                        <span>From: {ride.pickupLocation}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="text-pastel-blue mr-2" />
                        <span>To: {ride.destination}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="text-pastel-blue mr-2" />
                        <span>{ride.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="text-pastel-blue mr-2" />
                        <span>{ride.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No ride history available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}