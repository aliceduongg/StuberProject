"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthFormProps = {
  type: "login" | "signup";
};

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("rider");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for both login and signup
    if (
      !email ||
      !password ||
      (type === "signup" && (!role || !firstName || !lastName))
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    // Additional validation for signup only
    if (type === "signup") {
      if (!firstName || !lastName || !phone || !role) {
        setError("Please fill in all required fields.");
        return;
      }

      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(phone)) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);

    try {
      // Use different endpoints based on type
      const endpoint = type === "login" ? "login" : "signup";
      const response = await fetch(
        `http://localhost:8080/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            ...(type === "signup" && {
              firstName,
              lastName,
              phone,
              role,
            }),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Something went wrong");
      }

      // Store user data and token
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data.user._id,
          email: data.user.email,
          role: data.user.role,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
        })
      );

      // Redirect based on role
      if (
        data.user.role === "driver" &&
        (!data.user.driverLicense ||
          !data.user.vehicleImage ||
          !data.user.licensePlateNumber)
      ) {
        // Only redirect to driver-information if documents are missing
        router.push("/driver-information");
      } else {
        // If driver has already uploaded documents, go straight to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Card className="w-[350px] bg-opacity-80 backdrop-blur-md border-pastel-blue">
      <CardHeader>
        <CardTitle>{type === "login" ? "Login" : "Sign Up"}</CardTitle>
        <CardDescription>
          Enter your details to{" "}
          {type === "login" ? "login" : "create an account"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="rounded-md">
          <div className="grid w-full items-center gap-4 black-text">
            {type === "signup" && (
              <>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    className="rounded-md border-pastel-blue"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    className="rounded-md border-pastel-blue"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="rounded-md border-pastel-blue"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </>
            )}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="rounded-md border-pastel-blue"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="rounded-md border-pastel-blue"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {type === "signup" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  title="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border-pastel-blue border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-pastel-blue file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="rider">Rider</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <Button
                variant="default"
                onClick={() =>
                  router.push(type === "login" ? "/signup" : "/login")
                }
                className=""
                style={{
                  color: "purple",
                  fontSize: "10px",
                  backgroundColor: "#d8e6fd",
                }}
              >
                {type === "login"
                  ? "Don't have an account? Click Here"
                  : "Already Have an Account? Click Here"}
              </Button>
              <Button
                type="submit"
                className="hover:bg-blue-800 hover:border-blue-900 hover:text-blue-100 hover:scale-105 transition-transform duration-300 flex items-center bg-white text-white hover:bg-gray-800 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-blue-600 to-purple-600"
                style={{ color: "white" }}
              >
                {type === "login" ? "Login" : "Sign Up"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
