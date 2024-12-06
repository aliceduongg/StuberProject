"use client";
import React from "react";
import Layout from "../components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import aliceImage from "@/public/assets/team/aliceee.jpeg";
import yuImage from "@/public/assets/team/yu.jpeg";
import wellsImage from "@/public/assets/team/wells.png";
import haythamImage from "@/public/assets/team/haytham.jpeg";
import Image, { StaticImageData } from "next/image";

// Define team member type
type TeamMember = {
  name: string;
  title: string;
  github: string;
  linkedin: string;
  school: string;
  imageUrl: StaticImageData; // StaticImageData type for imported images
};

// Team members data
const teamMembers: TeamMember[] = [
  {
    name: "Alice Duong",
    title: "Backend Developer",
    github: "https://github.com/member1",
    linkedin: "https://www.linkedin.com/in/aliceduongg/",
    school: "Beloit College",
    imageUrl: aliceImage,
  },
  {
    name: "Yuzhou Pan",
    title: "Frontend Developer",
    github: "https://github.com/JoePan001",
    linkedin:
      "https://www.linkedin.com/in/%E7%A6%B9%E8%88%9F-%E6%BD%98-9813552b8/",
    school: "Beloit College",
    imageUrl: yuImage, // Fixed to use imported image
  },
  {
    name: "Wells Hull",
    title: "Frontend Developer",
    github: "https://github.com/wellybe11y",
    linkedin: "https://linkedin.com/in/member1",
    school: "Beloit College",
    imageUrl: wellsImage, // Fixed to use imported image
  },
  {
    name: "Haytham Ziani",
    title: "Backend Developer",
    github: "https://github.com/Haytham-Ziani",
    linkedin: "https://www.linkedin.com/in/ziani-haytham/",
    school: "Al Akhawayn University in Ifrane",
    imageUrl: haythamImage, // Fixed to use imported image
  },
];

export default function TeamPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700">
        <div className="container mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold text-white text-center mb-12">
            Meet Our Team
          </h1>

          <div className="grid grid-cols-2 gap-12 max-w-3xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="form-card bg-white rounded-lg shadow-xl p-5 flex flex-col items-center mb-5"
              >
                <Avatar className="w-32 h-32 mb-5">
                  <AvatarImage
                    src={member.imageUrl.src} // Add .src here since you're using StaticImageData
                    alt={member.name}
                  />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-2">{member.title}</p>
                <p className="text-gray-600 mb-4">{member.school}</p>

                <div className="flex space-x-4">
                  <Link href={member.github} target="_blank">
                    <Button className="bg-gray-800 hover:bg-gray-900">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </Link>
                  <Link href={member.linkedin} target="_blank">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
