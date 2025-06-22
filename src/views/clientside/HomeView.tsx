"use client";
import RoomCard from "@/components/HomePage/RoomCard";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse } from "@/types/api.types";
import { RoomCategory } from "@/types/room-category.types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const HomeView = () => {
  const session = useSession();
  const axiosAuth = useAxiosAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  const fetchAllRoomsCategories = async () => {
    const response = await axiosAuth.get("/room-categories");
    return response.data;
  };

  const { data: roomTypes, isLoading } = useQuery<ApiResponse<RoomCategory[]>>({
    queryKey: ["room-categories"],
    queryFn: fetchAllRoomsCategories,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log("Fetched room categories:", roomTypes?.payload);
  }, [roomTypes]);

  return (
    <div className="min-h-screen bg-[url(/assets/home-background/home-bg.jpg)] bg-no-repeat bg-center bg-cover ">
      <div className="backdrop-blur-sm bg-black/30 min-h-screen">
        {/* Travel Agent Banner */}
        <div className="w-full bg-blue-900 text-white py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex container mx-auto items-center gap-4 justify-between">
            <div className="text-center md:text-left text-base md:text-lg font-medium">
              Travel agents can book at a discounted rate for one or more nights
              for three or more rooms.
            </div>
            <div className="flex gap-2 justify-center md:justify-end">
              <Button
                className="bg-blue-600 cursor-pointer text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => router.push("/travel-agent-book")}
              >
                Book
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 ">
          <div className="text-center mt-4 mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Our Rooms & Suites
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose from our carefully designed accommodations, each offering
              comfort, style, and modern amenities for an unforgettable stay.
            </p>
          </div>

          <div>
            {isLoading ? (
              <div className=" flex justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-slate-300" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-2">
                {roomTypes &&
                  roomTypes.payload.map((room) => (
                    <RoomCard key={room.id} {...room} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
