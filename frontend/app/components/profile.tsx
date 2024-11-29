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
import { User } from "lucide-react";

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferredPayment, setPreferredPayment] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("Stored User Data:", storedUser); // Debug log
  
        if (!storedUser._id) {
          console.error("User ID not found in localStorage.");
          throw new Error("User not found in localStorage");
        }
  
        const res = await fetch(`/api/profile/${storedUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        console.log("Response Status:", res.status, res.statusText); // Log
        
        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.statusText}`);
  
        const data = await res.json();
        console.log("Profile Data:", data); // Debug log
        
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhoneNumber(data.phoneNumber || "");
        setPreferredPayment(data.preferredPayment || "Cash");
        setEmail(data.email);
        setRole(data.role);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Please log in to access your profile.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProfile();
  }, [router]);
  
  
  

  const handleUpdateProfile = async () => {
    if (!firstName || !lastName || !phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch(`/api/profile/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber,
          preferredPayment,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      setUser(updatedUser);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile. Please try again.");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (!user) return null;

  return (
    <Card className="w-[400px] bg-white bg-opacity-80 backdrop-blur-md border-pastel-blue">
      <CardHeader>
        <CardTitle className="text-pastel-blue flex items-center">
          <User className="mr-2" />
          Your Profile
        </CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="firstName" className="text-pastel-blue">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border-pastel-blue"
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
              className="border-pastel-blue"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email" className="text-pastel-blue">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              disabled
              className="border-pastel-blue bg-gray-100"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="phone" className="text-pastel-blue">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-pastel-blue"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="preferredPayment" className="text-pastel-blue">
              Preferred Payment Method
            </Label>
            <select
              id="preferredPayment"
              value={preferredPayment}
              onChange={(e) => setPreferredPayment(e.target.value)}
              className="border-pastel-blue h-10 px-2"
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="role" className="text-pastel-blue">
              Role
            </Label>
            <Input
              id="role"
              value={role}
              disabled
              className="border-pastel-blue bg-gray-100"
            />
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







