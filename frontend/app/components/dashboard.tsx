"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, MapPin, Users, Calendar, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react";

type User = {
  email: string;
  role: "rider" | "driver";
};

type Ride = {
  id: number;
  destination: string;
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
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null); // Error message state
  const router = useRouter();

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
      const sampleRides: Ride[] = [
        { id: 1, destination: "University Library", passengers: 2, date: "2023-06-15", time: "14:00", status: "pending", fare: 15 },
        { id: 2, destination: "Downtown Mall", passengers: 3, date: "2023-06-16", time: "10:30", status: "pending", fare: 20 },
        { id: 3, destination: "Sports Complex", passengers: 1, date: "2023-06-17", time: "18:00", status: "pending", fare: 12 },
      ];
      setRides(sampleRides);
      localStorage.setItem("rides", JSON.stringify(sampleRides));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleBookRide = () => {
    // Input validation
    if (!destination) {
      setError("Destination cannot be blank.");
      return;
    }
    if (passengers <= 0) {
      setError("Number of passengers must be at least 1.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (!time) {
      setError("Please select a time.");
      return;
    }

    // Clear error and add the ride
    setError(null);

    if (user?.role === "rider") {
      const newRide: Ride = {
        id: Date.now(),
        destination,
        passengers,
        date,
        time,
        status: "pending",
        fare: Math.floor(Math.random() * 20) + 10, // Random fare between 10 and 30
      };
      const updatedRides = [...rides, newRide];
      setRides(updatedRides);
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      setDestination("");
      setPassengers(1);
      setDate("");
      setTime("");
    }
  };

  const handleRideAction = (rideId: number, action: "accept" | "reject") => {
    const updatedStatus: "accepted" | "rejected" = action === "accept" ? "accepted" : "rejected";

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
          <CardTitle className="text-pastel-blue">Welcome, {user.email}</CardTitle>
          <CardDescription>You are logged in as a {user.role}</CardDescription>
        </CardHeader>
        <CardContent>
          {user.role === "rider" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-pastel-blue">Destination</Label>
                <div className="flex items-center">
                  <MapPin className="text-pastel-blue mr-2" />
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter your destination"
                    className="flex-grow border-pastel-blue"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengers" className="text-pastel-blue">Number of Passengers</Label>
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
                <Label htmlFor="date" className="text-pastel-blue">Date</Label>
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
                <Label htmlFor="time" className="text-pastel-blue">Time</Label>
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
              {error && <p className="text-red-500">{error}</p>} {/* Error Message */}
              <Button onClick={handleBookRide} className="bg-pastel-blue text-white hover:bg-pastel-yellow hover:text-pastel-blue">
                <Car className="mr-2" />
                Book Ride
              </Button>
            </div>
          )}
          {/* ...Driver-specific content remains unchanged */}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

