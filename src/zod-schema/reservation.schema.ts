import { z } from "zod";

export const ReservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits long"),
  checkInDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  checkOutDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  occupants: z
    .number()
    .min(1, "At least one guest is required")
    .max(20, "Maximum 20 guests allowed"),
});

export type ReservationSchemaType = z.infer<typeof ReservationSchema>;
