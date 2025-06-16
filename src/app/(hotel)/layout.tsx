import CommonFooter from "@/components/common/CommonFooter";
import CommonHeader from "@/components/common/CommonHeader";

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CommonHeader />
      {children}
      <CommonFooter />
    </>
  );
}
