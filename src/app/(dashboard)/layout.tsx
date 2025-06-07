
import DashBoardHeader from "@/components/dashboard/Header";
import { AppSidebar } from "@/components/dashboard/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="">
          <DashBoardHeader />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
