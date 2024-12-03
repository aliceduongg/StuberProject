"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, FileText, Phone } from "lucide-react";

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [licensePlateNumber, setLicensePlateNumber] = useState("");
  const router = useRouter();

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/profile/${userId}` 
      );
      if (response.ok) {
        const data = await response.json();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(data.phone || "");
        if (data.licensePlateNumber) {
          setLicensePlateNumber(data.licensePlateNumber);
        }

        // Update local storage with complete user data
        const updatedUser = {
          ...user,
          ...data,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Stored user data:', parsedUser); // Debug log
      setUser(parsedUser);
      // Fetch complete profile data from backend
      fetchUserProfile(parsedUser._id);
      if (parsedUser.firstName) setFirstName(parsedUser.firstName);
      if (parsedUser.lastName) setLastName(parsedUser.lastName);
      if (parsedUser.phone) setPhone(parsedUser.phone);
      if (parsedUser.licensePlateNumber) {
        setLicensePlateNumber(parsedUser.licensePlateNumber);
      }
      console.log("User role:", parsedUser.role); // Add this log
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleUpdateProfile = async () => {
    try {
      console.log("Updating profile for user:", user);
      console.log("User role:", user.role);
      console.log("License plate number:", licensePlateNumber);

      const updatedUser = {
        ...user,
        firstName,
        lastName,
        phone,
        ...(user.role === "driver" && { licensePlateNumber }),
      };

      const response = await fetch("http://localhost:8080/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          firstName,
          lastName,
          phone,
          ...(user.role === "driver" && { licensePlateNumber }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <Card className="w-[350px] bg-white bg-opacity-80 backdrop-blur-md border-pastel-blue">
      <CardHeader>
        <CardTitle className="text-pastel-blue flex items-center">
          <User className="mr-2" />
          Your Profile
        </CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName" className="text-pastel-blue">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-grow border-pastel-blue"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName" className="text-pastel-blue">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-grow border-pastel-blue"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone" className="text-pastel-blue">
                Phone
              </Label>
              <div className="flex items-center">
                <Phone className="text-pastel-blue mr-2" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-grow border-pastel-blue"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="text-pastel-blue">
                Email
              </Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="flex-grow border-pastel-blue bg-gray-100"
              />
            </div>
            {user.role === "driver" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="licensePlate" className="text-pastel-blue">
                  License Plate Number
                </Label>
                <Input
                  id="licensePlate"
                  value={licensePlateNumber}
                  onChange={(e) => setLicensePlateNumber(e.target.value)}
                  className="flex-grow border-pastel-blue"
                  placeholder="Enter license plate number"
                />
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdateProfile}
          className="bg-pastel-blue text-white hover:bg-pastel-yellow hover:text-pastel-blue"
        >
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
