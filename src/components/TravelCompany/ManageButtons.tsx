import React from "react";
import { Button } from "../ui/button";

interface ManageButtonsProps {
  reservationId: string;
}

const ManageButtons: React.FC<ManageButtonsProps> = (props) => {
  const { reservationId } = props;
  return (
    <div className="flex items-center gap-4">
      <Button>Confirm</Button>
      <Button variant="destructive">Cancel</Button>
    </div>
  );
};

export default ManageButtons;
