export interface ApiResponse<T> {
  message: string;
  success: boolean;
  payload: T;
  meta?: PaginationMeta | null;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
}

export interface ReservationResponsePayload {
  id: string;
  customerId: string;
  roomId: string;
  checkInDate: string; // ISO string
  checkOutDate: string; // ISO string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  occupants: number;
  creditCard: string;
  creditCardExpiry: string;
  creditCardCVV: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Room {
  id: string;
  number: string;
  roomCategoryId: string;
  status: string;
}

export interface Customer {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  refreshToken: string;
}

export interface ClerkReservation {
  id: string;
  customerId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  occupants: number;
  creditCard: string;
  creditCardExpiry: string;
  creditCardCVV: string;
  createdAt: string;
  updatedAt: string;
  room: Room;
  customer: Customer;
}

export interface ClerkReservationsResponsePayload
  extends Array<ClerkReservation> {}
