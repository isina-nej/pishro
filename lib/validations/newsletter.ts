import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
