"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse, ReservationResponsePayload } from "@/types/api.types";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ManualReservationSchemaType,
  ManualReservationSchema,
} from "@/zod-schema/manual-reservation.schema";
import { DateRange, DayPicker } from "react-day-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ManualReservationFormProps {
  defaultRoomType?: string;
}

interface ManualReservationPayload {
  email: string;
  name: string;
  roomType: string;
  checkOutDate: string;
  occupants: number;
  creditCard: string;
  creditCardExpiry: string;
  creditCardCVV: string;
}

const ManualReservationForm: React.FC<ManualReservationFormProps> = ({
  defaultRoomType = "STANDARD",
}) => {
  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [checkOutTime, setCheckOutTime] = useState("12:00");
  const today = new Date();
  const queryClient = useQueryClient();

  const form = useForm<ManualReservationSchemaType>({
    resolver: zodResolver(ManualReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      roomType: defaultRoomType,
      checkOutDate: "",
      occupants: 1,
      creditCardNumber: "",
      creditCardExpiry: "",
      creditCardCVV: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ManualReservationPayload) => {
      setLoading(true);
      const response = await axiosAuth.post(
        "/reservations/checkin/manual",
        values
      );
      return response.data;
    },
    onSuccess: (data: ApiResponse<ReservationResponsePayload>) => {
      toast.success(data.message || "Reservation created successfully!");
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["clerk-reservations"],
      });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(
        error?.response?.data?.message || "Failed to create reservation"
      );
    },
    onSettled: () => setLoading(false),
  });

  useEffect(() => {
    if (checkOutDate) {
      const [checkOutHour, checkOutMinute] = checkOutTime.split(":");
      const checkOutDateTime = new Date(
        Date.UTC(
          checkOutDate.getFullYear(),
          checkOutDate.getMonth(),
          checkOutDate.getDate(),
          Number(checkOutHour),
          Number(checkOutMinute),
          0,
          0
        )
      ).toISOString();
      form.setValue("checkOutDate", checkOutDateTime);
    } else {
      form.setValue("checkOutDate", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOutDate, checkOutTime]);

  const onSubmit = (data: ManualReservationSchemaType) => {
    mutation.mutate({
      email: data.email,
      name: data.name,
      roomType: data.roomType,
      checkOutDate: data.checkOutDate,
      occupants: data.occupants,
      creditCard: data.creditCardNumber,
      creditCardExpiry: data.creditCardExpiry,
      creditCardCVV: data.creditCardCVV,
    });
  };

  return (
    <Card className="max-w-md w-full mt-8">
      <CardHeader>
        <CardTitle>Manual Reservation</CardTitle>
        <CardDescription>
          Fill in the details to add a reservation manually.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("Invalid", errors)
          )}
          className="space-y-4"
        >
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="customer@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      {...field}
                    >
                      <option value="STANDARD">STANDARD</option>
                      <option value="DELUXE">DELUXE</option>
                      <option value="SUITE">SUITE</option>
                      <option value="RESIDENTIAL_SUITE">
                        RESIDENTIAL_SUITE
                      </option>
                    </select>
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
                  <FormLabel>Occupants</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} step={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creditCardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="4111111111111111" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creditCardExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Card Expiry</FormLabel>
                  <FormControl>
                    <Input placeholder="12/27" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creditCardCVV"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Card CVV</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkOutDate"
              render={() => (
                <FormItem>
                  <FormLabel>Check-out Date</FormLabel>
                  <FormControl>
                    <DayPicker
                      mode="single"
                      disabled={{ before: today }}
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Check-out Time
              </label>
              <Input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-[120px]"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Add Reservation"}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default ManualReservationForm;
