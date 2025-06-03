export interface RoomCardProps {
  id: string;
  type: "STANDARD" | "DELUXE" | "SUITE" | "RESIDENTIAL_SUITE";
  name: string;
  description: string;
  image: string;
  price: number;
  maxOccupancy: number;
  amenities: string[];
  onClick?: (roomId: string) => void;
}
