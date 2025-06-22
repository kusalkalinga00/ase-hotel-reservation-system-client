"use client";
import ManualReservationForm from "@/components/ReservationPage/ManualReservationForm";
import ReservationTable from "@/components/Tables/ReservationTable";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse, ClerkReservation } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";

const ReservationsView = () => {
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();

  const {
    data: reservationsResponse,
    isLoading,
    isFetching,
  } = useQuery<ApiResponse<ClerkReservation[]>>({
    queryKey: ["clerk-reservations"],
    queryFn: async () => {
      const response = await axiosAuth.get("/reservations");
      return response.data;
    },
    enabled: !!session?.accessToken,
  });

  const hasReservations =
    !!reservationsResponse?.payload && reservationsResponse.payload.length > 0;

  return (
    <div className="py-10 px-5 w-full">
      {(isLoading || isFetching) && (
        <div className="text-center text-muted-foreground py-12">
          Loading reservations...
        </div>
      )}
      {!isLoading && !isFetching && !hasReservations && (
        <div className="text-center text-muted-foreground py-12">
          You have no reservations.
        </div>
      )}
      {!isLoading && !isFetching && hasReservations && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground my-2">
            View and manage all hotel bookings
          </p>
          <ReservationTable data={reservationsResponse.payload} />
        </div>
      )}
      <ManualReservationForm />
    </div>
  );
};

export default ReservationsView;
