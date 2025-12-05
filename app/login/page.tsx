"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LuArrowRight } from "react-icons/lu";
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
      <div className="w-full max-w-[570px] px-8 sm:px-16 py-8 bg-white flex flex-col justify-center relative z-10">
        <div className="absolute top-8 right-8 sm:right-16">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-myPrimary transition-colors group">
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-myPrimary group-hover:bg-myPrimary/5 transition-all">
              <LuArrowRight className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </div>
            <span className="text-sm font-medium">بازگشت به خانه</span>
          </Link>
        </div>

        <div className="mt-20">
          {/* سلام اوقاتتون بخیر حذف شد */}

          {showForgotPassword ? (
            <ForgotPasswordForm
              onBack={() => setShowForgotPassword(false)}
              onSuccess={handleForgotPasswordSuccess}
            />
          ) : (
            <>
              {!otpStep && (
                <div className="mt-4 flex border-b mb-8">
                  {["login", "signup"].map((type) => (
                    <Button
                      key={type}
                      variant="costume"
                      className={cn(
                        "flex-1 font-bold text-xl py-4 pb-6 hover:border-b-[#1a7545] transition-all",
                        variant === type
                          ? "text-[#3dc37b] border-b-2 border-[#3dc37b]"
                          : "text-gray-400 border-b-2 border-transparent"
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
      </div>

      <div className="flex-1 relative hidden lg:block">
        <Image
          src="/images/login/background-v2.png"
          alt="background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
      </div>
    </div>
  );
};

export default LoginPage;
