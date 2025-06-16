"use client";
import React, { useEffect, useState } from "react";
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
  rate,
}: {
  reservationId: string;
  checkOutDate: string;
  rate: number;
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

  // Calculate payment amount
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

  // Billing mutation
  const billingMutation = useMutation({
    mutationFn: async (payload: {
      reservationId: string;
      amount: number;
      paymentMethod: string;
    }) => {
      await axiosAuth.post("/billing", payload);
    },
    onSuccess: () => {
      toast.success("Billing successful!");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(error.response?.data.message || "Billing failed");
    },
  });

  // Prefill editCheckOutDate and editCheckOutTime from props if available
  useEffect(() => {
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

  useEffect(() => {
    if (initialCheckOutDate && rate) {
      // Find check-in date from reservationId context or props if available
      // For this example, let's assume check-in date is available as a prop or can be fetched if needed
      // Here, we will just use a placeholder for check-in date
      // You should replace this with the actual check-in date from reservation data
      // For now, let's assume check-in date is 3 days before check-out
      const checkOut = new Date(initialCheckOutDate);
      // Placeholder: 3 nights before
      const checkIn = new Date(checkOut);
      checkIn.setDate(checkOut.getDate() - 3);
      // Calculate nights
      const msPerNight = 1000 * 60 * 60 * 24;
      const nights = Math.max(
        1,
        Math.round((checkOut.getTime() - checkIn.getTime()) / msPerNight)
      );
      setPaymentAmount(nights * rate);
    }
  }, [initialCheckOutDate, rate]);

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

  const handleCheckOut = () => {
    checkOutMutation.mutate(undefined, {
      onSuccess: () => {
        billingMutation.mutate({
          reservationId,
          amount: paymentAmount,
          paymentMethod,
        });
      },
    });
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
          <div className="space-y-2">
            <div className="text-sm font-bold">Check-Out Reservation</div>

            <div>
              <div className="text-sm mb-2">Payment Method</div>
              <div>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </select>
              </div>
              <div className="mt-2 text-sm font-semibold text-blue-900">
                Payment Amount: ${paymentAmount}
              </div>
            </div>
            <div>
              <Button
                variant={"outline"}
                onClick={handleCheckOut}
                disabled={
                  checkOutMutation.isPending || billingMutation.isPending
                }
                className="text-xs"
              >
                {checkOutMutation.isPending || billingMutation.isPending
                  ? "Processing..."
                  : "Check-Out"}
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
