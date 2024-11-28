"use client"
import React, { useEffect, useState } from "react";
import Layout from './components/layout'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Car, LogIn, UserPlus } from 'lucide-react'
import drivingImage from './images/driving.webp';

export default function Home() {
  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-pastel-blue to-gray-200"></div>
        
        {/* Content */}
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl font-bold mb-6 flex items-center">
            <Car className="mr-2" />
            Welcome to Stuber - Campus RideShare
          </h1>
          <p className="text-xl mb-8">Connect with fellow students for campus rides</p>
          <div className="space-x-4">
            <Link href="/login">
              <Button className="bg-pastel-blue text-white hover:bg-pastel-yellow hover:text-pastel-blue">
                <LogIn className="mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                variant="outline" 
                className="text-pastel-blue border-pastel-blue hover:bg-pastel-yellow hover:text-pastel-blue"
              >
                <UserPlus className="mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}