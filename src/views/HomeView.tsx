"use client";
import RoomCard from "@/components/HomePage/RoomCard";
import { roomsData } from "@/data";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

const HomeView = () => {
  const session = useSession();

  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  const handleRoomClick = (roomId: string) => {
    console.log(`Room clicked: ${roomId}`);
    alert(`Navigating to room details for ${roomId}`);
  };

  return (
    <div className="min-h-screen bg-[url(/assets/home-background/home-bg.jpg)] bg-no-repeat bg-center bg-cover ">
      <div className="backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4 py-8 h-screen ">
          <div className="text-center mt-4 mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Our Rooms & Suites
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose from our carefully designed accommodations, each offering
              comfort, style, and modern amenities for an unforgettable stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-2">
            {roomsData.map((room) => (
              <RoomCard key={room.id} {...room} onClick={handleRoomClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
