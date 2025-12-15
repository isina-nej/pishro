import * as z from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "شماره تلفن الزامی است." })
    .regex(/^09\d{9}$/, "شماره تلفن وارد شده معتبر نیست."),
  password: z
    .string({ required_error: "رمز عبور الزامی است." })
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد."),
});

export const signupSchema = loginSchema
  .extend({
    confirmPassword: z
      .string({ required_error: "تکرار رمز عبور الزامی است." })
      .min(1, "تکرار رمز عبور الزامی است."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند.",
    path: ["confirmPassword"],
  });

// Forgot password schemas
export const forgotPasswordPhoneSchema = z.object({
  phone: z
    .string({ required_error: "شماره تلفن الزامی است." })
    .regex(/^09\d{9}$/, "شماره تلفن وارد شده معتبر نیست."),
});

export const forgotPasswordResetSchema = z
  .object({
    newPassword: z
      .string({ required_error: "رمز عبور جدید الزامی است." })
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد."),
    confirmPassword: z
      .string({ required_error: "تکرار رمز عبور الزامی است." })
      .min(1, "تکرار رمز عبور الزامی است."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordPhoneValues = z.infer<typeof forgotPasswordPhoneSchema>;
export type ForgotPasswordResetValues = z.infer<typeof forgotPasswordResetSchema>;
export type Variant = "login" | "signup";
