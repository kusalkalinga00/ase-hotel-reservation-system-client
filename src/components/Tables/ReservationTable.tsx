"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ClerkReservation } from "@/types/api.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ReservationManageModal from "./ReservationManageModal";

export const columns: ColumnDef<ClerkReservation>[] = [
  {
    header: "Customer Name",
    accessorKey: "customerName",
    cell: ({ row }) => row.original.customer.name,
    filterFn: (row, columnId, filterValue) => {
      return row.original.customer.name
        .toLowerCase()
        .includes((filterValue as string).toLowerCase());
    },
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
    cell: ({ row }) =>
      new Date(row.original.checkInDate).toLocaleDateString("en-GB"),
  },
  {
    header: "Check-Out Date",
    accessorKey: "checkOutDate",
    cell: ({ row }) =>
      new Date(row.original.checkOutDate).toLocaleDateString("en-GB"),
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
        currentStatus="PENDING"
        reservationId={row.original.id}
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

const ReservationTable: React.FC<ReservationTableProps> = (props) => {
  const { data } = props;
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <Card className="p-4 w-full">
      <div className="mb-4 flex items-center gap-4">
        <Label>Filter by Status:</Label>
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) =>
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
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
          onChange={(e) =>
            table
              .getColumn("customerName")
              ?.setFilterValue(e.target.value || undefined)
          }
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
