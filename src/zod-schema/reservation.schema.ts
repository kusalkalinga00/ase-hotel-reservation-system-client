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
  creditCardNumber: z
    .string()
    .length(16, "Credit card number must be 16 digits long")
    .regex(/^\d+$/, "Credit card number must contain only digits")
    .optional(),
  creditCardExpiry: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      "Invalid expiry date format (MM/YY)"
    )
    .optional(),
  creditCardCVV: z
    .string()
    .length(3, "CVV must be 3 digits long")
    .regex(/^\d+$/, "CVV must contain only digits")
    .optional(),
});

export type ReservationSchemaType = z.infer<typeof ReservationSchema>;
