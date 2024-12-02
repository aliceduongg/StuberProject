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
  firstName: string;
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
  const [user, setUser] = useState<any>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const router = useRouter();

  const fetchRides = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8080/api/rides", {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rides");
      }

      const data = await response.json();
      setRides(data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Token:", localStorage.getItem("token"));
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }

    fetchRides();
  }, [router, fetchRides]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleBookingComplete = (newRide: Ride) => {
    fetchRides();
    setRides((prevRides) => [...prevRides, newRide]);
  };

  const handleRideAction = async (
    rideId: string,
    action: "accept" | "reject"
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:8080/api/rides/${rideId}/${action}`,
        {
          method: "PUT",
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} ride`);
      }

      const updatedRide = await response.json();
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.id === updatedRide.id ? updatedRide : ride
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing ride:`, error);
      if (error instanceof Error && error.message.includes("401")) {
        router.push("/login");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <Card className="bg-white bg-opacity-80 backdrop-blur-md border-pastel-blue">
        <CardHeader>
          <CardTitle className="text-pastel-blue">
            Welcome, {user.firstName}
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
      {user.role === "rider" && rides.length > 0 && (
        <Card className="mt-4 bg-white bg-opacity-80 backdrop-blur-md border-pastel-blue">
          <CardHeader>
            <CardTitle className="text-pastel-blue">Your Rides</CardTitle>
          </CardHeader>
          <CardContent>
            {rides
              .filter((ride) => ride.status !== "rejected")
              .map((ride, index) => (
                <div
                  key={
                    ride.id
                      ? `ride-list-${ride.id}`
                      : `ride-list-fallback-${index}`
                  }
                  className="mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Car className="text-pastel-blue mr-2" />
                    <span>
                      From: {ride.pickupLocation} - To: {ride.destination} -
                      Date: {ride.date} - Time: {ride.time} -
                      <span className="ml-2">
                        <DollarSign className="inline h-4 w-4 text-pastel-blue" />
                        {ride.fare}
                      </span>
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      ride.status === "accepted"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
