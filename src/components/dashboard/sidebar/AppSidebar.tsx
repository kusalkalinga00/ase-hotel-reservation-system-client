import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import DashboardSidebarGroup from "@/components/dashboard/sidebar/DashboardSidebarGroup";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="border p-2 border-slate-300 rounded-md">
          <h1 className="text-sm font-semibold">Saltbay Lounge Admin Pannel</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <DashboardSidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
