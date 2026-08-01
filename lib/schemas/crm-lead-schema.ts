// @/lib/schemas/crm-lead-schema.ts
// اسکیمای اعتبارسنجی سرنخ‌ها (Leads) در ماژول CRM
import { z } from "zod";

export const LEAD_SOURCES = [
  "WEBSITE",
  "REFERRAL",
  "ADS",
  "SOCIAL",
  "PHONE",
  "OTHER",
] as const;

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
] as const;

const phoneSchema = z
  .string()
  .trim()
  .min(1, "شماره تماس الزامی است")
  .regex(/^09\d{9}$/, "شماره تماس باید ۱۱ رقمی و با ۰۹ شروع شود");

/**
 * اسکیمای ایجاد سرنخ جدید
 */
export const LeadCreateSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(100, "نام نباید بیشتر از ۱۰۰ کاراکتر باشد")
    .optional()
    .nullable(),
  lastName: z
    .string()
    .trim()
    .max(100, "نام خانوادگی نباید بیشتر از ۱۰۰ کاراکتر باشد")
    .optional()
    .nullable(),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .email("نشانی ایمیل نامعتبر است")
    .optional()
    .nullable()
    .or(z.literal("")),
  source: z.enum(LEAD_SOURCES).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  score: z.number().int().min(0).max(100).optional().nullable(),
  notes: z
    .string()
    .max(5000, "یادداشت نباید بیشتر از ۵۰۰۰ کاراکتر باشد")
    .optional()
    .nullable(),
  assignedToId: z.string().optional().nullable(),
});

export const LeadUpdateSchema = LeadCreateSchema.partial();

/**
 * اسکیمای افزودن یادداشت/فعالیت برای یک سرنخ
 */
export const LeadActivityCreateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "متن یادداشت الزامی است")
    .max(5000, "یادداشت نباید بیشتر از ۵۰۰۰ کاراکتر باشد"),
  type: z
    .enum(["NOTE", "CALL", "EMAIL", "MEETING", "STATUS_CHANGE", "SYSTEM"])
    .optional(),
});

/**
 * اسکیمای تبدیل سرنخ به فرصت فروش (Deal)
 */
export const LeadConvertSchema = z.object({
  title: z.string().trim().max(200).optional(),
  linkExistingCustomer: z.boolean().optional(),
});

export type LeadCreateInput = z.infer<typeof LeadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof LeadUpdateSchema>;
export type LeadActivityCreateInput = z.infer<typeof LeadActivityCreateSchema>;
export type LeadConvertInput = z.infer<typeof LeadConvertSchema>;
