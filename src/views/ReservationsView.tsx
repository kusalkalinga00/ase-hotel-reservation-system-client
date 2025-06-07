"use client";
import ReservationTable from "@/components/Tables/ReservationTable";
import React from "react";

const payload = [
  {
    id: "51d438d6-e2d7-43ad-85a3-c263c0649298",
    customerId: "6c32c046-ab02-46b4-9cb6-1f99eea215b8",
    roomId: "41771d3d-a878-473f-9653-55aa8bf66fc2",
    checkInDate: "2025-06-06T04:00:00.000Z",
    checkOutDate: "2025-06-13T11:30:00.000Z",
    status: "PENDING",
    occupants: 2,
    creditCard: "",
    creditCardExpiry: "",
    creditCardCVV: "",
    createdAt: "2025-06-06T17:43:04.092Z",
    updatedAt: "2025-06-06T18:13:36.946Z",
    room: {
      id: "41771d3d-a878-473f-9653-55aa8bf66fc2",
      number: "104",
      roomCategoryId: "0b0a85b7-9dd5-44df-ae1c-e332f705ba9a",
      status: "RESERVED",
    },
    customer: {
      id: "6c32c046-ab02-46b4-9cb6-1f99eea215b8",
      email: "customer1@test.com",
      password: "$2b$10$nKZ1Opf2q4ftC1dwabhr4eVybnYt3DuM.sdKgLnf88MLOpKooaiD2",
      name: "customer 1",
      role: "CUSTOMER",
      createdAt: "2025-06-04T09:15:49.781Z",
      updatedAt: "2025-06-06T22:25:00.255Z",
      refreshToken:
        "$2b$10$IMAKxKEEB6yidolM.NVN7O/pCzxPd9xdYB.XA3qlbRJHrU2/vyN0C",
    },
  },
  {
    id: "73a3fb83-d7f9-4ba0-8c59-77f4e748b9ce",
    customerId: "6c32c046-ab02-46b4-9cb6-1f99eea215b8",
    roomId: "20e9eeec-7239-4a5f-af6e-9d48faf077b9",
    checkInDate: "2025-06-24T11:00:00.000Z",
    checkOutDate: "2025-06-26T11:00:00.000Z",
    status: "PENDING",
    occupants: 2,
    creditCard: "1111222233334444",
    creditCardExpiry: "12/25",
    creditCardCVV: "123",
    createdAt: "2025-06-06T21:23:22.564Z",
    updatedAt: "2025-06-06T21:23:22.564Z",
    room: {
      id: "20e9eeec-7239-4a5f-af6e-9d48faf077b9",
      number: "105",
      roomCategoryId: "e450e4c1-b59a-47fb-a331-96a7abd795bf",
      status: "RESERVED",
    },
    customer: {
      id: "6c32c046-ab02-46b4-9cb6-1f99eea215b8",
      email: "customer1@test.com",
      password: "$2b$10$nKZ1Opf2q4ftC1dwabhr4eVybnYt3DuM.sdKgLnf88MLOpKooaiD2",
      name: "customer 1",
      role: "CUSTOMER",
      createdAt: "2025-06-04T09:15:49.781Z",
      updatedAt: "2025-06-06T22:25:00.255Z",
      refreshToken:
        "$2b$10$IMAKxKEEB6yidolM.NVN7O/pCzxPd9xdYB.XA3qlbRJHrU2/vyN0C",
    },
  },
];

const ReservationsView = () => {
  return (
    <div className="pt-10 px-5 w-full">
      <ReservationTable data={payload} />
    </div>
  );
};

export default ReservationsView;
