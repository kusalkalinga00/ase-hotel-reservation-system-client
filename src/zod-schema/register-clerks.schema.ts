import { z } from "zod";

export const RegisterClerksSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type RegisterUserSchemaType = z.infer<typeof RegisterClerksSchema>;
