"use client";
import ReservationForm from "@/components/ReservationPage/ReservationForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse } from "@/types/api.types";
import { RoomCategory } from "@/types/room-category.types";
import { useQuery } from "@tanstack/react-query";
import { Bed, Eye, Maximize, Users } from "lucide-react";
import React from "react";

interface ReservationViewProps {
  roomId: string;
}

const roomTypeName = (type: string) => {
  switch (type) {
    case "STANDARD":
      return "Standard";
    case "DELUXE":
      return "Deluxe";
    case "SUITE":
      return "Suite";
    case "RESIDENTIAL_SUITE":
      return "Residential Suite";
    default:
      return "Unknown Type";
  }
};

const ReservationView: React.FC<ReservationViewProps> = (props) => {
  const { roomId } = props;
  const axiosAuth = useAxiosAuth();

  const fetchAllRoomsCategory = async () => {
    const response = await axiosAuth.get(`/room-categories/${roomId}`);
    return response.data;
  };

  const {
    data: roomType,
    isLoading,
    isFetched,
  } = useQuery<ApiResponse<RoomCategory>>({
    queryKey: ["roomCategory", roomId],
    queryFn: fetchAllRoomsCategory,
    refetchOnWindowFocus: false,
    enabled: !!roomId,
  });

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 pb-10">
      {isLoading ? (
        <></>
      ) : (
        <>
          {roomType && (
            <div className="container">
              <div className="pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                      Book {roomTypeName(roomType.payload.name)} Room
                    </h1>
                    {/* <Badge variant="secondary" className="text-sm">
                      {roomType.payload.priceTier}
                    </Badge> */}
                  </div>
                </div>
              </div>

              <Card className="max-w-3xl">
                <CardHeader>
                  <CardTitle>Room Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Capacity</div>
                        <div className="text-sm text-gray-600">
                          {roomType.payload.capacity} guests
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Maximize className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Size</div>
                        <div className="text-sm text-gray-600">
                          {roomType.payload.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bed className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Bed Configuration</div>
                        <div className="text-sm text-gray-600">
                          {roomType.payload.bed}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">View</div>
                        <div className="text-sm text-gray-600">
                          {roomType.payload.view}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reservation Form */}
              <div className="flex justify-start w-full">
                <ReservationForm
                  maxOccupants={roomType.payload.capacity}
                  roomType={roomType.payload.name}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReservationView;
