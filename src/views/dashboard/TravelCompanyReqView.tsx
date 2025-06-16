"use client";

import RequestTable from "@/components/TravelCompany/RequestTable";
import { useQuery } from "@tanstack/react-query";
import { TravelCompanyReservationList } from "@/types/travel-company-reservation.types";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";

const TravelCompanyReqView = () => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const { data, isLoading, isError } = useQuery<TravelCompanyReservationList>({
    queryKey: ["travel-company-reservations"],
    queryFn: async () => {
      const res = await axiosAuth.get("/reservations/travel-company");
      return res.data.payload;
    },
    enabled: !!session?.accessToken, // Only run if the user is authenticated
  });

  return (
    <div className="min-h-screen px-5 pt-5">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading reservations.</div>
      ) : (
        <RequestTable data={data || []} />
      )}
    </div>
  );
};

export default TravelCompanyReqView;
