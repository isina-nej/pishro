// @/lib/schemas/crm-deal-schema.ts
// اسکیمای اعتبارسنجی برای فرصت‌های فروش (Deals) و مراحل پایپ‌لاین فروش CRM
import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(1, "عنوان الزامی است")
  .max(200, "عنوان نباید بیشتر از 200 کاراکتر باشد");

export const DealCreateSchema = z.object({
  title: titleSchema,
  amount: z
    .number()
    .int("مبلغ باید عدد صحیح باشد")
    .min(0, "مبلغ باید نامنفی باشد")
    .max(2147483647, "مبلغ نمی‌تواند بیشتر از 2,147,483,647 باشد")
    .optional()
    .nullable(),
  stageId: z.string().min(1, "مرحله پایپ‌لاین الزامی است"),
  leadId: z.string().trim().min(1).optional().nullable(),
  customerId: z.string().trim().min(1).optional().nullable(),
  ownerAdminId: z.string().trim().min(1).optional().nullable(),
  expectedCloseDate: z.coerce.date().optional().nullable(),
});

export const DealUpdateSchema = DealCreateSchema.partial();

/**
 * پیلود مخصوص جابجایی کارت در بورد کانبان — سبک و بدون نیاز به کل دیل
 */
export const DealStageMoveSchema = z.object({
  stageId: z.string().min(1, "مرحله پایپ‌لاین الزامی است"),
});

export const ActivityTypeEnum = z.enum([
  "NOTE",
  "CALL",
  "EMAIL",
  "MEETING",
  "STATUS_CHANGE",
  "SYSTEM",
]);

export const DealActivityCreateSchema = z.object({
  type: ActivityTypeEnum.default("NOTE"),
  content: z
    .string()
    .trim()
    .min(1, "متن فعالیت الزامی است")
    .max(5000, "متن فعالیت نباید بیشتر از 5000 کاراکتر باشد"),
});

export const PipelineStageCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام مرحله الزامی است")
    .max(100, "نام مرحله نباید بیشتر از 100 کاراکتر باشد"),
  order: z.number().int("ترتیب باید عدد صحیح باشد").positive("ترتیب باید عدد مثبت باشد"),
  color: z.string().trim().max(30).optional().nullable(),
  isWon: z.boolean().optional(),
  isLost: z.boolean().optional(),
});
