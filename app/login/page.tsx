"use client";

import { useState, useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { LuSquareChevronRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

// تعریف اسکیمای ورود
const loginSchema = z.object({
  username: z
    .string({ required_error: "نام کاربری الزامی است." })
    .nonempty("نام کاربری الزامی است."),
  password: z
    .string({ required_error: "رمز عبور الزامی است." })
    .nonempty("رمز عبور الزامی است.")
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد."),
});

// تعریف اسکیمای ثبت‌نام
const signupSchema = z
  .object({
    username: z
      .string({ required_error: "نام کاربری الزامی است." })
      .nonempty("نام کاربری الزامی است."),
    password: z
      .string({ required_error: "رمز عبور الزامی است." })
      .nonempty("رمز عبور الزامی است.")
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد."),
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
            username: "",
            password: "",
            confirmPassword: "",
          }
        : {
            username: "",
            password: "",
          },
  });

  // ریست کردن فرم در هنگام تغییر variant
  useEffect(() => {
    reset(
      variant === "signup"
        ? {
            username: "",
            password: "",
            confirmPassword: "",
          }
        : {
            username: "",
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
              <div className="mt-5">
                <label
                  htmlFor="username"
                  className="block text-xs font-bold mb-4"
                >
                  نام کاربری
                </label>
                <div className="relative">
                  <Input
                    id="username"
                    {...register("username")}
                    type="email"
                    placeholder="نام کاربری"
                    className={cn(
                      "mt-1 pr-8 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
                      errors.username ? "border-red-500" : ""
                    )}
                  />
                  <Mail className="absolute bottom-2 size-5" />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message as string}
                  </p>
                )}
              </div>
              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold mb-4"
                >
                  رمز عبور
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    {...register("password")}
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    className={cn(
                      "mt-1 pr-8 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
                      errors.password ? "border-red-500" : ""
                    )}
                  />
                  <Mail className="absolute bottom-2 size-5" />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message as string}
                  </p>
                )}
              </div>
              {/* فیلد تکرار رمز عبور (فقط در حالت ثبت‌نام) */}
              {variant === "signup" && (
                <div className="mt-5">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-bold mb-4"
                  >
                    تکرار رمز عبور
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="رمز عبور خود را وارد کنید"
                      className={cn(
                        "mt-1 pr-8 block w-full rounded none border-0 border-b border-black",
                        (errors as FieldErrors<SignupFormValues>)
                          .confirmPassword
                          ? "border-red-500"
                          : ""
                      )}
                    />
                    <Mail className="absolute bottom-2 size-5" />
                  </div>
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
