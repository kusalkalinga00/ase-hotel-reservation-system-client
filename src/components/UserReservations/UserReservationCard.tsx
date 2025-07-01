"use client";
import { Reservation } from "@/types/auth-payload.types";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  Edit,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api.types";

interface UserReservationCardProps {
  reservation: Reservation;
}

const UserReservationCard: React.FC<UserReservationCardProps> = (props) => {
  const { reservation } = props;
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [editForm, setEditForm] = useState({
    checkInDate: "",
    checkInTime: "",
    checkOutDate: "",
    checkOutTime: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  // PATCH mutation for editing reservation
  const editMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      checkInDate: string;
      checkOutDate: string;
    }) => {
      return axiosAuth.patch(`/reservations/${payload.id}`, {
        checkInDate: payload.checkInDate,
        checkOutDate: payload.checkOutDate,
      });
    },
    onSuccess: () => {
      toast.success("Reservation updated successfully");
      setEditingReservation(null);
      queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
      setOpenEditDialog(false);
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update reservation"
      );
    },
  });

  // CANCELLED mutation for canceling reservation
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return axiosAuth.patch(`/reservations/${id}`, {
        status: "CANCELLED",
      });
    },
    onSuccess: () => {
      toast.success("Reservation cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(
        error?.response?.data?.message || "Failed to cancel reservation"
      );
    },
  });

  // DELETE mutation for deleting reservation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axiosAuth.delete(`/reservations/${id}`);
    },
    onSuccess: () => {
      toast.success("Reservation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete reservation"
      );
    },
  });

  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatUTC = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
      date.getUTCDate()
    )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CHECKED_IN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CHECKED_OUT":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const canEdit = (reservation: Reservation) => {
    return (
      reservation.status === "PENDING" || reservation.status === "CONFIRMED"
    );
  };

  const canCancel = (reservation: Reservation) => {
    return (
      reservation.status !== "CHECKED_OUT" &&
      reservation.status !== "CANCELLED" &&
      reservation.status !== "CHECKED_IN"
    );
  };

  const canDelete = (reservation: Reservation) => {
    return (
      reservation.status === "CANCELLED" ||
      reservation.status === "CHECKED_OUT" ||
      reservation.status === "NO_SHOW"
    );
  };

  const handleEditClick = (reservation: Reservation) => {
    setEditingReservation(reservation);
    const checkInDate = new Date(reservation.checkInDate);
    const checkOutDate = new Date(reservation.checkOutDate);
    setEditForm({
      checkInDate: `${checkInDate.getUTCFullYear()}-${pad(
        checkInDate.getUTCMonth() + 1
      )}-${pad(checkInDate.getUTCDate())}`,
      checkInTime: `${pad(checkInDate.getUTCHours())}:${pad(
        checkInDate.getUTCMinutes()
      )}`,
      checkOutDate: `${checkOutDate.getUTCFullYear()}-${pad(
        checkOutDate.getUTCMonth() + 1
      )}-${pad(checkOutDate.getUTCDate())}`,
      checkOutTime: `${pad(checkOutDate.getUTCHours())}:${pad(
        checkOutDate.getUTCMinutes()
      )}`,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingReservation) return;
    // Parse form fields as UTC and construct ISO string in UTC
    const [ciYear, ciMonth, ciDay] = editForm.checkInDate
      .split("-")
      .map(Number);
    const [ciHour, ciMinute] = editForm.checkInTime.split(":").map(Number);
    const updatedCheckInDate = new Date(
      Date.UTC(ciYear, ciMonth - 1, ciDay, ciHour, ciMinute)
    ).toISOString();

    const [coYear, coMonth, coDay] = editForm.checkOutDate
      .split("-")
      .map(Number);
    const [coHour, coMinute] = editForm.checkOutTime.split(":").map(Number);
    const updatedCheckOutDate = new Date(
      Date.UTC(coYear, coMonth - 1, coDay, coHour, coMinute)
    ).toISOString();

    editMutation.mutate({
      id: editingReservation.id,
      checkInDate: updatedCheckInDate,
      checkOutDate: updatedCheckOutDate,
    });
  };

  const handleCancelReservation = async (reservationId: string) => {
    cancelMutation.mutate(reservationId);
  };

  const handleDeleteReservation = async (reservationId: string) => {
    deleteMutation.mutate(reservationId);
  };

  const formatCreditCard = (cardNumber: string) => {
    if (!cardNumber) return "No payment method";
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <Card key={reservation.id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">
              Room {reservation.room.number}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Reservation ID: {reservation.id.slice(0, 8)}...
            </p>
          </div>
          <Badge className={getStatusColor(reservation.status)}>
            {reservation.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Check-in</p>
                <p className="text-sm text-muted-foreground">
                  {formatUTC(reservation.checkInDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Check-out</p>
                <p className="text-sm text-muted-foreground">
                  {formatUTC(reservation.checkOutDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Occupants</p>
                <p className="text-sm text-muted-foreground">
                  {reservation.occupants}{" "}
                  {reservation.occupants === 1 ? "guest" : "guests"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Payment</p>
                <p className="text-sm text-muted-foreground">
                  {formatCreditCard(reservation.creditCard || "")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          {canEdit(reservation) && (
            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(reservation)}
                  className="cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  Edit Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Reservation</DialogTitle>
                  <DialogDescription>
                    Update your check-in/check-out details
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkInDate">Check-in Date</Label>
                      <Input
                        id="checkInDate"
                        type="date"
                        value={editForm.checkInDate}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            checkInDate: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkInTime">Check-in Time</Label>
                      <Input
                        id="checkInTime"
                        type="time"
                        value={editForm.checkInTime}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            checkInTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkOutDate">Check-out Date</Label>
                      <Input
                        id="checkOutDate"
                        type="date"
                        value={editForm.checkOutDate}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            checkOutDate: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkOutTime">Check-out Time</Label>
                      <Input
                        id="checkOutTime"
                        type="time"
                        value={editForm.checkOutTime}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            checkOutTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingReservation(null);
                      setOpenEditDialog(false);
                    }}
                    className="cursor-pointer"
                  >
                    Close
                  </Button>
                  <Button onClick={handleSaveEdit} className="cursor-pointer">
                    <Check className="h-4 w-4 " />
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {canCancel(reservation) && (
            <AlertDialog>
              <AlertDialogTrigger
                asChild
                // disabled={reservation.status === "CHECKED_IN"}
              >
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4 " />
                  Cancel Booking
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Cancel Reservation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this reservation for Room{" "}
                    {reservation.room.number}? This action cannot be undone and
                    cancellation fees may apply.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Cancel Booking
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {canDelete(reservation) && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteReservation(reservation.id)}
              disabled={deleteMutation.isPending}
              className="cursor-pointer"
            >
              <X className="h-4 w-4 " />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserReservationCard;
