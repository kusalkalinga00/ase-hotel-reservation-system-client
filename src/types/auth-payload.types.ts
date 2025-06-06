export interface AuthPayload {
  token: string;
  refreshToken: string;
  user: IUser;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  number: string;
  roomCategoryId: string;
  status: string;
}

export interface Reservation {
  id: string;
  customerId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  occupants: number;
  creditCard: string | null;
  creditCardExpiry: string | null;
  creditCardCVV: string | null;
  createdAt: string;
  updatedAt: string;
  room: Room;
}
