"use client";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { RoomCategory } from "@/types/room-category.types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

interface RoomTypeProps {
  roomCategoryId: string;
}

const RoomType: React.FC<RoomTypeProps> = (props) => {
  const { roomCategoryId } = props;
  const axiosAuth = useAxiosAuth();
  const [typeName, setTypeName] = useState<string>("");

  const { data: roomCategories } = useQuery<{ payload: RoomCategory[] }>({
    queryKey: ["room-categories"],
    queryFn: async () => {
      const res = await axiosAuth.get("/room-categories");
      return res.data || [];
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (roomCategories && roomCategoryId) {
      const selectedCategory = roomCategories.payload.find(
        (category) => category.id === roomCategoryId
      );
      setTypeName(selectedCategory?.name || "");
    }
  }, [roomCategories, roomCategoryId]);

  return <div>{typeName}</div>;
};

export default RoomType;
