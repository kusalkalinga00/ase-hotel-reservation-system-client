import RoomView from "@/views/clientside/RoomView";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <RoomView roomCategoryId={id} />;
}
