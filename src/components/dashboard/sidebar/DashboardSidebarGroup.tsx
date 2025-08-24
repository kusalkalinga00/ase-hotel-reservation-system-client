"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Book, Home, Shapes, Car } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardSidebarGroup = () => {
  const pathName = usePathname();
  const { data: session } = useSession();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={"Reservations"}
            className="flex items-center"
            asChild
            isActive={pathName === "/dashboard/reservations"}
          >
            <Link href={"/dashboard/reservations"}>
              <Home size={20} />
              Reservations
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={"Rooms"}
            className="flex items-center"
            asChild
            isActive={pathName === "/dashboard/rooms"}
          >
            <Link href={"/dashboard/rooms"}>
              <Book size={20} />
              Rooms Management
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={"Earnings"}
            className="flex items-center"
            asChild
            isActive={pathName === "/dashboard/earnings"}
          >
            <Link href={"/dashboard/earnings"}>
              <Shapes size={20} />
              Earnings
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={"Travel Companies"}
            className="flex items-center"
            asChild
            isActive={pathName === "/dashboard/travel-company"}
          >
            <Link href={"/dashboard/travel-company"}>
              <Car size={20} />
              Travel Companies
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {session?.user.role === "MANAGER" && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Manage Clerks"}
              className="flex items-center"
              asChild
              isActive={pathName === "/dashboard/manage-clerks"}
            >
              <Link href={"/dashboard/manage-clerks"}>
                <Car size={20} />
                Manage Clerks
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default DashboardSidebarGroup;
