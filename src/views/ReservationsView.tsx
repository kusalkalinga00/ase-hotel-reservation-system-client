"use client";
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
    isFetched,
  } = useQuery<ApiResponse<ClerkReservation[]>>({
    queryKey: ["clerk-reservations"],
    queryFn: fetchUserReservations,
    enabled: !!session?.accessToken,
  });

  return (
    <div className="pt-10 px-5 w-full">
      {initialReservationsResponse?.payload && (
        <ReservationTable data={initialReservationsResponse?.payload || []} />
      )}
    </div>
  );
};

export default ReservationsView;
