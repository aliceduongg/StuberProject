"use client";
import React from "react";
import Layout from "./components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, LogIn, UserPlus, Users, Settings, Heart, Calendar, Cloud } from "lucide-react";
import Image from "next/image";
import Graphics_Campus from "./images/Graphics_Campus.png";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative min-h-screen">
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700">
          <div className="relative z-10 text-white px-4">
            <h1 className="text-5xl font-extrabold mb-6 flex items-center justify-center">
              <Car className="mr-3 h-10 w-10" />
              Welcome to Stuber - Campus RideShare
            </h1>
            <p className="text-xl mb-8 font-light">
              Connect with fellow students for campus rides
            </p>
            <div className="flex justify-center space-x-4 mt-8">
              <Link href="/login">
                <Button className="bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-800 hover:scale-105 transition-transform duration-300 flex items-center overflow-hidden bg-gradient-to-br from-purple-400 via-purple-500 to-blue-700">
                  <LogIn className="mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-800 hover:border-blue-900 hover:text-blue-100 hover:scale-105 transition-transform duration-300 flex items-center overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700">
                  <UserPlus className="mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700 opacity-60 animate-pulse"></div>
        </div>
      </div>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <Image
                src={Graphics_Campus}
                alt="Campus RideShare"
                width={400}
                height={240}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-4xl font-bold text-blue-800 mb-6">
                About Us
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Stuber is a student-focused ridesharing platform designed to
                make campus transportation easier, safer, and more sustainable.
                We connect students who need rides with fellow students who can
                provide them.
              </p>
              <div className="flex items-center">
                <Users className="text-blue-600 h-8 w-8 mr-4" />
                <span className="text-gray-700">
                  Join our growing community of student drivers and riders
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Calendar className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                On-demand, Flexibility
              </h3>
              <p className="text-gray-600">
                Enable flexible, on-demand ride bookings that meet students'
                varying schedules and transportation needs.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Community Building
              </h3>
              <p className="text-gray-600">
                Creating connections between students and fostering a helpful
                campus community.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Cloud className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Sustainability
              </h3>
              <p className="text-gray-600">
                Reducing carbon footprint through shared rides and efficient
                transportation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-6 rounded-full mb-6">
                <Settings className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Trust & Safety
              </h3>
              <p className="text-gray-600">
                We prioritize the safety and security of our community members
                through verified profiles and safety features.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-6 rounded-full mb-6">
                <Heart className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Community First
              </h3>
              <p className="text-gray-600">
                We believe in building a strong, supportive community where
                students help each other.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
