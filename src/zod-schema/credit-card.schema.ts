import { z } from "zod";
import valid from "card-validator";

export const CreditCardSchema = z.object({
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
});

export type CreditCardSchemaType = z.infer<typeof CreditCardSchema>;
