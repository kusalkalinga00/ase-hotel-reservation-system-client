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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RESERVATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "NO_SHOW",
];

const ReservationManageModal = ({
  currentStatus,
  reservationId,
}: {
  currentStatus: string;
  reservationId: string;
}) => {
  const [open, setOpen] = useState(false);

  const onStatusChange = (newStatus: string) => {
    console.log(
      `Changing status of reservation ${reservationId} to ${newStatus}`
    );
  };

  const handleSave = () => {
    // Handle save logic here, e.g., API call to save changes
    console.log(`Saving changes for reservation ${reservationId}`);
    setOpen(false);
  };

  const handleClose = () => {
    // Handle close logic here, e.g., reset any unsaved changes
    console.log(`Closing modal for reservation ${reservationId}`);
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
        <div className="flex flex-col gap-4">
          <Label htmlFor="status-select">Change Status:</Label>
          <Select value={currentStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {RESERVATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationManageModal;
