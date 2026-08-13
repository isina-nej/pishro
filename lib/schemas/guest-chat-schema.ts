import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(10, "شماره تماس معتبر نیست")
  .max(20, "شماره تماس معتبر نیست")
  .regex(/^[0-9+\-\s()]+$/, "شماره تماس معتبر نیست");

export const GuestChatStartSchema = z.object({
  firstName: z.string().trim().min(2, "نام را وارد کنید").max(60),
  lastName: z.string().trim().min(2, "نام خانوادگی را وارد کنید").max(60),
  phone: phoneSchema,
  topic: z.string().trim().max(80).optional().nullable(),
  message: z.string().trim().min(1, "پیام را بنویسید").max(2000).optional(),
});

export const GuestChatMessageSchema = z.object({
  body: z.string().trim().min(1, "پیام خالی است").max(2000),
  visitorToken: z.string().min(10),
});

export const AdminGuestChatMessageSchema = z.object({
  body: z.string().trim().min(1, "پیام خالی است").max(2000),
});

export const AdminGuestChatStatusSchema = z.object({
  status: z.enum(["OPEN", "ACTIVE", "CLOSED"]),
});
