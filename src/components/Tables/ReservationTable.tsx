"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { useState, useMemo, useCallback } from "react";
import { ClerkReservation } from "@/types/api.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ReservationManageModal from "./ReservationManageModal";

// Helper function to format date - memoized to avoid recalculation
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getUTCDate().toString().padStart(2, "0")}/${(
    date.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getUTCFullYear()}, ${date
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
};

// Helper function for name filtering
const nameFilterFn = (row: any, columnId: string, filterValue: string) => {
  return row.original.customer.name
    .toLowerCase()
    .includes(filterValue.toLowerCase());
};

export const columns: ColumnDef<ClerkReservation>[] = [
  {
    header: "Customer Name",
    accessorKey: "customerName",
    cell: ({ row }) => row.original.customer.name,
    filterFn: nameFilterFn,
  },
  {
    header: "Occupancy",
    accessorKey: "occupants",
    cell: ({ row }) => row.original.occupants,
  },
  {
    header: "Credit Card",
    accessorKey: "creditCard",
    cell: ({ row }) => {
      // Mask all but last 4 digits
      const cc = row.original.creditCard;
      return cc ? `**** **** **** ${cc.slice(-4)}` : "";
    },
  },
  {
    header: "Check-In Date",
    accessorKey: "checkInDate",
    cell: ({ row }) => formatDate(row.original.checkInDate),
  },
  {
    header: "Check-Out Date",
    accessorKey: "checkOutDate",
    cell: ({ row }) => formatDate(row.original.checkOutDate),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => row.original.status,
  },
  {
    header: "Manage",
    id: "manage",
    cell: ({ row }) => (
      <ReservationManageModal
        reservationId={row.original.id}
        checkOutDate={row.original.checkOutDate}
        rate={row.original.room.roomRate || 0}
      />
    ),
  },
];

interface ReservationTableProps {
  data: ClerkReservation[];
}

const RESERVATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "NO_SHOW",
];

const ReservationTable: React.FC<ReservationTableProps> = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Memoize filtered data to avoid recalculation on every render
  const filteredData = useMemo(() => {
    return data.filter(
      (reservation) => reservation.customer?.role !== "TRAVEL_COMPANY"
    );
  }, [data]);

  // Memoize table configuration
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  });

  // Memoize filter handlers to avoid recreating on every render
  const handleStatusFilterChange = useCallback(
    (value: string) => {
      table
        .getColumn("status")
        ?.setFilterValue(value === "all" ? undefined : value);
    },
    [table]
  );

  const handleNameFilterChange = useCallback(
    (value: string) => {
      table.getColumn("customerName")?.setFilterValue(value || undefined);
    },
    [table]
  );

  return (
    <Card className="p-4 w-full">
      <div className="mb-4 flex items-center gap-4">
        <Label>Filter by Status:</Label>
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {RESERVATION_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Name search input */}
        <Label htmlFor="name-search">Search by Name:</Label>
        <input
          id="name-search"
          type="text"
          className="border rounded px-2 py-1"
          placeholder="Enter customer name"
          value={
            (table.getColumn("customerName")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) => handleNameFilterChange(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No reservations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ReservationTable;
