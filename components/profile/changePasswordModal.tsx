"use client";

import { useState, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { OtpForm } from "@/components/auth/OtpForm";
import {
  forgotPasswordResetSchema,
  ForgotPasswordResetValues,
} from "@/lib/schemas/authSchema";
import {
  requestPasswordReset,
  resetPassword,
} from "@/lib/services/authService";
import { useOtpTimer } from "@/lib/hooks/useOtp";
import toast from "react-hot-toast";

type ChangePasswordStep = "request" | "otp" | "reset";

interface ChangePasswordModalProps {
  phone: string;
  onClose: () => void;
}

export function ChangePasswordModal({
  phone,
  onClose,
}: ChangePasswordModalProps) {
  const [step, setStep] = useState<ChangePasswordStep>("request");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { countdown, reset: resetTimer } = useOtpTimer(120);

  // Reset password form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch,
    trigger,
    formState: {
      errors: resetErrors,
      isSubmitted: resetSubmitted,
      touchedFields: resetTouched,
    },
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

  const handleRequestOtp = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await requestPasswordReset(phone);
      if (res.status === "success") {
        toast.success("کد تایید ارسال شد!");
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
        onClose();
      } else {
        toast.error(res.message || "خطا در تغییر رمز عبور");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6 relative animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        {step === "request" && (
          <div className="flex flex-col gap-4">
            <div className="text-center space-y-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                تغییر رمز عبور
              </h2>
              <p className="text-sm text-gray-600">
                برای تغییر رمز عبور، ابتدا کد تایید به شماره {phone} ارسال
                می‌شود
              </p>
            </div>

            <Button
              onClick={handleRequestOtp}
              disabled={isLoading}
              className={cn(
                "w-full h-12 bg-[#d52a16] text-white font-bold text-lg",
                isLoading && "opacity-80 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  در حال ارسال کد
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              ) : (
                "ارسال کد تایید"
              )}
            </Button>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-4">
            <div className="text-center space-y-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                تایید شماره موبایل
              </h2>
            </div>
            <OtpForm
              phone={phone}
              countdown={countdown}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onBack={() => setStep("request")}
            />
          </div>
        )}

        {step === "reset" && (
          <div className="flex flex-col gap-4">
            <div className="text-center space-y-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                تنظیم رمز عبور جدید
              </h2>
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
                  resetSubmitted || resetTouched.newPassword
                    ? (resetErrors.newPassword?.message as string)
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
                  resetSubmitted || resetTouched.confirmPassword
                    ? ((
                        resetErrors as FieldErrors<ForgotPasswordResetValues>
                      ).confirmPassword?.message as string)
                    : undefined
                }
                disabled={isLoading}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "mt-2 w-full h-12 bg-[#d52a16] text-white font-bold text-lg",
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
        )}
      </div>
    </div>
  );
}
