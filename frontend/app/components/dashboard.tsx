"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Car,
  MapPin,
  Users,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { RideBooking } from "./RideBooking";

type User = {
  email: string;
  role: "rider" | "driver";
};

type Ride = {
  id: string;
  destination: string;
  pickupLocation: string;
  passengers: number;
  date: string;
  time: string;
  status: "pending" | "accepted" | "rejected";
  fare: number;
};

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [acceptedRides, setAcceptedRides] = useState<Ride[]>([]);
  const router = useRouter();

  // Fetch rides booked by the rider or available rides for the driver
  const fetchRides = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      let response: Response | undefined;
  
      if (user?.role === "rider") {
        // Fetch rides specific to this rider
        response = await fetch("http://localhost:8080/api/rides/rider", {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
        });
      } else if (user?.role === "driver") {
        // Fetch all available rides (for drivers)
        response = await fetch("http://localhost:8080/api/rides/available", {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
        });
      }
  
      if (!response || !response.ok) {
        throw new Error("Failed to fetch rides");
      }
  
      const data = await response.json();
      setRides(data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  }, [user]);
  

  // Fetch accepted rides for the driver
  const fetchAcceptedRides = useCallback(async () => {
    try {
      if (user?.role !== "driver") return;

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8080/api/rides/driver/accepted", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch accepted rides");
      }

      const data = await response.json();
      setAcceptedRides(data);
    } catch (error) {
      console.error("Error fetching accepted rides:", error);
    }
  }, [user]);

  // Effect to load user information and fetch rides
  // Effect to load user information from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Effect to fetch rides after user information is set
  useEffect(() => {
    if (user) {
      if (user.role === "driver") {
        fetchRides(); // Fetch available rides for driver
        fetchAcceptedRides(); // Fetch accepted rides for driver
      } else if (user.role === "rider") {
        fetchRides(); // Fetch booked rides for rider
      }
    }
  }, [user, fetchRides, fetchAcceptedRides]);


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleBookingComplete = (newRide: Ride) => {
    fetchRides();
    setRides((prevRides) => [...prevRides, newRide]);
  };

  const handleRideAction = async (rideId: string, action: "accept" | "reject") => {
    try {
      console.log("Attempting to", action, "ride:", rideId);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:8080/api/rides/${rideId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} ride`);
      }

      const updatedRide = await response.json();

      // Update state accordingly
      setRides((prevRides) =>
        prevRides.filter((ride) => ride.id !== rideId)
      );

      if (action === "accept") {
        setAcceptedRides((prevAcceptedRides) => [...prevAcceptedRides, updatedRide]);
      }
    } catch (error) {
      console.error(`Error ${action}ing ride:`, error);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <Card className="bg-white bg-opacity-80 backdrop-blur-md border-pastel-blue">
        <CardHeader>
          <CardTitle className="text-pastel-blue">
            Welcome, {user.email}
          </CardTitle>
          <CardDescription>You are logged in as a {user.role}</CardDescription>
        </CardHeader>
        <CardContent>
          {user.role === "rider" && (
            <RideBooking onBookingComplete={handleBookingComplete} />
          )}
          {user.role === "driver" && (
            <div>
              <h3 className="text-lg font-semibold text-pastel-blue mb-4">
                Available Rides
              </h3>
              {rides
                .filter((ride) => ride.status === "pending")
                .map((ride) => (
                  <Card
                    key={`ride-card-${ride.id}`}
                    className="mt-4 bg-white bg-opacity-80 backdrop-blur-md border-pastel-yellow"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MapPin className="text-pastel-blue mr-2" />
                            <span className="font-semibold">
                              Destination: {ride.destination}
                            </span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <DollarSign className="mr-1" />
                            <span className="font-bold">{ride.fare}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="text-pastel-blue mr-2" />
                          <span>Passengers: {ride.passengers}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="text-pastel-blue mr-2" />
                          <span>Date: {ride.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="text-pastel-blue mr-2" />
                          <span>Time: {ride.time}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          onClick={() => handleRideAction(ride.id, "accept")}
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          <CheckCircle className="mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleRideAction(ride.id, "reject")}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <XCircle className="mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </CardFooter>
      </Card>
      {user.role === "driver" && acceptedRides.length > 0 && (
        <Card className="mt-4 bg-white bg-opacity-80 backdrop-blur-md border-pastel-blue">
          <CardHeader>
            <CardTitle className="text-pastel-blue">Accepted Rides</CardTitle>
          </CardHeader>
          <CardContent>
            {acceptedRides.map((ride) => (
              <div
                key={`accepted-ride-${ride.id}`}
                className="mb-2 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Car className="text-pastel-blue mr-2" />
                  <span>
                    From: {ride.pickupLocation} - To: {ride.destination} - Date:{" "}
                    {ride.date} - Time: {ride.time} - Fare: ${ride.fare}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
