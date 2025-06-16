"use client";
import { useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse, ReservationResponsePayload } from "@/types/api.types";
import { AxiosError } from "axios";

interface ManualReservationFormProps {
  defaultRoomType?: string;
}

interface ManualReservationPayload {
  email: string;
  roomType: string;
  checkInDate: string;
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualReservationPayload>({
    defaultValues: {
      email: "",
      roomType: defaultRoomType,
      checkInDate: "",
      checkOutDate: "",
      occupants: 1,
      creditCard: "",
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
      reset();
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(
        error?.response?.data?.message || "Failed to create reservation"
      );
    },
    onSettled: () => setLoading(false),
  });

  return (
    <Card className="max-w-md w-full mt-8">
      <CardHeader>
        <CardTitle>Manual Reservation</CardTitle>
        <CardDescription>
          Fill in the details to add a reservation manually.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="space-y-4"
      >
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              {...register("email", { required: true })}
              placeholder="customer@example.com"
            />
            {errors.email && (
              <span className="text-xs text-red-500">Email is required</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <select
              {...register("roomType", { required: true })}
              className="w-full border rounded px-3 py-2 text-sm"
              defaultValue={defaultRoomType}
            >
              <option value="STANDARD">STANDARD</option>
              <option value="DELUXE">DELUXE</option>
              <option value="SUITE">SUITE</option>
              <option value="RESIDENTIAL_SUITE">RESIDENTIAL_SUITE</option>
            </select>
            {errors.roomType && (
              <span className="text-xs text-red-500">
                Room type is required
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Check-in Date (UTC ISO)
            </label>
            <Input
              type="datetime-local"
              {...register("checkInDate", { required: true })}
              onChange={(e) => {
                // Convert local datetime to UTC ISO string
                const val = e.target.value;
                if (val) {
                  const date = new Date(val);
                  // Set time to 14:00 UTC for check-in
                  date.setUTCHours(14, 0, 0, 0);
                  const iso = date.toISOString();

                  register("checkInDate").onChange({ target: { value: iso } });
                }
              }}
            />
            {errors.checkInDate && (
              <span className="text-xs text-red-500">
                Check-in date is required
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Check-out Date (UTC ISO)
            </label>
            <Input
              type="datetime-local"
              {...register("checkOutDate", { required: true })}
              onChange={(e) => {
                // Convert local datetime to UTC ISO string
                const val = e.target.value;
                if (val) {
                  const date = new Date(val);
                  // Set time to 12:00 UTC for check-out
                  date.setUTCHours(12, 0, 0, 0);
                  const iso = date.toISOString();
                  // Manually set value in form

                  register("checkOutDate").onChange({ target: { value: iso } });
                }
              }}
            />
            {errors.checkOutDate && (
              <span className="text-xs text-red-500">
                Check-out date is required
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Occupants</label>
            <Input
              type="number"
              min={1}
              step={1}
              {...register("occupants", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
            />
            {errors.occupants && (
              <span className="text-xs text-red-500">At least 1 occupant</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Credit Card Number
            </label>
            <Input
              {...register("creditCard", { required: true })}
              placeholder="4111111111111111"
            />
            {errors.creditCard && (
              <span className="text-xs text-red-500">
                Credit card is required
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Credit Card Expiry
            </label>
            <Input
              {...register("creditCardExpiry", { required: true })}
              placeholder="12/27"
            />
            {errors.creditCardExpiry && (
              <span className="text-xs text-red-500">Expiry is required</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Credit Card CVV
            </label>
            <Input
              {...register("creditCardCVV", { required: true })}
              placeholder="123"
            />
            {errors.creditCardCVV && (
              <span className="text-xs text-red-500">CVV is required</span>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Add Reservation"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};

export default ManualReservationForm;
