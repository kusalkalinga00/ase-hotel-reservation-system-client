"use client";
import * as React from "react";
import {
  ColumnDef,
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
import { Room } from "@/types/api.types";
import { Card } from "@/components/ui/card";
import DeletRoom from "@/components/roomManagePage/DeletRoom";
import RoomType from "./RoomType";

export const columns: ColumnDef<Room>[] = [
  {
    header: "Room Number",
    accessorKey: "number",
    cell: ({ row }: { row: { original: Room } }) => row.original.number,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      const room = row.original.roomCategoryId;
      return <RoomType roomCategoryId={room} />;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }: { row: { original: Room } }) => row.original.status,
  },
  {
    header: "Manage",
    accessorKey: "id",
    cell: ({ row }: { row: { original: Room } }) => {
      const roomId = row.original.id;
      return <DeletRoom roomId={roomId} />;
    },
  },
];

interface RoomsTableProps {
  rooms: Room[];
}

const RoomsTable = ({ rooms }: RoomsTableProps) => {
  const table = useReactTable<Room>({
    data: rooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card className="p-4 w-full">
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
                No rooms found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RoomsTable;
