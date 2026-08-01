import { z } from "zod";

/**
 * Zod schemas for the CRM Customers module (customer-360 activity notes,
 * customer tags). Follows the pattern in lib/schemas/course-management-schema.ts:
 * Persian inline validation messages, shared sub-schemas factored out.
 */

export const AddCustomerActivitySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "متن یادداشت الزامی است")
    .max(4000, "متن یادداشت نباید بیشتر از 4000 کاراکتر باشد"),
});

export type AddCustomerActivityInput = z.infer<typeof AddCustomerActivitySchema>;

const tagColorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "کد رنگ باید به‌صورت هگز باشد (مثل #22c55e)")
  .optional()
  .nullable();

export const CreateCustomerTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام برچسب الزامی است")
    .max(50, "نام برچسب نباید بیشتر از 50 کاراکتر باشد"),
  color: tagColorSchema,
});

export type CreateCustomerTagInput = z.infer<typeof CreateCustomerTagSchema>;

export const AssignCustomerTagSchema = z.object({
  tagId: z.string().trim().min(1, "شناسه برچسب الزامی است"),
});

export type AssignCustomerTagInput = z.infer<typeof AssignCustomerTagSchema>;
