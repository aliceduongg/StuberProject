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
  status: "pending" | "accepted" | "rejected" | "cancelled";
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
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed user:", parsedUser); //Debug line
      setUser(parsedUser);
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

  const handleCancelRide = async (rideId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:8080/api/rides/${rideId}/cancel`,
        {
          method: "PUT",
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.msg || "Failed to cancel ride");
        return;
      }

      const updatedRide = await response.json();

      // Update the rides state immediately
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.id === updatedRide.id ? { ...ride, status: "cancelled" } : ride
        )
      );

      // Refresh the rides list
      await fetchRides();
    } catch (error) {
      console.error("Error cancelling ride:", error);
      alert("Failed to cancel ride. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-4 overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-70">
      <Card className=" border-pastel-blue overflow-hidden bg-gradient-to-br from-purple-300 via-blue-500 to-purple-700">
        <CardHeader>
          <CardTitle className="overflow-hidden text-black text-2xl text-[32px] font-bold">
            Welcome, {" "}<span className="text-blue-600 ">{user.email}</span> 

          </CardTitle>
          <CardDescription className="" style={{ color:'black', fontSize:'17px'}}>
            You are logged in as a{" "}
            <span className="text-blue-600">{user.role}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Rider View - Show Booking Form */}
          {user.role === "rider" && (
            <RideBooking onBookingComplete={handleBookingComplete} />
          )}

          {/* Driver View - Show Available and Accepted Rides */}
          {user.role === "driver" && (
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">
                Available Rides :
              </h3>
              {rides
                .filter((ride) => ride.status === "pending")
                .map((ride) => (
                  <Card
                    key={`ride-card-${ride.id}`}
                    className="mt-4 bg-white bg-opacity-80 backdrop-blur-md border-pastel-blue"
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
                      <div className="mt-4 flex justify-end space-x-2 text-white">
                        <Button
                          onClick={() => handleRideAction(ride.id, "accept")}
                          className="text-white rounded-full overflow-hidden bg-gradient-to-br from-green-400 via-green-600 to-green-400 shadow-lg hover:bg-blue-800 hover:border-blue-900 hover:text-blue-100 hover:scale-105 transition-transform duration-300 flex items-center"
                          style={{ color: 'white' }}
                        >
                          <CheckCircle className="mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleRideAction(ride.id, "reject")}
                          className="bg-red-500 text-white hover:bg-red-600 rounded-full overflow-hidden bg-gradient-to-br from-red-400 via-red-700 to-red-400 shadow-lg hover:bg-blue-800 hover:border-blue-900 hover:text-blue-100 hover:scale-105 transition-transform duration-300 flex items-center"
                          style={{ color: 'white' }}
                        >
                          <XCircle className="mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* Accepted Rides Section */}
              <h3 className="text-lg font-semibold text-black mb-4 mt-8">
                Your Accepted Rides :
              </h3>
              {rides
                .filter((ride) => ride.status === "accepted")
                .map((ride) => (
                  <Card
                    key={`accepted-ride-${ride.id}`}
                    className="mt-4 bg-white bg-opacity-80 backdrop-blur-md border-green-200"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MapPin className="text-green-600 mr-2" />
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
                          <Users className="text-green-600 mr-2" />
                          <span>Passengers: {ride.passengers}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="text-green-600 mr-2" />
                          <span>Date: {ride.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="text-green-600 mr-2" />
                          <span>Time: {ride.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="text-green-600 mr-2" />
                          <span>Pickup Location: {ride.pickupLocation}</span>
                        </div>
                        <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accepted
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button
                            onClick={() => handleCancelRide(ride.id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            <XCircle className="mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            variant="red"
            onClick={handleLogout}
            className="bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 rounded-full"
          >
            Logout
          </Button>
        </CardFooter>
      </Card>

      {/* Rider's Ride History */}
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
                  className="mb-2 flex items-center justify-between p-4 border rounded-lg"
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
                  <div className="flex items-center space-x-4">
                    <span
                      className={`font-semibold ${
                        ride.status === "accepted"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {ride.status.charAt(0).toUpperCase() +
                        ride.status.slice(1)}
                    </span>
                    <Button
                      onClick={() => handleCancelRide(ride.id)}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <XCircle className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
