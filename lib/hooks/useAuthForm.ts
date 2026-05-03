import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { signupUser, verifyOtp, resendOtp } from "@/lib/services/authService";
import {
  LoginFormValues,
  SignupFormValues,
  Variant,
} from "@/lib/schemas/authSchema";

export function useAuthForm() {
  const [variant, setVariant] = useState<Variant>("login");
  const [otpStep, setOtpStep] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [passwordTemp, setPasswordTemp] = useState("");
  const router = useRouter();

  const handleBackFromOtp = () => {
    setOtpStep(false);
    setOtpPhone("");
    setPasswordTemp("");
  };

  const onSubmit = async (data: LoginFormValues | SignupFormValues) => {
    try {
      if (variant === "signup") {
        const res = await signupUser({
          phone: data.username,
          password: data.password,
        });
        if (res.status === "success") {
          toast.success("کد تایید ارسال شد!");
          setOtpStep(true);
          setOtpPhone(data.username);
          setPasswordTemp(data.password);
        } else {
          toast.error(res.message || "خطا در ثبت‌نام!");
        }
      } else {
        const result = await signIn("credentials", {
          phone: data.username,
          password: data.password,
          redirect: false,
        });
        if (result?.error) toast.error("نام کاربری یا رمز عبور اشتباه است!");
        else {
          toast.success("ورود موفقیت‌آمیز بود!");
          router.push("/profile/acc");
        }
      }
    } catch {
      toast.error("خطا در ارتباط با سرور.");
    }
  };

  const handleVerifyOtp = async (code: string) => {
    try {
      const res = await verifyOtp(otpPhone, code);
      if (res.status === "success") {
        toast.success("شماره شما با موفقیت تایید شد!");
        const loginRes = await signIn("credentials", {
          phone: otpPhone,
          password: passwordTemp,
          redirect: false,
        });
        if (loginRes?.error) toast.error("خطا در ورود خودکار");
        else router.push("/profile/acc");
      } else toast.error("کد اشتباه است!");
    } catch {
      toast.error("خطا در تایید کد.");
    }
  };

  const handleResendOtp = async () => {
    await resendOtp(otpPhone, passwordTemp);
    toast.success("کد جدید ارسال شد!");
  };

  return {
    variant,
    setVariant,
    otpStep,
    onSubmit,
    handleVerifyOtp,
    handleResendOtp,
    handleBackFromOtp,
    otpPhone,
    passwordTemp,
  };
}
