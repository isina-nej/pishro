import { z } from "zod";

const investmentFundBaseSchema = z.object({
  key: z
    .string()
    .min(1, "شناسه الزامی است")
    .regex(/^[a-z0-9-]+$/, "شناسه فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد"),
  name: z.string().min(1, "نام صندوق الزامی است").max(200, "نام نباید بیشتر از ۲۰۰ کاراکتر باشد"),
  description: z.string().optional(),
  monthlyRate: z
    .number({ invalid_type_error: "نرخ سود باید عدد باشد" })
    .min(0, "نرخ سود نمی‌تواند منفی باشد")
    .max(1, "نرخ سود باید بین ۰ تا ۱ باشد (مثلاً ۰.۰۸ برای ۸٪)"),
  minDuration: z.number().int().min(1, "حداقل مدت باید حداقل ۱ ماه باشد"),
  maxDuration: z.number().int().min(1, "حداکثر مدت باید حداقل ۱ ماه باشد"),
  durationStep: z.number().int().min(1, "گام مدت باید حداقل ۱ باشد"),
  minAmount: z.number().int().min(1, "حداقل مبلغ باید بزرگ‌تر از صفر باشد"),
  maxAmount: z.number().int().min(1, "حداکثر مبلغ باید بزرگ‌تر از صفر باشد"),
  amountStep: z.number().int().min(1, "گام مبلغ باید حداقل ۱ باشد"),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const InvestmentFundCreateSchema = investmentFundBaseSchema
  .refine((d) => d.maxDuration >= d.minDuration, {
    message: "حداکثر مدت باید بزرگ‌تر یا مساوی حداقل مدت باشد",
    path: ["maxDuration"],
  })
  .refine((d) => d.maxAmount >= d.minAmount, {
    message: "حداکثر مبلغ باید بزرگ‌تر یا مساوی حداقل مبلغ باشد",
    path: ["maxAmount"],
  });

export const InvestmentFundUpdateSchema = investmentFundBaseSchema.partial();
