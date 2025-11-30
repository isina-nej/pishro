"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LuArrowUpRight } from "react-icons/lu";
import { AuthForm } from "@/components/auth/AuthForm";
import { OtpForm } from "@/components/auth/OtpForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useOtpTimer } from "@/lib/hooks/useOtp";
import { useAuthForm } from "@/lib/hooks/useAuthForm";
import { Variant } from "@/lib/schemas/authSchema";

const LoginPage = () => {
  const router = useRouter();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { countdown, reset } = useOtpTimer(120);
  const {
    variant,
    setVariant,
    otpStep,
    onSubmit,
    handleVerifyOtp,
    handleResendOtp,
    handleBackFromOtp,
    otpPhone,
  } = useAuthForm();

  const handleResend = async () => {
    await handleResendOtp();
    reset();
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    // Optionally redirect to login
    router.push("/login");
  };

  return (
    <div className="flex min-h-lvh overflow-x-hidden">
      <div className="w-full max-w-[570px] px-16 py-8 bg-white">
        <Link href="/">
          <button className="group flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 rounded-md hover:text-gray-900 transition-colors duration-200 hover:bg-gray-50">
            <LuArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 group-hover:scale-110 transition-all duration-300" />
            <span>برگشت</span>
          </button>
        </Link>

        {showForgotPassword ? (
          <ForgotPasswordForm
            onBack={() => setShowForgotPassword(false)}
            onSuccess={handleForgotPasswordSuccess}
          />
        ) : (
          <>
            {!otpStep && (
              <div className="mt-10 flex border-b">
                {["login", "signup"].map((type) => (
                  <Button
                    key={type}
                    variant="costume"
                    className={cn(
                      "flex-1 font-bold text-xl py-4 pb-6 hover:border-b-[#1a7545]",
                      variant === type &&
                        "text-[#3dc37b] border-b-2 border-[#3dc37b]"
                    )}
                    onClick={() => setVariant(type as Variant)}
                  >
                    {type === "login" ? "ورود" : "ثبت نام"}
                  </Button>
                ))}
              </div>
            )}

            {otpStep ? (
              <OtpForm
                phone={otpPhone}
                countdown={countdown}
                onVerify={handleVerifyOtp}
                onResend={handleResend}
                onBack={handleBackFromOtp}
              />
            ) : (
              <AuthForm
                variant={variant}
                onSubmit={onSubmit}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            )}
          </>
        )}
      </div>

      <div className="flex-1 relative">
        <Image
          src="/images/login/background.jpg"
          alt="background"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
