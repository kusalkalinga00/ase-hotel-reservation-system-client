"use client";
import * as React from "react";
import {
  ColumnDef,
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
import { TravelCompanyReservation } from "@/types/travel-company-reservation.types";
import { Card, CardHeader } from "@/components/ui/card";
import ManageButtons from "./ManageButtons";

export const columns: ColumnDef<TravelCompanyReservation>[] = [
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
    header: "number of rooms",
    accessorKey: "numberOfRooms",
    cell: ({ row }) => row.original.numberOfRooms,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => row.original.status,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ManageButtons reservationId={row.original.id} />,
  },
];

interface RequestTableProps {
  data: TravelCompanyReservation[];
}

const RequestTable: React.FC<RequestTableProps> = (props) => {
  const { data } = props;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="p-4 w-full">
      <CardHeader className="p-0">
        <h2 className="text-lg font-semibold">Requests</h2>
        <p className="text-sm text-muted-foreground">
          Manage travel company requests.
        </p>
      </CardHeader>
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
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RequestTable;
