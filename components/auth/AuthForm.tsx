"use client";

import { useEffect, useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextInput } from "./TextInput";
import { PasswordInput } from "./PasswordInput";
import {
  loginSchema,
  signupSchema,
  Variant,
  LoginFormValues,
  SignupFormValues,
} from "@/lib/schemas/authSchema";

interface AuthFormProps {
  variant: Variant;
  onSubmit?: (data: LoginFormValues | SignupFormValues) => Promise<void> | void;
  onForgotPassword?: () => void;
}

export function AuthForm({ variant, onSubmit, onForgotPassword }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<LoginFormValues | SignupFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(variant === "signup" ? signupSchema : loginSchema),
  });

  // Reset form when variant changes
  useEffect(() => {
    reset();
  }, [variant, reset]);

  // Watch password field and re-validate confirmPassword when it changes
  const password = watch("password");
  useEffect(() => {
    if (variant === "signup" && password) {
      // Type guard to check if confirmPassword field has been touched
      const hasConfirmPassword = "confirmPassword" in touchedFields;
      if (hasConfirmPassword && touchedFields.confirmPassword) {
        void trigger("confirmPassword");
      }
    }
  }, [password, variant, trigger, touchedFields]);

  const handleFormSubmit = async (data: LoginFormValues | SignupFormValues) => {
    if (isLoading) return; // جلوگیری از کلیک دوباره
    setIsLoading(true);

    try {
      await onSubmit?.(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 mt-8"
    >
      <TextInput
        id="username"
        label="شماره تلفن"
        placeholder="شماره تلفن"
        icon={<Phone className={cn(errors.username && (isSubmitted || touchedFields.username) && "text-red-500")} />}
        {...register("username")}
        error={(isSubmitted || touchedFields.username) ? errors.username?.message as string : undefined}
        disabled={isLoading}
      />

      <PasswordInput
        id="password"
        label="رمز عبور"
        placeholder="رمز عبور"
        {...register("password")}
        error={(isSubmitted || touchedFields.password) ? errors.password?.message as string : undefined}
        disabled={isLoading}
      />

      {variant === "login" && onForgotPassword && (
        <Button
          type="button"
          variant="ghost"
          onClick={onForgotPassword}
          disabled={isLoading}
          className="self-end text-sm text-[#3dc37b] hover:text-[#2da85f] hover:bg-transparent -mt-2 h-auto p-0"
        >
          فراموشی رمز عبور؟
        </Button>
      )}

      {variant === "signup" && (
        <PasswordInput
          id="confirmPassword"
          label="تکرار رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
          {...register("confirmPassword")}
          error={
            (isSubmitted || (touchedFields as Partial<Record<keyof SignupFormValues, boolean>>).confirmPassword)
              ? (errors as FieldErrors<SignupFormValues>).confirmPassword?.message as string
              : undefined
          }
          disabled={isLoading}
        />
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          "mt-6 w-full h-10 max-w-[306px] bg-[#d52a16] text-white font-bold text-xl mx-auto",
          isLoading && "opacity-80 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            {variant === "login" ? "در حال ورود" : "در حال ثبت‌نام"}
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        ) : variant === "login" ? (
          "ورود"
        ) : (
          "ثبت نام"
        )}
      </Button>
    </form>
  );
}
