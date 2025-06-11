"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DateRange, DayPicker } from "react-day-picker";
import { MoveUp } from "lucide-react";
import {
  ReservationSchema,
  ReservationSchemaType,
} from "@/zod-schema/reservation.schema";
import { Select } from "@/components/ui/select";
import {
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";

const ROOM_TYPES = [
  { label: "Standard", value: "STANDARD" },
  { label: "Deluxe", value: "DELUXE" },
  { label: "Suite", value: "SUITE" },
];

const TravelCompanyBookingForm = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const today = new Date();

  const form = useForm({
    defaultValues: {
      roomType: "STANDARD",
      checkInDate: "",
      checkOutDate: "",
      occupants: 1,
      numberOfRooms: 3,
    },
  });

  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: async (payload: {
      roomType: string;
      checkInDate: string;
      checkOutDate: string;
      occupants: number;
      numberOfRooms: number;
    }) => {
      const res = await axiosAuth.post(
        "/reservations/travel-company-reservation",
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reservation successful!");
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Reservation failed");
    },
  });

  // Set check-in/check-out date fields when dateRange changes
  React.useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const checkInDateTime = new Date(
        Date.UTC(
          dateRange.from.getFullYear(),
          dateRange.from.getMonth(),
          dateRange.from.getDate(),
          14,
          0,
          0,
          0
        )
      ).toISOString();
      const checkOutDateTime = new Date(
        Date.UTC(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth(),
          dateRange.to.getDate(),
          12,
          0,
          0,
          0
        )
      ).toISOString();
      form.setValue("checkInDate", checkInDateTime);
      form.setValue("checkOutDate", checkOutDateTime);
    } else {
      form.setValue("checkInDate", "");
      form.setValue("checkOutDate", "");
    }
  }, [dateRange]);

  const onSubmit = (values: {
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    occupants: number;
    numberOfRooms: number;
  }) => {
    const payload = {
      roomType: values.roomType,
      checkInDate: values.checkInDate,
      checkOutDate: values.checkOutDate,
      occupants: Number(values.occupants),
      numberOfRooms: Number(values.numberOfRooms),
    };
    mutation.mutate(payload);
  };

  return (
    <Card className="max-w-md w-full mt-8">
      <CardHeader>
        <CardTitle>Travel Company Booking</CardTitle>
        <CardDescription>
          Fill in the details to book rooms at a discounted rate.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkInDate"
              render={() => (
                <FormItem>
                  <FormLabel>Check-in & Check-out Dates</FormLabel>
                  <FormControl>
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      required
                      disabled={{ before: today }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        field.onChange(Math.max(1, (field.value || 1) - 1))
                      }
                      aria-label="Decrease guests"
                    >
                      <MoveUp className="rotate-180" />
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        className="no-spinner text-center w-16"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                      onClick={() =>
                        field.onChange(Math.min(20, (field.value || 1) + 1))
                      }
                      aria-label="Increase guests"
                    >
                      <MoveUp />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfRooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Rooms</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        field.onChange(Math.max(3, (field.value || 3) - 1))
                      }
                      aria-label="Decrease rooms"
                    >
                      <MoveUp className="rotate-180" />
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        min={3}
                        max={20}
                        {...field}
                        className="no-spinner text-center w-16"
                        onChange={(e) =>
                          field.onChange(Math.max(3, Number(e.target.value)))
                        }
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                      onClick={() =>
                        field.onChange(Math.min(20, (field.value || 3) + 1))
                      }
                      aria-label="Increase rooms"
                    >
                      <MoveUp />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <div className="px-5 pb-5 mt-5">
            <Button
              className="w-full"
              type="submit"
              disabled={mutation.status === "pending"}
            >
              {mutation.status === "pending" ? "Booking..." : "Book"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default TravelCompanyBookingForm;
