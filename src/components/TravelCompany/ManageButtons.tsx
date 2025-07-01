import React, { useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse } from "@/types/api.types";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ManageButtonsProps {
  reservationId: string;
}

const ManageButtons: React.FC<ManageButtonsProps> = (props) => {
  const { reservationId } = props;
  const [loading, setLoading] = useState(false);
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const confirmMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const response = await axiosAuth.patch(
        `/reservations/travel-company/${reservationId}/confirm`
      );
      return response.data;
    },
    onSuccess: (data: ApiResponse<null>) => {
      toast.success(data.message || "Reservation confirmed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["clerk-reservations"],
      });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(
        error?.response?.data?.message || "Failed to confirm reservation"
      );
    },
    onSettled: () => setLoading(false),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const response = await axiosAuth.patch(
        `/reservations/travel-company/${reservationId}/cancel`
      );
      return response.data;
    },
    onSuccess: (data: ApiResponse<null>) => {
      toast.success(data.message || "Reservation cancelled successfully!");
      queryClient.invalidateQueries({
        queryKey: ["clerk-reservations"],
      });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(
        error?.response?.data?.message || "Failed to cancel reservation"
      );
    },
    onSettled: () => setLoading(false),
  });

  const handleConfirmTravelReservation = async () => {
    confirmMutation.mutate();
  };

  const handleCancelTravelReservation = async () => {
    cancelMutation.mutate();
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        className="cursor-pointer"
        onClick={handleConfirmTravelReservation}
        disabled={loading}
      >
        {loading && confirmMutation.isPending ? "Confirming..." : "Confirm"}
      </Button>
      <Button
        variant="destructive"
        className="cursor-pointer"
        onClick={handleCancelTravelReservation}
        disabled={loading}
      >
        {loading && cancelMutation.isPending ? "Cancelling..." : "Cancel"}
      </Button>
    </div>
  );
};

export default ManageButtons;
