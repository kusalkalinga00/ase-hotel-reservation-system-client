import { z } from "zod";

export const RegisterUserSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Attach error to confirmPassword field
  });

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;
