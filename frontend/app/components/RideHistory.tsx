"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Car, MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

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
  const router = useRouter();

  // format date and time
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "MM/dd/yyyy");
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  // Memoize fetchRideHistory to prevent infinite loop
  const fetchRideHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

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
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchRideHistory();
  }, [router, fetchRideHistory]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="space-y-4 overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700 min-h-screen p-6">
      <Card className="border-2 border-blue-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800">
          <CardTitle className="text-3xl font-bold text-white flex items-center">
            <Clock className="mr-3 h-8 w-8" />
            Ride History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {historicalRides.length > 0 ? (
            <div className="space-y-6">
              {historicalRides.map((ride) => (
                <Card
                  key={ride.id}
                  className="transform transition-all duration-300 hover:scale-[1.02] border-l-4 hover:shadow-xl"
                  style={{
                    borderLeftColor:
                      ride.status.toLowerCase() === "completed"
                        ? "#10B981"
                        : ride.status.toLowerCase() === "cancelled"
                        ? "#EF4444"
                        : ride.status.toLowerCase() === "pending"
                        ? "#F59E0B"
                        : "#6B7280",
                  }}
                >
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      {/* Status and Fare Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Car className="text-blue-600 mr-2 h-5 w-5" />
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              ride.status.toLowerCase() === "completed"
                                ? "bg-green-100 text-green-800"
                                : ride.status.toLowerCase() === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {ride.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
                          <DollarSign className="text-green-600 mr-1 h-5 w-5" />
                          <span className="font-bold text-green-700">
                            ${ride.fare}
                          </span>
                        </div>
                      </div>

                      {/* Location Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <MapPin className="text-blue-600 h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">From</p>
                            <p className="font-medium text-gray-900">
                              {ride.pickupLocation}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <MapPin className="text-purple-600 h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">To</p>
                            <p className="font-medium text-gray-900">
                              {ride.destination}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-center justify-between pt-2 text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="text-blue-600 mr-2 h-4 w-4" />
                          <span className="text-sm">{formatDate(ride.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="text-blue-600 mr-2 h-4 w-4" />
                          <span className="text-sm">{formatTime(ride.time)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
              <Car className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-lg font-medium">No ride history available</p>
              <p className="text-sm text-gray-400">
                Your completed rides will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
