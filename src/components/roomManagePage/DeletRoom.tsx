"use client";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api.types";

interface DeletRoomProps {
  roomId: string;
}

const DeletRoom: React.FC<DeletRoomProps> = (props) => {
  const { roomId } = props;
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      await axiosAuth.delete(`/rooms/${roomId}`);
    },
    onSuccess: () => {
      toast.success("Room deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      console.log("Error updating team", error);
      toast.error(error.response?.data.message || "An error occurred");
    },
  });

  return (
    <Button
      variant={"destructive"}
      onClick={() => deleteRoomMutation.mutate(roomId)}
      disabled={deleteRoomMutation.isPending}
    >
      Delete
    </Button>
  );
};

export default DeletRoom;
