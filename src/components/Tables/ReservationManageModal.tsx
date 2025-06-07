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
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const ReservationManageModal = ({
  reservationId,
  checkOutDate: initialCheckOutDate,
}: {
  reservationId: string;
  checkOutDate: string;
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

  // PATCH /{id} for editing check-out date
  const editCheckOutMutation = useMutation({
    mutationFn: async (isoString: string) => {
      await axiosAuth.patch(`/reservations/${reservationId}`, {
        checkOutDate: isoString,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clerk-reservations"] });
      toast.success("Check-out date updated successfully");
      setOpen(false);
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      console.log("error editCheckOutMutation", error);
      toast.error(error.response?.data.message || "An error occurred");
    },
  });

  // State for edit check-out form
  const [editCheckOutDate, setEditCheckOutDate] = useState("");
  const [editCheckOutTime, setEditCheckOutTime] = useState("");

  // Prefill editCheckOutDate and editCheckOutTime from props if available
  React.useEffect(() => {
    if (initialCheckOutDate) {
      const date = new Date(initialCheckOutDate);
      // Use local time for consistency with table
      setEditCheckOutDate(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      );
      setEditCheckOutTime(
        `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes()
        ).padStart(2, "0")}`
      );
    }
  }, [initialCheckOutDate, open]);

  // Handler for update check-out button
  const handleEditCheckOut = () => {
    // Combine date and time into ISO string (UTC)
    let isoString = "";
    if (editCheckOutDate && editCheckOutTime) {
      const [year, month, day] = editCheckOutDate.split("-");
      const [hour, minute] = editCheckOutTime.split(":");
      const date = new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hour),
          Number(minute),
          0,
          0
        )
      );
      isoString = date.toISOString();
    }
    if (isoString) {
      editCheckOutMutation.mutate(isoString);
    } else {
      toast.error("Please select both date and time");
    }
  };

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
            <div className="text-sm font-bold">Delete Reservation</div>
            <div>
              <Button
                variant={"destructive"}
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="text-xs"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold">Check-In Reservation</div>
            <div>
              <Button
                variant={"default"}
                onClick={() => checkInMutation.mutate()}
                disabled={checkInMutation.isPending}
                className="text-xs"
              >
                {checkInMutation.isPending ? "Checking In..." : "Check-In"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold">Check-Out Reservation</div>
            <div>
              <Button
                variant={"outline"}
                onClick={() => checkOutMutation.mutate()}
                disabled={checkOutMutation.isPending}
                className="text-xs"
              >
                {checkOutMutation.isPending ? "Checking Out..." : "Check-Out"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold">Edit Check-Out</div>
            <div className="space-y-2">
              <Label htmlFor="checkOutDate" className="text-xs">
                Check-out Date
              </Label>
              <Input
                id="checkOutDate"
                type="date"
                value={editCheckOutDate}
                onChange={(e) => setEditCheckOutDate(e.target.value)}
                className="max-w-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutTime" className="text-xs">
                Check-out Time
              </Label>
              <Input
                id="checkOutTime"
                type="time"
                value={editCheckOutTime}
                onChange={(e) => setEditCheckOutTime(e.target.value)}
                className="max-w-[150px]"
              />
            </div>

            <div className="mt-4">
              <Button
                className="text-xs"
                onClick={handleEditCheckOut}
                disabled={editCheckOutMutation.isPending}
              >
                {editCheckOutMutation.isPending
                  ? "Updating..."
                  : "Update Check-Out Date"}
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
