"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReservationAlertProps {
  showAlert: boolean;
  setShowAlert: (value: boolean) => void;
}

const ReservationAlert: React.FC<ReservationAlertProps> = (props) => {
  const { showAlert, setShowAlert } = props;
  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Notice</AlertDialogTitle>
          <AlertDialogDescription>
            If user didn't enter credit card details by 7 pm, the reservation
            will cancel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setShowAlert(false)} autoFocus>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReservationAlert;
