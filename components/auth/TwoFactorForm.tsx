"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { LuArrowRight, LuLoader, LuPhone } from "react-icons/lu";

interface TwoFactorFormProps {
  method: "sms" | "ga";
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
  onRequestSMS?: () => Promise<void>;
}

export function TwoFactorForm({
  method,
  onVerify,
  onBack,
  onRequestSMS,
}: TwoFactorFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("کد را وارد کنید");
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(code);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSMS = async () => {
    setIsRequestingOTP(true);
    try {
      await onRequestSMS?.();
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const methodLabel =
    method === "sms" ? "پیامک" : "رمزساز گوگل";
  const isGAMethod = method === "ga";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-mySecondary mb-2">
          تایید {methodLabel}
        </h2>
        <p className="text-sm text-muted-foreground">
          {method === "sms"
            ? "کد ۶ رقمی ارسال‌شده را وارد کنید"
            : "کد رمزساز گوگل را وارد کنید"}
        </p>
      </div>

      {/* Code Input */}
      <div>
        <label className="block text-sm font-semibold text-muted-foreground mb-3">
          کد تایید
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder={method === "sms" ? "000000" : "000000"}
          maxLength={6}
          className="w-full px-4 py-3 text-center text-2xl letter-spacing-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-myBlue"
          disabled={isLoading || isRequestingOTP}
        />
      </div>

      {/* GA Method - Option to request SMS */}
      {isGAMethod && onRequestSMS && (
        <div className="bg-primary/20 border border-primary rounded-xl p-4">
          <p className="text-sm text-primary mb-3">
            به رمزساز گوگل دسترسی ندارید؟
          </p>
          <Button
            type="button"
            onClick={handleRequestSMS}
            disabled={isLoading || isRequestingOTP}
            className="w-full bg-primary hover:bg-primary text-primary-foreground py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          >
            {isRequestingOTP ? (
              <>
                <LuLoader className="animate-spin text-lg" />
                درحال درخواست...
              </>
            ) : (
              <>
                <LuPhone className="text-lg" />
                درخواست کد پیامک
              </>
            )}
          </Button>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={isLoading || isRequestingOTP || code.length !== 6}
          className="w-full bg-gradient-to-r from-mySecondary to-myBlue text-primary-foreground py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LuLoader className="animate-spin mr-2" />
              درحال تأیید...
            </>
          ) : (
            "تأیید"
          )}
        </Button>

        <Button
          type="button"
          onClick={onBack}
          disabled={isLoading || isRequestingOTP}
          className="w-full bg-muted text-muted-foreground py-3 rounded-xl font-bold hover:bg-muted dark:hover:bg-accent transition-all duration-300 flex items-center justify-center gap-2"
        >
          <LuArrowRight className="text-lg" />
          بازگشت
        </Button>
      </div>

      {/* Help text */}
      <p className="text-xs text-center text-muted-foreground">
        {method === "sms"
          ? "اگر پیامک دریافت نکردید، بعد از چند لحظه دوباره درخواست دهید"
          : "کد در رمزساز گوگل خود چک کنید"}
      </p>
    </form>
  );
}
