"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api.types";
import { toast } from "sonner";

const ReservationManageModal = ({
  reservationId,
}: {
  reservationId: string;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();

  // PATCH /{id}/checkin mutation
  const checkInMutation = useMutation({
    mutationFn: async () => {
      await axiosAuth.patch(`/reservations/${reservationId}/checkin`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clerk-reservations"] });
      toast.success("Reservation checked in successfully");
    },

    onError: (error: AxiosError<ApiResponse<null>>) => {
      console.log("error checkInMutation", error);
      toast.error(error.response?.data.message || "An error occurred");
    },
  });

  // PATCH /{id}/checkout mutation
  const checkOutMutation = useMutation({
    mutationFn: async () => {
      await axiosAuth.patch(`/reservations/${reservationId}/checkout`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clerk-reservations"] });
      toast.success("Reservation checked out successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      console.log("error checkOutMutation", error);
      toast.error(error.response?.data.message || "An error occurred");
    },
  });

  // DELETE /{id} mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axiosAuth.delete(`/reservations/${reservationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clerk-reservations"] });
      toast.success("Reservation deleted successfully");
      setOpen(false);
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      console.log("error deleteMutation", error);
      toast.error(error.response?.data.message || "An error occurred");
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Reservation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <div className="text-sm">Delete Reservation</div>
            <div>
              <Button
                variant={"destructive"}
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">Check-In Reservation</div>
            <div>
              <Button
                variant={"default"}
                onClick={() => checkInMutation.mutate()}
                disabled={checkInMutation.isPending}
              >
                {checkInMutation.isPending ? "Checking In..." : "Check-In"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">Check-Out Reservation</div>
            <div>
              <Button
                variant={"outline"}
                onClick={() => checkOutMutation.mutate()}
                disabled={checkOutMutation.isPending}
              >
                {checkOutMutation.isPending ? "Checking Out..." : "Check-Out"}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationManageModal;
