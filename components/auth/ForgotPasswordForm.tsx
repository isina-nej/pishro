"use client";

import { useState, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextInput } from "./TextInput";
import { PasswordInput } from "./PasswordInput";
import { OtpForm } from "./OtpForm";
import {
  forgotPasswordPhoneSchema,
  forgotPasswordResetSchema,
  ForgotPasswordPhoneValues,
  ForgotPasswordResetValues,
} from "@/lib/schemas/authSchema";
import {
  requestPasswordReset,
  resetPassword,
} from "@/lib/services/authService";
import { useOtpTimer } from "@/lib/hooks/useOtp";
import toast from "react-hot-toast";

type ForgotPasswordStep = "phone" | "otp" | "reset";

interface ForgotPasswordFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function ForgotPasswordForm({
  onBack,
  onSuccess,
}: ForgotPasswordFormProps) {
  const [step, setStep] = useState<ForgotPasswordStep>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { countdown, reset: resetTimer } = useOtpTimer(120);

  // Phone form
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors, isSubmitted: phoneSubmitted, touchedFields: phoneTouched },
  } = useForm<ForgotPasswordPhoneValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(forgotPasswordPhoneSchema),
  });

  // Reset password form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch,
    trigger,
    formState: { errors: resetErrors, isSubmitted: resetSubmitted, touchedFields: resetTouched },
  } = useForm<ForgotPasswordResetValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(forgotPasswordResetSchema),
  });

  // Watch password field and re-validate confirmPassword when it changes
  const newPassword = watch("newPassword");
  useEffect(() => {
    if (newPassword && resetTouched.confirmPassword) {
      void trigger("confirmPassword");
    }
  }, [newPassword, trigger, resetTouched]);

  const handlePhoneSubmit = async (data: ForgotPasswordPhoneValues) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await requestPasswordReset(data.phone);
      if (res.status === "success") {
        toast.success("کد بازیابی ارسال شد!");
        setPhone(data.phone);
        setStep("otp");
        resetTimer();
      } else {
        toast.error(res.message || "خطا در ارسال کد");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setOtpCode(code);
    setStep("reset");
  };

  const handleResendOtp = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await requestPasswordReset(phone);
      toast.success("کد جدید ارسال شد!");
      resetTimer();
    } catch {
      toast.error("خطا در ارسال مجدد کد");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (data: ForgotPasswordResetValues) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await resetPassword(phone, otpCode, data.newPassword);
      if (res.status === "success") {
        toast.success("رمز عبور با موفقیت تغییر یافت!");
        onSuccess?.();
      } else {
        toast.error(res.message || "خطا در تغییر رمز عبور");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackFromOtp = () => {
    setStep("phone");
    setPhone("");
  };

  if (step === "otp") {
    return (
      <OtpForm
        phone={phone}
        countdown={countdown}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={handleBackFromOtp}
      />
    );
  }

  if (step === "reset") {
    return (
      <div className="mt-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setStep("otp")}
          disabled={isLoading}
          className="self-start -mt-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت
        </Button>

        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-xl font-bold text-gray-900">تنظیم رمز عبور جدید</h2>
          <p className="text-sm text-gray-600">
            لطفاً رمز عبور جدید خود را وارد کنید
          </p>
        </div>

        <form
          onSubmit={handleSubmitReset(handleResetSubmit)}
          className="flex flex-col gap-4"
        >
          <PasswordInput
            id="newPassword"
            label="رمز عبور جدید"
            placeholder="رمز عبور جدید"
            {...registerReset("newPassword")}
            error={
              (resetSubmitted || resetTouched.newPassword)
                ? resetErrors.newPassword?.message as string
                : undefined
            }
            disabled={isLoading}
          />

          <PasswordInput
            id="confirmPassword"
            label="تکرار رمز عبور جدید"
            placeholder="رمز عبور جدید خود را تکرار کنید"
            {...registerReset("confirmPassword")}
            error={
              (resetSubmitted || resetTouched.confirmPassword)
                ? (resetErrors as FieldErrors<ForgotPasswordResetValues>)
                    .confirmPassword?.message as string
                : undefined
            }
            disabled={isLoading}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "mt-6 w-full h-12 max-w-[306px] bg-[#d52a16] text-white font-bold text-lg mx-auto",
              isLoading && "opacity-80 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                در حال تغییر رمز عبور
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            ) : (
              "تغییر رمز عبور"
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Phone step (default)
  return (
    <div className="mt-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="self-start -mt-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت
        </Button>
      )}

      {/* Header */}
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">فراموشی رمز عبور</h2>
        <p className="text-sm text-gray-600">
          شماره موبایل خود را وارد کنید تا کد بازیابی برای شما ارسال شود
        </p>
      </div>

      <form
        onSubmit={handleSubmitPhone(handlePhoneSubmit)}
        className="flex flex-col gap-4"
      >
        <TextInput
          id="phone"
          label="شماره تلفن"
          placeholder="شماره تلفن"
          icon={
            <Phone
              className={cn(
                phoneErrors.phone && (phoneSubmitted || phoneTouched.phone) && "text-red-500"
              )}
            />
          }
          {...registerPhone("phone")}
          error={
            (phoneSubmitted || phoneTouched.phone)
              ? phoneErrors.phone?.message as string
              : undefined
          }
          disabled={isLoading}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "mt-6 w-full h-12 max-w-[306px] bg-[#d52a16] text-white font-bold text-lg mx-auto",
            isLoading && "opacity-80 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              در حال ارسال کد
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : (
            "ارسال کد بازیابی"
          )}
        </Button>
      </form>
    </div>
  );
}
