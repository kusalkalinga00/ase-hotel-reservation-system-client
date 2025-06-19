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

  const fetchUserReservations = async () => {
    const response = await axiosAuth.get("/reservations");
    return response.data;
  };

  const {
    data: initialReservationsResponse,
    isLoading,
    isFetching,
  } = useQuery<ApiResponse<ClerkReservation[]>>({
    queryKey: ["clerk-reservations"],
    queryFn: fetchUserReservations,
    enabled: !!session?.accessToken,
  });

  return (
    <div className="py-10 px-5 w-full">
      {isLoading || isFetching ? (
        <div className="text-center text-muted-foreground py-12">
          Loading reservations...
        </div>
      ) : !initialReservationsResponse?.payload?.length ? (
        <div className="text-center text-muted-foreground py-12">
          You have no reservations.
        </div>
      ) : (
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground my-2">
            View and manage all hotel bookings
          </p>
          <>
            {initialReservationsResponse?.payload && (
              <ReservationTable
                data={initialReservationsResponse?.payload || []}
              />
            )}
          </>
        </div>
      )}

      <ManualReservationForm />
    </div>
  );
};

export default ReservationsView;
