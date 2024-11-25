"use client"
import React, { useEffect, useState } from "react";
import Layout from './components/layout'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Car, LogIn, UserPlus } from 'lucide-react'

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <h1 className="text-4xl font-bold mb-6 text-pastel-blue flex items-center">
          <Car className="mr-2" />
          Welcome to Stuber - Campus RideShare
        </h1>
        <p className="text-xl mb-8 text-pastel-blue">Connect with fellow students for campus rides</p>
        <div className="space-x-4">
          <Link href="/login">
            <Button className="bg-pastel-blue text-white hover:bg-pastel-yellow hover:text-pastel-blue">
              <LogIn className="mr-2" />
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="text-pastel-blue border-pastel-blue hover:bg-pastel-yellow hover:text-pastel-blue">
              <UserPlus className="mr-2" />
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}