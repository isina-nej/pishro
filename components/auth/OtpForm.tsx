"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OtpFormProps {
  phone: string;
  countdown: number;
  onVerify?: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
  onBack?: () => void;
}

export function OtpForm({
  phone,
  countdown,
  onVerify,
  onResend,
  onBack,
}: OtpFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  // ریشهٔ DOM که InputOTP بهش ref می‌فرسته (div یا wrapper)
  const otpRootRef = useRef<HTMLDivElement | null>(null);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  // تلاش برای فوکوس: تا maxAttempts هر attemptDelay میلی‌ثانیه منتظر می‌شویم
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    const attemptDelay = 100; // ms

    const tryFocus = () => {
      attempts++;
      try {
        // داخل ریشه دنبال اولین input بگرد
        const input =
          otpRootRef.current?.querySelector<HTMLInputElement>("input");
        if (input) {
          // اگر پیدا شد فوکوس کن و کار تمام
          input.focus({ preventScroll: false });
          // بعضی اوقات بهتره selection هم ست بشه (برای iOS/Android)
          try {
            input.setSelectionRange(input.value.length, input.value.length);
          } catch {}
          return;
        }
        // ignore
      } catch (err) {
        console.log(err);
      }

      if (attempts < maxAttempts) {
        // تلاش بعدی
        setTimeout(tryFocus, attemptDelay);
      }
    };

    // شروع تلاش
    setTimeout(tryFocus, 50);

    return () => {
      // cleanup: در این نمونه چیزی خاص لازم نیست چون ما فقط timeouts داریم که خودشان پاک می‌شوند
    };
  }, []);

  const handleVerify = async () => {
    if (isLoading || code.length !== 4) return;
    setIsLoading(true);
    setIsComplete(true);

    try {
      await onVerify?.(code);
    } catch (err) {
      console.error(err);
      setIsComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setCode("");
    setIsComplete(false);

    try {
      await onResend?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // خودکار ارسال وقتی 4 رقم کامل شد
  useEffect(() => {
    if (code.length === 4 && !isComplete) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="mt-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      {/* Header Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#3dc37b]/10 rounded-full flex items-center justify-center">
          <Phone className="w-8 h-8 text-[#3dc37b]" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">تأیید شماره تلفن</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
            کد ۴ رقمی ارسال‌شده به شماره{" "}
            <span className="font-bold text-gray-900 dir-ltr inline-block">
              {phone}
            </span>{" "}
            را وارد کنید
          </p>
        </div>
      </div>

      {/* OTP Input Section */}
      <div className="flex flex-col items-center gap-6">
        <div ref={otpRootRef} className="w-full flex justify-center">
          <InputOTP
            maxLength={4}
            value={code}
            onChange={(value) => {
              setCode(value.replace(/\D/g, ""));
              setIsComplete(false);
            }}
            disabled={isLoading}
          >
            <InputOTPGroup className="ltr gap-3">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={cn(
                    "w-14 h-14 text-2xl font-bold border-2 rounded-lg transition-all duration-200",
                    code.length > index && "border-[#3dc37b] bg-[#3dc37b]/5",
                    isComplete && "border-green-500 bg-green-50"
                  )}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Success Indicator */}
        {isComplete && (
          <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">در حال تأیید...</span>
          </div>
        )}
      </div>

      {/* Timer / Resend Section */}
      <div className="flex flex-col items-center gap-3">
        {countdown > 0 ? (
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600">زمان باقی‌مانده برای ارسال مجدد</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums dir-ltr">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
        ) : (
          <Button
            className="w-48 h-11 hover:bg-gray-50 border-2 border-gray-300 hover:border-[#3dc37b] transition-colors"
            variant="outline"
            onClick={handleResendClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                در حال ارسال...
              </div>
            ) : (
              <span className="font-medium">ارسال مجدد کد</span>
            )}
          </Button>
        )}
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        disabled={code.length !== 4 || isLoading}
        className={cn(
          "w-full h-12 bg-[#d52a16] hover:bg-[#b82414] text-white font-bold text-lg transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          code.length === 4 && !isLoading && "shadow-lg shadow-[#d52a16]/30"
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            در حال تأیید...
          </div>
        ) : (
          "تأیید کد"
        )}
      </Button>

      {/* Helper Text */}
      <p className="text-xs text-center text-gray-500 -mt-4">
        در صورت دریافت نکردن کد، پس از اتمام زمان می‌توانید مجدداً درخواست دهید
      </p>
    </div>
  );
}
