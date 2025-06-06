"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Wifi, Car, Coffee, Tv, Bath } from "lucide-react";
import React from "react";
import { RoomCardProps } from "@/types/home.types";
import { useRouter } from "next/navigation";
import Image from "next/image";

const RoomCard: React.FC<RoomCardProps> = (props) => {
  const router = useRouter();
  const {
    id,
    name,
    idealFor,
    capacity,
    size,
    bed,
    view,
    price,
    priceTier,
    image,
    description,
    amenities,
  } = props;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "STANDARD":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "DELUXE":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "SUITE":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "RESIDENTIAL_SUITE":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      case "coffee":
        return <Coffee className="h-4 w-4" />;
      case "tv":
        return <Tv className="h-4 w-4" />;
      case "bathroom":
        return <Bath className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleSeeMore = () => {
    router.push(`/room/${id}`);
  };

  return (
    <Card
      className="overflow-hidden  transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-[#020517] border-gray-200 dark:border-gray-700 justify-between"
      //   onClick={() => onClick?.(id)}
    >
      <div className="relative">
        <Image
          src={image || ""}
          alt={name}
          className=" w-full h-[200px] "
          width={0}
          height={0}
          objectFit="cover"
          sizes="100vw"
        />
        <Badge className={`absolute top-3 left-3 ${getTypeColor(name)}`}>
          {name.replace("_", " ")}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4" />
            <span>Up to {capacity} guests</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full"
              >
                {getAmenityIcon(amenity)}
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
            {amenities.length > 4 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full">
                +{amenities.length - 4} more
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${price}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            per night
          </div>
        </div>
        <Button className="ml-4 cursor-pointer" onClick={handleSeeMore}>
          See More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
