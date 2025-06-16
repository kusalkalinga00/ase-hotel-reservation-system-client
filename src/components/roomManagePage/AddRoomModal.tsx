"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api.types";
import { RoomCategory } from "@/types/room-category.types";

const addRoomSchema = z.object({
  number: z
    .string()
    .min(1, "Room number is required")
    .regex(/^\d+$/, "Room number must be numeric"),
  roomCategoryId: z.string().min(1, "Room type is required"),
});
type AddRoomSchemaType = z.infer<typeof addRoomSchema>;

const AddRoomModal = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    axiosAuth.get("/room-categories").then((res) => {
      setCategories(res.data.payload || []);
    });
  }, [axiosAuth]);

  const form = useForm<AddRoomSchemaType>({
    resolver: zodResolver(addRoomSchema),
    defaultValues: {
      number: "",
      roomCategoryId: "",
    },
  });

  const addRoomMutation = useMutation({
    mutationFn: async (values: AddRoomSchemaType) => {
      await axiosAuth.post("/rooms", {
        number: values.number,
        roomCategoryId: values.roomCategoryId,
        status: "AVAILABLE",
      });
    },
    onSuccess: () => {
      toast.success("Room added successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setOpen(false);
      form.reset();
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      console.log("Error updating team", error);
      toast.error(error.response?.data.message || "An error occurred");
    },
  });

  const handleSubmit = (values: AddRoomSchemaType) => {
    addRoomMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter room number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomModal;
