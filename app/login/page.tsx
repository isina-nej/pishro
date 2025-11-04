"use client";

import { useState, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { LuSquareChevronRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { signupUser } from "@/lib/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// =======================
// Login Schema
// =======================
const loginSchema = z.object({
  username: z
    .string({ required_error: "شماره تلفن الزامی است." })
    .nonempty("شماره تلفن الزامی است.")
    .regex(/^09\d{9}$/, "شماره تلفن وارد شده معتبر نیست."),
  password: z
    .string({ required_error: "رمز عبور الزامی است." })
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد.")
    .regex(/[A-Za-z]/, "رمز عبور باید شامل حروف باشد.")
    .regex(/[0-9]/, "رمز عبور باید شامل اعداد باشد."),
});

// =======================
// Signup Schema
// =======================
const signupSchema = z
  .object({
    username: z
      .string({ required_error: "شماره تلفن الزامی است." })
      .nonempty("شماره تلفن الزامی است.")
      .regex(/^09\d{9}$/, "شماره تلفن وارد شده معتبر نیست."),
    password: z
      .string({ required_error: "رمز عبور الزامی است." })
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد.")
      .regex(/[A-Za-z]/, "رمز عبور باید شامل حروف باشد.")
      .regex(/[0-9]/, "رمز عبور باید شامل اعداد باشد."),
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

// =====================
// Reusable Input Components
// =====================
const TextInput = ({
  id,
  label,
  placeholder,
  error,
  icon,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}) => (
  <div className="mt-5">
    <label htmlFor={id} className="block text-xs font-bold mb-4">
      {label}
    </label>
    <div className="relative">
      <Input
        id={id}
        placeholder={placeholder}
        className={cn(
          "mt-1 pr-10 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
          error ? "border-red-500" : ""
        )}
        {...props}
      />
      {icon && <div className="absolute bottom-2 right-2">{icon}</div>}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const PasswordInput = ({
  id,
  label,
  placeholder,
  error,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; error?: string }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mt-5">
      <label htmlFor={id} className="block text-xs font-bold mb-4">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={cn(
            "mt-1 pr-10 pl-8 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
            error ? "border-red-500" : ""
          )}
          {...props}
        />
        <Lock
          className={cn(
            "absolute bottom-2 right-2 size-5",
            error ? "text-red-500" : ""
          )}
        />
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
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// =====================
// AuthForm Component
// =====================
interface AuthFormProps {
  variant: Variant;
  onSubmit: (data: LoginFormValues | SignupFormValues) => void;
}

const AuthForm = ({ variant, onSubmit }: AuthFormProps) => {
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
        ? { username: "", password: "", confirmPassword: "" }
        : { username: "", password: "" },
  });

  useEffect(() => {
    reset(
      variant === "signup"
        ? { username: "", password: "", confirmPassword: "" }
        : { username: "", password: "" }
    );
  }, [variant, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-8"
    >
      <TextInput
        id="username"
        label="شماره تلفن"
        placeholder="شماره تلفن"
        icon={<Mail className={cn(errors.username ? "text-red-500" : "")} />}
        {...register("username")}
        error={errors.username?.message as string}
      />
      <PasswordInput
        id="password"
        label="رمز عبور"
        placeholder="رمز عبور خود را وارد کنید"
        {...register("password")}
        error={errors.password?.message as string}
      />
      {variant === "signup" && (
        <PasswordInput
          id="confirmPassword"
          label="تکرار رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
          {...register("confirmPassword")}
          error={
            (errors as FieldErrors<SignupFormValues>).confirmPassword
              ?.message as string
          }
        />
      )}
      <Button
        type="submit"
        variant="default"
        className="mt-6 w-full h-10 max-w-[306px] bg-[#d52a16] text-white font-bold text-xl mx-auto"
      >
        {variant === "login" ? "ورود" : "ثبت نام"}
      </Button>
    </form>
  );
};

// =====================
// Main Page Component
// =====================
const LoginPage = () => {
  const [variant, setVariant] = useState<Variant>("login");
  const router = useRouter();

  const switchVariant = (newVariant: Variant) => setVariant(newVariant);

  const onSubmit = async (data: LoginFormValues | SignupFormValues) => {
    try {
      if (variant === "signup") {
        const res = await signupUser({
          username: data.username,
          password: data.password,
        });

        if (res?.success) {
          toast.success("ثبت‌نام با موفقیت انجام شد!");

          // ✅ ورود خودکار بعد از ثبت‌نام
          const loginResult = await signIn("credentials", {
            phone: data.username,
            password: data.password,
            redirect: false,
          });

          if (loginResult?.ok) {
            router.push("/profile/acc"); // ✅ انتقال به پروفایل
          } else {
            toast.error("ورود خودکار پس از ثبت‌نام با مشکل مواجه شد!");
          }
        } else {
          toast.error(res?.message || "خطا در ثبت‌نام!");
        }
      } else {
        // ✅ ورود معمولی
        const result = await signIn("credentials", {
          phone: data.username,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("نام کاربری یا رمز عبور اشتباه است!");
        } else {
          toast.success("ورود موفقیت‌آمیز بود!");
          router.push("/profile/acc"); // ✅ انتقال بعد از ورود موفق
        }
      }
    } catch (error) {
      toast.error("خطایی رخ داد، لطفاً مجدد تلاش کنید.");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-lvh overflow-x-hidden">
      <div className="w-full max-w-[570px] px-16 py-8 bg-white">
        {/* Back Button */}
        <div>
          <Link href={"/"}>
            <Button
              variant="costume"
              className="text-xs font-medium text-[#214254] group transition-all flex items-center gap-2 pb-0 h-7 px-1"
            >
              <LuSquareChevronRight className="group-hover:fill-gray-100 transition-all" />
              بازگشت
            </Button>
          </Link>
        </div>
        {/* Logo / Greeting */}
        <div className="mt-8">
          <p className="text-xs mt-2">سلام اوقاتتون بخیر</p>
        </div>
        {/* Variant Tabs */}
        <div className="mt-10 flex border-b">
          <Button
            variant="costume"
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
            variant="costume"
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
        {/* Auth Form */}
        <AuthForm variant={variant} onSubmit={onSubmit} />
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
