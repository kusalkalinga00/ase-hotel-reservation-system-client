export interface RoomCardProps {
  id: string;
  name: string;
  idealFor: string;
  capacity: number;
  size: string;
  bed: string;
  view: string;
  priceTier: string;
  price: number;
  image: string;
  description: string;
  amenities: string[];
  onClick?: (roomId: string) => void;
}
