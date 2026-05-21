"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LuSquareChevronRight } from "react-icons/lu";
import { AuthForm } from "@/components/auth/AuthForm";
import { OtpForm } from "@/components/auth/OtpForm";
import { TwoFactorForm } from "@/components/auth/TwoFactorForm";
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
    // 2FA
    twoFactorStep,
    twoFactorMethod,
    twoFactorToken,
    handleVerify2FA,
    handleBackFrom2FA,
    handleRequestSMSOTP,
  } = useAuthForm();

  const handleResend = async () => {
    await handleResendOtp();
    reset();
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-8 relative">
      {/* Decorative background elements - Light Mode */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-myBlue/15 to-myPrimary/10 rounded-full blur-3xl -z-10 dark:hidden" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-myPrimary/15 to-myBlue/10 rounded-full blur-3xl -z-10 dark:hidden" />

      {/* Decorative background elements - Dark Mode */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-myBlue/20 to-myPrimary/15 rounded-full blur-3xl -z-10 hidden dark:block" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-myPrimary/20 to-myBlue/15 rounded-full blur-3xl -z-10 hidden dark:block" />

      {/* Main container */}
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 ease-out">
        {/* Logo and back button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button
              variant="costume"
              className="text-sm font-semibold text-mySecondary hover:text-myBlue dark:text-myBlue dark:hover:text-myPrimary group flex items-center gap-2 pb-0 h-auto px-0 hover:translate-x-1 transition-all duration-300"
            >
              <LuSquareChevronRight className="text-base group-hover:translate-x-[-4px] transition-transform duration-300" />
              بازگشت
            </Button>
          </Link>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-myBlue to-myPrimary flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            P
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-cardBg rounded-2xl shadow-xl dark:shadow-2xl backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          {/* Header section with gradient */}
          <div className="relative overflow-hidden bg-gradient-to-r from-mySecondary/8 via-myBlue/5 to-mySecondary/8 dark:from-mySecondary/15 dark:via-myBlue/10 dark:to-mySecondary/15 px-8 pt-8 pb-6 border-b border-gray-200/60 dark:border-gray-700/50">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-mySecondary dark:text-white mb-2">
                {showForgotPassword
                  ? "بازیابی رمز عبور"
                  : twoFactorStep
                  ? `تأیید ${twoFactorMethod === "sms" ? "پیامک" : "رمزساز"}`
                  : "خوش آمدید"}
              </h1>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {showForgotPassword
                  ? "رمز عبور خود را بازیابی کنید"
                  : twoFactorStep
                  ? twoFactorMethod === "sms"
                    ? "کد ارسال شده به پیامک را وارد کنید"
                    : "کد رمزساز گوگل را وارد کنید"
                  : "برای ادامه وارد شوید یا حساب جدید بسازید"}
              </p>
            </div>

            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-myBlue/20 to-myPrimary/10 rounded-full -mr-12 -mt-12" />
          </div>

          {/* Content section */}
          <div className="px-8 py-8">
            {showForgotPassword ? (
              <ForgotPasswordForm
                onBack={() => setShowForgotPassword(false)}
                onSuccess={handleForgotPasswordSuccess}
              />
            ) : twoFactorStep && twoFactorMethod ? (
              <TwoFactorForm
                method={twoFactorMethod}
                token={twoFactorToken}
                onVerify={handleVerify2FA}
                onBack={handleBackFrom2FA}
                onRequestSMS={
                  twoFactorMethod === "ga" ? handleRequestSMSOTP : undefined
                }
              />
            ) : (
              <>
                {!otpStep && (
                  <div className="flex gap-4 mb-8">
                    {["login", "signup"].map((type) => (
                      <Button
                        key={type}
                        variant="costume"
                        onClick={() => setVariant(type as Variant)}
                        className={cn(
                          "flex-1 font-bold text-base py-3 px-4 rounded-xl transition-all duration-300 ease-out",
                          variant === type
                            ? "bg-gradient-to-r from-mySecondary to-myBlue text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        )}
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

          {/* Footer section */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/50 dark:to-slate-800/50 border-t border-gray-200/60 dark:border-gray-700/50">
            <p className="text-xs text-center text-gray-700 dark:text-gray-400">
              با ورود، شما{" "}
              <Link
                href="/terms"
                className="font-semibold text-myBlue hover:text-myPrimary dark:hover:text-myBlue transition-colors"
              >
                شرایط استفاده
              </Link>{" "}
              را می‌پذیرید
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center text-sm text-gray-700 dark:text-gray-400">
          <p>
            سوال دارید؟{" "}
            <Link
              href="/contact"
              className="font-semibold text-myBlue hover:text-myPrimary dark:hover:text-myBlue transition-colors"
            >
              با ما تماس بگیرید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
