import { Room } from "./api.types";

export interface TravelCompanyReservation {
  id: string;
  customerId: string;
  roomId: string | null;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  occupants: number;
  numberOfRooms: number;
  creditCard: string | null;
  creditCardExpiry: string | null;
  creditCardCVV: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    refreshToken: string;
  };
  room: Room | null;
}

export type TravelCompanyReservationList = TravelCompanyReservation[];
