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
          <AlertDialogTitle>Warning</AlertDialogTitle>
          <AlertDialogDescription>
            Please note that the reservation will automatically cancel if do not
            add credit card details before 7.00 PM.
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
