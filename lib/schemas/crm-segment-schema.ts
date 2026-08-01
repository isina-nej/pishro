import { z } from "zod";

/**
 * Zod schemas for CRM Customer Segments. CustomerSegment.rules (see
 * prisma/schema.prisma) is a JSON rule-set evaluated at read-time against
 * User/Order/Transaction — not a materialized membership table — so this
 * schema is also the contract for what a "rule" can express.
 */

export const SegmentRulesSchema = z.object({
  minSpend: z
    .number()
    .int("حداقل مبلغ خرید باید عدد صحیح باشد")
    .min(0, "حداقل مبلغ خرید باید عدد نامنفی باشد")
    .nullable()
    .optional(),
  tagIds: z.array(z.string()).optional().default([]),
  phoneVerified: z.boolean().nullable().optional(),
  role: z.enum(["USER", "ADMIN"]).nullable().optional(),
  joinedAfter: z.string().trim().nullable().optional(),
  joinedBefore: z.string().trim().nullable().optional(),
});

export type SegmentRulesInput = z.infer<typeof SegmentRulesSchema>;

export const CreateCustomerSegmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام سگمنت الزامی است")
    .max(100, "نام سگمنت نباید بیشتر از 100 کاراکتر باشد"),
  description: z
    .string()
    .trim()
    .max(500, "توضیحات نباید بیشتر از 500 کاراکتر باشد")
    .optional()
    .nullable(),
  rules: SegmentRulesSchema,
});

export type CreateCustomerSegmentInput = z.infer<typeof CreateCustomerSegmentSchema>;

export const UpdateCustomerSegmentSchema = CreateCustomerSegmentSchema.partial();

export type UpdateCustomerSegmentInput = z.infer<typeof UpdateCustomerSegmentSchema>;
