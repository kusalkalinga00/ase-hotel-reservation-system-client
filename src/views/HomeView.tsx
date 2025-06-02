"use client";
import RoomCard from "@/components/HomePage/RoomCard";
import { Button } from "@/components/ui/button";
import { roomsData } from "@/data";
import React from "react";

const HomeView = () => {
  const handleRoomClick = (roomId: string) => {
    console.log(`Room clicked: ${roomId}`);
    // Here you would typically navigate to room details or booking page
    alert(`Navigating to room details for ${roomId}`);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Our Rooms & Suites
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose from our carefully designed accommodations, each offering
          comfort, style, and modern amenities for an unforgettable stay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {roomsData.map((room) => (
          <RoomCard key={room.id} {...room} onClick={handleRoomClick} />
        ))}
      </div>
    </div>
  );
};

export default HomeView;
