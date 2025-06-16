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
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import DeletRoom from "@/components/roomManagePage/DeletRoom";

interface RoomCategory {
  id: string;
  name: string;
}

export const columns: ColumnDef<Room>[] = [
  {
    header: "Room Number",
    accessorKey: "number",
    cell: ({ row }) => row.original.number,
  },
  {
    header: "Type",
    accessorKey: "type",
    // cell: ({ row, table }) => {
    //   const roomCategories: RoomCategory[] =
    //     table.options.meta?.roomCategories || [];
    //   const category = roomCategories.find(
    //     (cat) => cat.id === row.original.roomCategoryId
    //   );
    //   return category ? category.name : row.original.roomCategoryId;
    // },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => row.original.status,
  },
  {
    header: "Manage",
    accessorKey: "id",
    cell: ({ row }) => {
      const roomId = row.original.id;
      return <DeletRoom roomId={roomId} />;
    },
  },
];

interface RoomsTableProps {
  rooms: Room[];
}

const RoomsTable = ({ rooms }: RoomsTableProps) => {
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
  const axiosAuth = useAxiosAuth();

  useEffect(() => {
    axiosAuth.get("/room-categories").then((res) => {
      setRoomCategories(res.data.payload || []);
    });
  }, [axiosAuth]);

  const table = useReactTable({
    data: rooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: { roomCategories },
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
