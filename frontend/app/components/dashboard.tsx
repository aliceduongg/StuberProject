"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Autocomplete, { fetchSuggestions } from "../components/Autocomplete";

type User = {
  email: string;
  role: "rider" | "driver";
};

type Ride = {
  id: number;
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
  const [destination, setDestination] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const router = useRouter();
  const [suggestions, setSuggestions] = useState([]); // To track autocomplete results

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }

    // Simulating fetching rides from an API
    const storedRides = localStorage.getItem("rides");
    if (storedRides) {
      setRides(JSON.parse(storedRides));
    } else {
      // If no rides in storage, create some sample rides
      const sampleRides: Ride[] = [
        {
          id: 1,
          destination: "University Library",
          pickupLocation: "Downtown Mall",
          passengers: 2,
          date: "2023-06-15",
          time: "14:00",
          status: "pending",
          fare: 15,
        },
        {
          id: 2,
          destination: "Downtown Mall",
          pickupLocation: "University Library",
          passengers: 3,
          date: "2023-06-16",
          time: "10:30",
          status: "pending",
          fare: 20,
        },
        {
          id: 3,
          destination: "Sports Complex",
          pickupLocation: "University Library",
          passengers: 1,
          date: "2023-06-17",
          time: "18:00",
          status: "pending",
          fare: 12,
        },
      ];
      setRides(sampleRides);
      localStorage.setItem("rides", JSON.stringify(sampleRides));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleBookRide = async () => {
    // Validation for the fields
    if (!destination.trim() || !pickupLocation) {
      alert("Destination and pickup location cannot be blank.");
      return;
    }

    if (!date) {
      alert("Please set the date for your ride.");
      return;
    }

    if (!time) {
      alert("Please set the time for your ride.");
      return;
    }

    if (passengers < 1) {
      alert("Number of passengers must be at least 1.");
      return;
    }

    // Proceed with booking the ride if all fields are valid
    if (user?.role === "rider") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login to book a ride.");
          return;
        }

        const response = await fetch("http://localhost:8080/api/rides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token  // 
          },
          body: JSON.stringify({
            destination,
            pickupLocation,
            passengers,
            date,
            time,
            fare: Math.floor(Math.random() * 20) + 10, // Random fare between 10 and 30
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Failed to book ride");
        }

        const newRide = await response.json();
        // Update local state with the new ride from the server
        const updatedRides = [...rides, newRide];
        setRides(updatedRides);

        // Clear form
        setDestination("");
        setPickupLocation("");
        setPassengers(1);
        setDate("");
        setTime("");

        alert("Ride booked successfully!");
      } catch (error) {
        console.error("Error booking ride:", error);
        alert("Failed to book ride. Please try again.");
      }
    }
  };

  const handleRideAction = (rideId: number, action: "accept" | "reject") => {
    const updatedStatus: "accepted" | "rejected" =
      action === "accept" ? "accepted" : "rejected";

    const updatedRides = rides.map((ride) =>
      ride.id === rideId ? { ...ride, status: updatedStatus } : ride
    );
    setRides(updatedRides);
    localStorage.setItem("rides", JSON.stringify(updatedRides));
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-pastel-blue">
                  Destination
                </Label>
                <div className="flex items-center">
                  <MapPin className="text-pastel-blue mr-2" />
                  <Autocomplete
                    onSelect={(selected) => {
                      setDestination(selected);
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupLocation" className="text-pastel-blue">
                  Pickup Location
                </Label>
                <div className="flex items-center">
                  <MapPin className="text-pastel-blue mr-2" />
                  <Autocomplete
                    onSelect={(selected) => {
                      setPickupLocation(selected);
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengers" className="text-pastel-blue">
                  Number of Passengers
                </Label>
                <div className="flex items-center">
                  <Users className="text-pastel-blue mr-2" />
                  <Input
                    id="passengers"
                    type="number"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    min={1}
                    className="flex-grow border-pastel-blue"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-pastel-blue">
                  Date
                </Label>
                <div className="flex items-center">
                  <Calendar className="text-pastel-blue mr-2" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-grow border-pastel-blue"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-pastel-blue">
                  Time
                </Label>
                <div className="flex items-center">
                  <Clock className="text-pastel-blue mr-2" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-grow border-pastel-blue"
                  />
                </div>
              </div>
              <Button
                onClick={handleBookRide}
                className="bg-pastel-blue text-white hover:bg-pastel-yellow hover:text-pastel-blue"
              >
                <Car className="mr-2" />
                Book Ride
              </Button>
            </div>
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
                    key={ride.id}
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
              .map((ride) => (
                <div
                  key={ride.id}
                  className="mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Car className="text-pastel-blue mr-2" />
                    <span>
                      Destination: {ride.destination} - Date: {ride.date} -
                      Time: {ride.time}
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
