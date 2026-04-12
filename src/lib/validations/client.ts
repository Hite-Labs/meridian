import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const createClientSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
});

export const updateClientSchema = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().nullable(),
    notes: z.string().trim().nullable(),
    goal: z.string().trim().nullable(),
    status: z.enum(["active", "graduated", "paused"]),
    modality: z.enum(["conscious", "subconscious", "both"]),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
