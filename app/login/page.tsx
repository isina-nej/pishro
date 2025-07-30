"use client";

import { useState, useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff } from "lucide-react"; // Import Eye icons
import { LuSquareChevronRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Login schema
const loginSchema = z.object({
  username: z
    .string({ required_error: "نام کاربری الزامی است." })
    .nonempty("نام کاربری الزامی است."),
  password: z
    .string({ required_error: "رمز عبور الزامی است." })
    .nonempty("رمز عبور الزامی است.")
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد."),
});

// Signup schema
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
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Using react-hook-form with zodResolver
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

  // Reset form on variant change
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

  // Form submission handler
  const onSubmit = (data: LoginFormValues | SignupFormValues) => {
    console.log("Submitting form with values:", data);
    // API call or form submission logic here
  };

  const handleButtons = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: string
  ) => {
    e.preventDefault();
    console.log(type);
  };

  // Switch form variant (login/signup)
  const switchVariant = (newVariant: Variant) => {
    setVariant(newVariant);
  };

  return (
    <div className="flex min-h-lvh overflow-x-hidden">
      <div className="w-full max-w-[570px] px-16 py-8 bg-white">
        {/* Back Button */}
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
        {/* Logo */}
        <div className="mt-8">
          <p className="text-xs mt-2">سلام اوقاتتون بخیر</p>
        </div>
        {/* Form */}
        <div className="mt-10">
          {/* Variant Selection (Login/Signup) */}
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
          {/* Form Body */}
          <div className="mt-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Username Field */}
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
                      "mt-1 pr-10 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
                      errors.username ? "border-red-500" : ""
                    )}
                  />
                  <Mail
                    className={cn(
                      "absolute bottom-2 right-2 size-5",
                      (errors as FieldErrors<SignupFormValues>).username
                        ? "text-red-500"
                        : ""
                    )}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message as string}
                  </p>
                )}
              </div>
              {/* Password Field */}
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
                    // Toggle input type based on showPassword state
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور خود را وارد کنید"
                    className={cn(
                      "mt-1 pr-10 pl-8 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
                      errors.password ? "border-red-500" : ""
                    )}
                  />
                  {/* Lock icon on the left */}
                  <Lock
                    className={cn(
                      "absolute bottom-2 right-2 size-5",
                      (errors as FieldErrors<SignupFormValues>).password
                        ? "text-red-500"
                        : ""
                    )}
                  />
                  {/* Eye icon on the right to toggle visibility */}
                  {showPassword ? (
                    <Eye
                      onClick={() => setShowPassword(false)}
                      className="absolute bottom-2 left-2 size-5 cursor-pointer"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowPassword(true)}
                      className="absolute bottom-2 left-2 size-5 cursor-pointer"
                    />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message as string}
                  </p>
                )}
              </div>
              {/* Confirm Password Field (only for signup) */}
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
                      // Toggle input type based on showConfirmPassword state
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="رمز عبور خود را وارد کنید"
                      className={cn(
                        "mt-1 pr-10 pl-8 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
                        (errors as FieldErrors<SignupFormValues>)
                          .confirmPassword
                          ? "border-red-500"
                          : ""
                      )}
                    />
                    {/* Lock icon on the left */}
                    <Lock
                      className={cn(
                        "absolute bottom-2 right-2 size-5",
                        (errors as FieldErrors<SignupFormValues>)
                          .confirmPassword
                          ? "text-red-500"
                          : ""
                      )}
                    />
                    {/* Eye icon on the right to toggle visibility */}
                    {showConfirmPassword ? (
                      <Eye
                        onClick={() => setShowConfirmPassword(false)}
                        className="absolute bottom-2 left-2 size-5 cursor-pointer"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowConfirmPassword(true)}
                        className="absolute bottom-2 left-2 size-5 cursor-pointer"
                      />
                    )}
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
              <div className="mt-5 flex gap-5 justify-center">
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleButtons(e, "google")
                  }
                  className="relative size-10"
                >
                  <Image
                    src={"/images/login/google.png"}
                    alt="google"
                    fill
                    className="object-cover"
                  />
                </button>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleButtons(e, "apple")
                  }
                  className="relative size-10"
                >
                  <Image
                    src={"/images/login/apple.png"}
                    alt="apple"
                    fill
                    className="object-cover"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Background Image */}
      <div className="flex-1 relative">
        <div
          className="fixed left-0 top-0 h-full -z-10"
          style={{ width: "calc(100vw - 570px)" }}
        >
          <Image
            src="/images/login/background.jpg"
            alt="background"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
