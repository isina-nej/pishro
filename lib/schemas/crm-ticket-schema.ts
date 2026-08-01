// @/lib/schemas/crm-ticket-schema.ts
// اعتبارسنجی فرم‌های تیکت پشتیبانی (ماژول CRM)
import { z } from "zod";

export const TICKET_STATUS_VALUES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_ON_CUSTOMER",
  "RESOLVED",
  "CLOSED",
] as const;

export const TICKET_PRIORITY_VALUES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

export const TicketCreateSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "موضوع تیکت الزامی است")
    .max(200, "موضوع نباید بیشتر از 200 کاراکتر باشد"),
  description: z
    .string()
    .trim()
    .min(1, "توضیحات تیکت الزامی است")
    .max(5000, "توضیحات نباید بیشتر از 5000 کاراکتر باشد"),
  priority: z.enum(TICKET_PRIORITY_VALUES).optional(),
  status: z.enum(TICKET_STATUS_VALUES).optional(),
  customerId: z.string().optional().nullable(),
  customerPhone: z.string().trim().max(20).optional().nullable(),
  assignedToId: z.string().optional().nullable(),
});

export const TicketUpdateSchema = TicketCreateSchema.partial();

export const TicketActivityCreateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "متن یادداشت الزامی است")
    .max(5000, "متن یادداشت نباید بیشتر از 5000 کاراکتر باشد"),
  type: z
    .enum(["NOTE", "CALL", "EMAIL", "MEETING", "STATUS_CHANGE", "SYSTEM"])
    .optional(),
});

export type TicketCreateInput = z.infer<typeof TicketCreateSchema>;
export type TicketUpdateInput = z.infer<typeof TicketUpdateSchema>;
export type TicketActivityCreateInput = z.infer<typeof TicketActivityCreateSchema>;
