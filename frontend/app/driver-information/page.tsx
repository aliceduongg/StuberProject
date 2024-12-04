"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Layout from "../components/layout";

export default function DriverInformation() {
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [licensePlate, setLicensePlate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setError(
          "Invalid file type. Please upload JPG, PNG, or PDF files only."
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      setFile(file);
      setError(null);
    }
  };
  
  useEffect(() => {
    const checkDriverInfo = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("http://localhost:8080/api/driver/information", {
          headers: {
            "x-auth-token": token
          }
        });
        const data = await response.json();
        if (data.user.driverLicense && data.user.vehicleImage && data.user.licensePlateNumber) {
          router.push("/dashboard");
        }
      }
    };
    
    checkDriverInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!driverLicense || !vehicleImage || !licensePlate.trim()) {
        throw new Error("Please provide all required information");
      }

      const licensePlateRegex = /^[A-Z0-9]{5,8}$/;
      if (!licensePlateRegex.test(licensePlate.toUpperCase())) {
        throw new Error("Invalid license plate format");
      }

      const formData = new FormData();
      formData.append("driverLicense", driverLicense);
      formData.append("vehicleImage", vehicleImage);
      formData.append("licensePlate", licensePlate.toUpperCase());

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        "http://localhost:8080/api/driver/information",
        {
          method: "POST",
          headers: {
            "x-auth-token": token,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to submit driver information");
      }

      const data = await response.json();
      router.push("/dashboard");
    } catch (err) {
      console.error("Error submitting driver information:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      if (err instanceof Error && err.message.includes("401")) {
        router.push("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>
              Please provide your driver and vehicle information to complete
              registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div className="space-y-2">
                <Label htmlFor="driverLicense">Driver's License</Label>
                <Input
                  id="driverLicense"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange(e, setDriverLicense)}
                  required
                  className="border-pastel-blue"
                />
                {driverLicense && (
                  <p className="text-sm text-green-600">
                    File selected: {driverLicense.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleImage">Vehicle Picture</Label>
                <Input
                  id="vehicleImage"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, setVehicleImage)}
                  required
                  className="border-pastel-blue"
                />
                {vehicleImage && (
                  <p className="text-sm text-green-600">
                    File selected: {vehicleImage.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate Number</Label>
                <Input
                  id="licensePlate"
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="Enter license plate number"
                  required
                  className="border-pastel-blue"
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button type="submit" className="w-full rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700 "style={{ color: 'white' }} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Information"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
