"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, Phone, CreditCard, Car } from "lucide-react";

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferredPayment, setPreferredPayment] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Use the localStorage data to populate the profile
        setName(parsedUser.firstName + " " + parsedUser.lastName || '');
        setPhoneNumber(parsedUser.phoneNumber || '');
        setPreferredPayment(parsedUser.preferredPayment || '');
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
        alert('Invalid user data. Please log in again.');
        router.push('/login');
      }
    } else {
      alert('Please log in to access your profile.');
      router.push('/login');
    }
  }, [router]);
  
  

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber, preferredPayment }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
  
      const updatedUser = await res.json();
      setUser(updatedUser);
  
      // Update localStorage
      const updatedProfile = {
        ...user,
        name,
        phoneNumber,
        preferredPayment,
      };
      localStorage.setItem("user", JSON.stringify(updatedProfile));
  
      alert("Profile updated successfully!");
    } catch {
      alert("Error updating profile.");
    }
  };
  

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
            <Label htmlFor="name" className="text-pastel-blue">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-pastel-blue"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email" className="text-pastel-blue">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="border-pastel-blue bg-gray-100"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="phone" className="text-pastel-blue">Phone Number</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-pastel-blue"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="payment" className="text-pastel-blue">Preferred Payment</Label>
            <Input
              id="payment"
              value={preferredPayment}
              onChange={(e) => setPreferredPayment(e.target.value)}
              className="border-pastel-blue"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateProfile} className="bg-pastel-blue text-white hover:bg-pastel-yellow hover:text-pastel-blue">
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
}





