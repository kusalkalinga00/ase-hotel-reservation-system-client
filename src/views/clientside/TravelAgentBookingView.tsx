import TravelCompanyBookingForm from "@/components/TravelCompany/TravelCompanyBookingForm";
import React from "react";

const TravelAgentBookingView = () => {
  return (
    <div className="min-h-screen  container mx-auto">
      <div className="bg-green-100 border border-green-300 text-green-900 rounded-md px-4 py-3 my-6 text-center text-lg font-semibold">
        Travel Agent Special: <span className="font-bold">10% discount</span> on
        bookings for three or more rooms!
      </div>
      <TravelCompanyBookingForm />
    </div>
  );
};

export default TravelAgentBookingView;
