"use client";

import { useState, useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LuSquareChevronRight } from "react-icons/lu";
import { cn } from "@/lib/utils";

// تعریف اسکیمای ورود
const loginSchema = z.object({
  email: z
    .string({ required_error: "ایمیل الزامی است." })
    .nonempty("ایمیل الزامی است.")
    .email("ایمیل نامعتبر است."),
  password: z
    .string({ required_error: "رمز عبور الزامی است." })
    .nonempty("رمز عبور الزامی است.")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد."),
});

// تعریف اسکیمای ثبت‌نام
const signupSchema = z
  .object({
    fullName: z
      .string({ required_error: "نام کامل الزامی است." })
      .nonempty("نام کامل الزامی است."),
    email: z
      .string({ required_error: "ایمیل الزامی است." })
      .nonempty("ایمیل الزامی است.")
      .email("ایمیل نامعتبر است."),
    password: z
      .string({ required_error: "رمز عبور الزامی است." })
      .nonempty("رمز عبور الزامی است.")
      .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد."),
    confirmPassword: z
      .string({ required_error: "تکرار رمز عبور الزامی است." })
      .nonempty("تکرار رمز عبور الزامی است."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند.",
    path: ["confirmPassword"],
  });

type Variant = "login" | "signup";

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const LoginPage = () => {
  const [variant, setVariant] = useState<Variant>("login");

  // استفاده از react-hook-form همراه با zodResolver و تعیین defaultValues بر اساس variant
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues | SignupFormValues>({
    mode: "onChange",
    resolver: zodResolver(variant === "signup" ? signupSchema : loginSchema),
    defaultValues:
      variant === "signup"
        ? {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }
        : {
            email: "",
            password: "",
          },
  });

  // ریست کردن فرم در هنگام تغییر variant
  useEffect(() => {
    reset(
      variant === "signup"
        ? {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }
        : {
            email: "",
            password: "",
          }
    );
  }, [variant, reset]);

  // عملکرد هنگام ارسال فرم
  const onSubmit = (data: LoginFormValues | SignupFormValues) => {
    console.log("Submitting form with values:", data);
    // منطق ارسال فرم (مثلاً فراخوانی API) در اینجا نوشته می‌شود
  };

  // تغییر حالت فرم (ورود / ثبت‌نام)
  const switchVariant = (newVariant: Variant) => {
    setVariant(newVariant);
  };

  return (
    <div className="flex h-lvh overflow-hidden">
      <div className="w-full max-w-[570px] p-16">
        {/* دکمه بازگشت */}
        <div>
          <Link href={"/"}>
            <Button
              variant={"costume"}
              className="text-xs font-medium text-[#214254] group transition-all flex items-center gap-2 pb-0 h-7 px-1"
            >
              <LuSquareChevronRight className="group-hover:fill-gray-100 transition-all" />
              بازگشت
            </Button>
          </Link>
        </div>
        {/* لوگو */}
        <div className="mt-[72px]">
          <div className="h-10 w-[100px] flex items-center">
            <Image src={"/icons/Logo.png"} alt="logo" width={90} height={32} />
          </div>
          <p className="text-xs mt-2">سلام اوقاتتون بخیر</p>
        </div>
        {/* فرم */}
        <div className="mt-10">
          {/* انتخاب حالت (ورود / ثبت‌نام) */}
          <div className="flex border-b">
            <Button
              variant={"costume"}
              className={cn(
                "flex-1 font-bold text-xl py-4 pb-6 hover:border-b-[#1a7545]",
                variant === "login" &&
                  "text-[#3dc37b] border-b-2 border-[#3dc37b]"
              )}
              onClick={() => switchVariant("login")}
            >
              ورود
            </Button>
            <Button
              variant={"costume"}
              className={cn(
                "flex-1 font-bold text-xl py-4 pb-6 hover:border-b-[#1a7545]",
                variant === "signup" &&
                  "text-[#3dc37b] border-b-2 border-[#3dc37b]"
              )}
              onClick={() => switchVariant("signup")}
            >
              ثبت نام
            </Button>
          </div>
          {/* بدنه فرم */}
          <div className="mt-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* فیلد نام کامل (فقط در حالت ثبت‌نام) */}
              {variant === "signup" && (
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    نام کامل
                  </label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    type="text"
                    placeholder="نام کامل"
                    className={cn(
                      "mt-1 block w-full",
                      (errors as FieldErrors<SignupFormValues>).fullName
                        ? "border-red-500"
                        : ""
                    )}
                  />
                  {(errors as FieldErrors<SignupFormValues>).fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        (errors as FieldErrors<SignupFormValues>).fullName
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  ایمیل
                </label>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="ایمیل"
                  className={cn(
                    "mt-1 block w-full",
                    errors.email ? "border-red-500" : ""
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  رمز عبور
                </label>
                <Input
                  id="password"
                  {...register("password")}
                  type="password"
                  placeholder="رمز عبور"
                  className={cn(
                    "mt-1 block w-full",
                    errors.password ? "border-red-500" : ""
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message as string}
                  </p>
                )}
              </div>
              {/* فیلد تکرار رمز عبور (فقط در حالت ثبت‌نام) */}
              {variant === "signup" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    تکرار رمز عبور
                  </label>
                  <Input
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="تکرار رمز عبور"
                    className={cn(
                      "mt-1 block w-full",
                      (errors as FieldErrors<SignupFormValues>).confirmPassword
                        ? "border-red-500"
                        : ""
                    )}
                  />
                  {(errors as FieldErrors<SignupFormValues>)
                    .confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        (errors as FieldErrors<SignupFormValues>)
                          .confirmPassword?.message as string
                      }
                    </p>
                  )}
                </div>
              )}
              <Button
                type="submit"
                variant="default"
                className="mt-6 w-full h-10 max-w-[306px] bg-[#d52a16] text-white font-bold text-xl mx-auto"
              >
                {variant === "login" ? "ورود" : "ثبت نام"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      {/* تصویر پس‌زمینه */}
      <div className="flex-1 relative">
        <Image
          src={"/images/login/background.jpg"}
          alt="background"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
