import { z } from "zod";

export const newsletterSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"), // must start with 09 and have total 11 digits
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
