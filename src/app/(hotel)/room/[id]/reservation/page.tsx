import ReservationView from "@/views/ReservationView";

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ReservationView roomId={id} />;
}
