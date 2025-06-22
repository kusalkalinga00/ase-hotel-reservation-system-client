import { z } from "zod";
import valid from "card-validator";

export const ManualReservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  checkOutDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .refine((date) => !!date, {
      message: "Check-in and check-out dates are required",
    }),
  occupants: z
    .number()
    .min(1, "At least one guest is required")
    .max(20, "Maximum 20 guests allowed"),
  creditCardNumber: z.string().refine((val) => valid.number(val).isValid, {
    message: "Invalid credit card number",
  }),
  creditCardExpiry: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      "Invalid expiry date format (MM/YY)"
    ),
  creditCardCVV: z
    .string()
    .length(3, "CVV must be 3 digits long")
    .regex(/^\d+$/, "CVV must contain only digits"),
  roomType: z.string().min(1, "Room type is required"),
});

export type ManualReservationSchemaType = z.infer<
  typeof ManualReservationSchema
>;
