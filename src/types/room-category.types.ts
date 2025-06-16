export interface Room {
  id: string;
  number: string;
  roomCategoryId: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
}

export interface RoomCategory {
  id: string;
  name: string;
  idealFor: string;
  capacity: number;
  size: string;
  bed: string;
  view: string;
  priceTier: string;
  price: number;
  description: string;
  image: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
  rooms: Room[];
}
