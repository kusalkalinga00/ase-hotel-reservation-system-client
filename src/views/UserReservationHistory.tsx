"use client";
import React, { useState } from "react";
import { Reservation } from "@/types/auth-payload.types";
import UserReservationCard from "@/components/UserReservations/UserReservationCard";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse } from "@/types/api.types";

const UserReservationHistory = () => {
  const axiosAuth = useAxiosAuth();

  const fetchUserReservations = async () => {
    const response = await axiosAuth.get("/reservations/my");
    return response.data;
  };

  const {
    data: initialReservationsResponse,
    isLoading,
    isFetched,
  } = useQuery<ApiResponse<Reservation[]>>({
    queryKey: ["user-reservations"],
    queryFn: fetchUserReservations,
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Reservations</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your hotel bookings
          </p>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <></>
          ) : (
            <>
              {initialReservationsResponse?.payload.map((reservation) => (
                <UserReservationCard
                  reservation={reservation}
                  key={reservation.id}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReservationHistory;
