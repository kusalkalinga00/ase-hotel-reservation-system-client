"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  DoorOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/api.types";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

interface StatusBreakdown {
  PENDING: number;
  CONFIRMED: number;
  CANCELLED: number;
  CHECKED_IN: number;
  CHECKED_OUT: number;
}

interface TravelCompanyData {
  totalReservations: number;
  totalRooms: number;
  revenue: number;
  pendingAmount: number;
  statusBreakdown: StatusBreakdown;
}

interface ManagerSummaryReport {
  period: string;
  startDate: string;
  endDate: string;
  totalReservations: number;
  cancelledCount: number;
  checkedInCount: number;
  checkedOutCount: number;
  totalRooms: number;
  roomStatusCounts: Record<string, number>;
  totalRevenue: number;
  travelCompanyData: TravelCompanyData;
}

const WarningAlert = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg mx-auto text-center">
    <strong className="font-bold block mb-1">{title}</strong>
    <span className="block sm:inline">{description}</span>
  </div>
);

const EarningsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "monthly">(
    "monthly"
  );
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();

  const {
    data: reportData,
    isLoading,
    isError,
  } = useQuery<ApiResponse<ManagerSummaryReport>>({
    queryKey: ["manager-summary", selectedPeriod],
    queryFn: async () => {
      const res = await axiosAuth.get(
        `/reports/manager-summary?period=${selectedPeriod}`
      );
      return res.data;
    },
    enabled: session?.user?.role === "MANAGER" && !!session?.accessToken, // Only run if the user is a manager and authenticated
  });

  // Download PDF handler
  const handleDownloadPDF = async () => {
    try {
      const res = await axiosAuth.get(
        `/reports/manager-summary/pdf?period=${selectedPeriod}`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      saveAs(blob, `manager-summary-${selectedPeriod}.pdf`);
    } catch (err) {
      console.error("Failed to download PDF report:", err);
      alert("Failed to download PDF report.");
    }
  };

  if (session?.user?.role !== "MANAGER") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WarningAlert
          title="Access Denied"
          description="You do not have permission to view this page."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-slate-400" />
      </div>
    );
  }

  if (isError || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WarningAlert
          title="Error"
          description="Failed to load manager summary report."
        />
      </div>
    );
  }

  const data = reportData.payload;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 border-green-200";
      case "OCCUPIED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MAINTENANCE":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "RESERVED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-gray-600 mt-1">
                {formatDate(data.startDate)} - {formatDate(data.endDate)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select
                value={selectedPeriod}
                onValueChange={(value: "daily" | "monthly") =>
                  setSelectedPeriod(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleDownloadPDF}
                className="ml-4 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition "
              >
                Download PDF
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reservations
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalReservations}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPeriod === "monthly" ? "This month" : "Today"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Rooms
                </CardTitle>
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalRooms}</div>
                <p className="text-xs text-muted-foreground">Available rooms</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPeriod === "monthly"
                    ? "Monthly total"
                    : "Daily total"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Occupancy Rate
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (data.roomStatusCounts.OCCUPIED / data.totalRooms) * 100
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Current occupancy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reservation Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Status</CardTitle>
                <CardDescription>
                  Breakdown of reservation activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Checked In</span>
                  </div>
                  <Badge variant="secondary">{data.checkedInCount}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Checked Out</span>
                  </div>
                  <Badge variant="secondary">{data.checkedOutCount}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Cancelled</span>
                  </div>
                  <Badge variant="secondary">{data.cancelledCount}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Status</CardTitle>
                <CardDescription>Current status of all rooms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(data.roomStatusCounts).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status === "AVAILABLE"
                              ? "bg-green-500"
                              : status === "OCCUPIED"
                              ? "bg-blue-500"
                              : status === "MAINTENANCE"
                              ? "bg-orange-500"
                              : "bg-purple-500"
                          }`}
                        />
                        <span className="text-sm font-medium capitalize">
                          {status.toLowerCase()}
                        </span>
                      </div>
                      <Badge className={getRoomStatusColor(status)}>
                        {count}
                      </Badge>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>

          {/* Travel Company Data */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Travel Companies Statistics</CardTitle>
                <CardDescription>
                  Overview of travel companies reservations and revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="space-y-1 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {data.travelCompanyData.totalReservations}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Reservations
                    </p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(data.travelCompanyData.revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(data.travelCompanyData.pendingAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pending Amount
                    </p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {data.travelCompanyData.totalRooms}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Rooms</p>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-4">Status Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(data.travelCompanyData.statusBreakdown).map(
                      ([status, count]) => (
                        <div key={status} className="text-center space-y-1">
                          <p className="text-lg font-semibold">{count}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {status.toLowerCase().replace("_", " ")}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Period Summary</CardTitle>
                <CardDescription>
                  Overview for {selectedPeriod} period from{" "}
                  {formatDate(data.startDate)} to {formatDate(data.endDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-blue-600">
                      {data.totalReservations}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Reservations
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-green-600">
                      {data.roomStatusCounts.AVAILABLE}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Available Rooms
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-orange-600">
                      {data.roomStatusCounts.OCCUPIED}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Occupied Rooms
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(data.totalRevenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Revenue
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsView;
