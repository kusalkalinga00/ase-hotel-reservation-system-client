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
import { Room } from "@/types/api.types";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface RoomCategory {
  id: string;
  name: string;
}

interface RoomsTableMeta {
  roomCategories: RoomCategory[];
}

export const columns: ColumnDef<Room>[] = [
  {
    header: "Room Number",
    accessorKey: "number",
    cell: ({ row }: { row: any }) => row.original.number,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row, table }: { row: any; table: any }) => {
      const roomCategories: RoomCategory[] =
        table.options.meta?.roomCategories || [];
      const category = roomCategories.find(
        (cat) => cat.id === row.original.roomCategoryId
      );
      return category ? category.name : row.original.roomCategoryId;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }: { row: any }) => row.original.status,
  },
  {
    header: "Manage",
    accessorKey: "id",
    cell: ({ row }: { row: any }) => {
      const roomId = row.original.id;
      return (
        <div className="flex justify-center">
          <Button
            variant="destructive"
            onClick={() => {
              console.log(`Manage room with ID: ${roomId}`);
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

interface RoomsTableProps {
  rooms: Room[];
}

const RoomsTable = ({ rooms }: RoomsTableProps) => {
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
  const axiosAuth = useAxiosAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    axiosAuth.get("/room-categories").then((res) => {
      setRoomCategories(res.data.payload || []);
    });
  }, [axiosAuth]);

  const handleDelete = async (roomId: string) => {
    setDeletingId(roomId);
    try {
      await axiosAuth.delete(`/room-categories/${roomId}`);
      setRoomCategories((prev) => prev.filter((cat) => cat.id !== roomId));
      // Optionally, you may want to refetch rooms or show a toast
    } catch (err) {
      // Optionally, show error toast
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const table = useReactTable({
    data: rooms,
    columns: columns.map((col) => {
      if (col.header === "Manage") {
        return {
          ...col,
          cell: ({ row }: { row: any }) => {
            const roomId = row.original.id;
            return (
              <div className="flex justify-center">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(roomId)}
                  disabled={deletingId === roomId}
                >
                  {deletingId === roomId ? "Deleting..." : "Delete"}
                </Button>
              </div>
            );
          },
        };
      }
      return col;
    }),
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
