import { z } from "zod";

export const CreditCardSchema = z.object({
  creditCardNumber: z
    .string()
    .length(16, "Credit card number must be 16 digits long")
    .regex(/^\d+$/, "Credit card number must contain only digits"),
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
});

export type CreditCardSchemaType = z.infer<typeof CreditCardSchema>;
