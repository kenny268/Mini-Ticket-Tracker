import { z } from "zod"

export const ticketStatusSchema = z.enum(["open", "in_progress", "closed"])
export const ticketPrioritySchema = z.enum(["low", "medium", "high"])

export const ticketCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(5000, "Description must be 5000 characters or fewer."),
  priority: ticketPrioritySchema,
})

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
})

export type TicketCreateValues = z.infer<typeof ticketCreateSchema>
export type LoginValues = z.infer<typeof loginSchema>
