"use client";
import React, { useState } from "react";
import { Reservation } from "@/types/auth-payload.types";
import UserReservationCard from "@/components/UserReservations/UserReservationCard";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse } from "@/types/api.types";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";

const UserReservationHistory = () => {
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();

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
    enabled: !!session?.accessToken, // Only run if the user is authenticated
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
          ) : !initialReservationsResponse?.payload?.length ? (
            <div className="text-center text-muted-foreground py-12">
              You have no reservations.
            </div>
          ) : (
            <>
              {initialReservationsResponse.payload.map((reservation) =>
                session?.user?.role === "TRAVEL_COMPANY" ? (
                  <Card
                    key={reservation.id}
                    className="border-blue-400 bg-blue-50"
                  >
                    <CardContent className="py-6 flex flex-col gap-2">
                      <div className="font-semibold text-blue-900">
                        Status:{" "}
                        <span className="font-normal">
                          {reservation.status}
                        </span>
                      </div>
                      <div className="text-blue-900">
                        Check-in:{" "}
                        <span className="font-semibold">
                          {reservation.checkInDate
                            ? new Date(reservation.checkInDate).toLocaleString()
                            : "-"}
                        </span>
                      </div>
                      <div className="text-blue-900">
                        Check-out:{" "}
                        <span className="font-semibold">
                          {reservation.checkOutDate
                            ? new Date(
                                reservation.checkOutDate
                              ).toLocaleString()
                            : "-"}
                        </span>
                      </div>
                      <div className="text-blue-900">
                        Number of Rooms:{" "}
                        <span className="font-semibold">
                          {/* @ts-ignore */}
                          {reservation.numberOfRooms! ?? "-"}
                        </span>
                      </div>
                      <div className="text-blue-900">
                        Occupants:{" "}
                        <span className="font-semibold">
                          {reservation.occupants}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <UserReservationCard
                    reservation={reservation}
                    key={reservation.id}
                  />
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReservationHistory;
