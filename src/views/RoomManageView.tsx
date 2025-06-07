"use client";
import RoomsTable from "@/components/roomManagePage/RoomsTable";
import { Button } from "@/components/ui/button";
import React from "react";
import { Room } from "@/types/api.types";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

const RoomManageView = () => {
  const axiosAuth = useAxiosAuth();
  const {
    data: roomsResponse,
    isLoading,
    isError,
  } = useQuery<{ payload: Room[] }>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axiosAuth.get("/rooms");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen px-5 pt-5 flex flex-col">
      <div className="flex justify-start">
        <Button>Add Room</Button>
      </div>
      <div className="w-full mt-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError || !roomsResponse?.payload ? (
          <div>Error loading rooms.</div>
        ) : (
          <RoomsTable rooms={roomsResponse.payload} />
        )}
      </div>
    </div>
  );
};

export default RoomManageView;
