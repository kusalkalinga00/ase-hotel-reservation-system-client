"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  Tv,
  Coffee,
  Bath,
  Users,
  Maximize,
  Bed,
  Eye,
  DollarSign,
  CheckCircle,
  MapPin,
  Car,
  BellRing,
  Palmtree,
  Lock,
  Utensils,
  Sofa,
  HeadsetIcon as HeadsetHelp,
  ChefHat,
  Shirt,
  Home,
} from "lucide-react";
import Image from "next/image";
import { RoomCategory } from "@/types/room-category.types";
import { useEffect } from "react";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api.types";
import { Separator } from "@/components/ui/separator";

const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  coffee: Coffee,
  bathroom: Bath,
  parking: Car,
  "room service": BellRing,
  balcony: Palmtree,
  safe: Lock,
  kitchenette: Utensils,
  "living room": Sofa,
  concierge: HeadsetHelp,
  "full kitchen": ChefHat,
  laundry: Shirt,
  "multiple bedrooms": Home,
};

const amenityLabels = {
  wifi: "Free WiFi",
  tv: "Smart TV",
  coffee: "Coffee Maker",
  bathroom: "Private Bathroom",
  parking: "Free Parking",
  "room service": "Room Service",
  balcony: "Private Balcony",
  safe: "In-room Safe",
  kitchenette: "Kitchenette",
  "living room": "Living Area",
  concierge: "Concierge Service",
  "full kitchen": "Full Kitchen",
  laundry: "Laundry Facilities",
  "multiple bedrooms": "Multiple Bedrooms",
};

interface RoomViewProps {
  roomCategoryId: string;
}

const RoomView: React.FC<RoomViewProps> = (props) => {
  const { roomCategoryId } = props;
  const axiosAuth = useAxiosAuth();

  const fetchAllRoomsCategories = async () => {
    const response = await axiosAuth.get(`/room-categories/${roomCategoryId}`);
    return response.data;
  };

  const {
    data: roomType,
    isLoading,
    isFetched,
  } = useQuery<ApiResponse<RoomCategory>>({
    queryKey: ["roomCategory", roomCategoryId],
    queryFn: fetchAllRoomsCategories,
    refetchOnWindowFocus: false,
    enabled: !!roomCategoryId,
  });

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {isLoading ? (
        <></>
      ) : (
        <>
          {roomType && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                      {roomTypeName(roomType.payload.name)} Room
                    </h1>
                    <Badge variant="secondary" className="text-sm">
                      {roomType.payload.priceTier}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Room Image */}
                  <Card className="p-1">
                    <CardContent className="p-0">
                      <div className="relative h-64 sm:h-80 lg:h-96">
                        <Image
                          src={roomType.payload.image}
                          alt={`${roomType.payload.name} room`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Room Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {roomType.payload.description}
                      </p>
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Ideal For:
                        </h4>
                        <p className="text-gray-600">
                          {roomType.payload.idealFor}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Room Specifications */}
                  <Card>
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

                  {/* Amenities */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {roomType.payload.amenities.map((amenity) => {
                          const IconComponent =
                            amenityIcons[amenity as keyof typeof amenityIcons];
                          const label =
                            amenityLabels[
                              amenity as keyof typeof amenityLabels
                            ];

                          return (
                            <div
                              key={amenity}
                              className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg"
                            >
                              <IconComponent className="h-8 w-8 text-blue-600 mb-2" />
                              <span className="text-sm font-medium">
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Pricing Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Pricing</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          ${roomType.payload.price}
                        </div>
                        <div className="text-gray-600 mb-4">per night</div>
                        <Badge variant="outline" className="mb-4">
                          {roomType.payload.priceTier}
                        </Badge>
                        <Button className="w-full" size="lg">
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Room Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5" />
                        <span>Available Rooms</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {roomType.payload.rooms
                          .filter((room) => room.status === "AVAILABLE")
                          .map((room) => (
                            <div
                              key={room.id}
                              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                            >
                              <div className="flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                  <div className="font-medium">
                                    Room {room.number}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {room.status}
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-green-700 border-green-300"
                              >
                                Available
                              </Badge>
                            </div>
                          ))}
                      </div>
                      <Separator className="my-4" />
                      <div className="text-sm text-gray-600 text-center">
                        {
                          roomType.payload.rooms.filter(
                            (room) => room.status === "AVAILABLE"
                          ).length
                        }{" "}
                        rooms available
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomView;
