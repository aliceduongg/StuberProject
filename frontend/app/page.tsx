"use client";
import React, { useEffect, useState } from "react";
import Layout from "./components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, LogIn, UserPlus } from "lucide-react";
import drivingImage from "./images/driving.webp";


export default function Home() {
  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700">
        {/* Content */}
        <div className="relative z-10 text-white px-4">
          <h1 className="text-5xl font-extrabold mb-6 flex items-center">
            <Car className="mr-3 h-10 w-10" />
            Welcome to Stuber - Campus RideShare
          </h1>
          <p className="text-xl mb-8 font-light">
            Connect with fellow students for campus rides
          </p>
          <div className="flex justify-center space-x-4 mt-8">
          <Link href="/login">
              <Button className="bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-800 hover:scale-105 transition-transform duration-300 flex items-center overflow-hidden bg-gradient-to-br from-purple-400 via-purple-500 to-blue-700"
              style={{ color: 'white' }}
              >
                <LogIn className="mr-2 " />
                Login
              </Button>
            </Link>


            <Link href="/signup">
              <Button
                className="text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-800 hover:border-blue-900 hover:text-blue-100 hover:scale-105 transition-transform duration-300 flex items-center overflow-hidden bg-gradient-to-br from-purple-400 via-purple-500 to-blue-700"
                style={{ color: 'white' }}
              >
                <UserPlus className="mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        {/* Subtle Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700 opacity-60 animate-pulse"></div>
        <div className="absolute inset-0">
          {/* Moving gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-700 animate-gradient-x opacity-80"></div>
          {/* Layer with pulsating effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-50 animate-pulse"></div>
        </div>
      </div>
    </Layout>
  );
}
