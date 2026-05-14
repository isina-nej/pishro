import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  signupUser,
  verifyOtp,
  resendOtp,
  externalApiLogin,
  verify2FA,
  requestSMSOTP,
} from "@/lib/services/authService";
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
  
  // External API 2FA states
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"sms" | "ga" | null>(
    null
  );
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [twoFactorUsername, setTwoFactorUsername] = useState("");

  const router = useRouter();

  const handleBackFromOtp = () => {
    setOtpStep(false);
    setOtpPhone("");
    setPasswordTemp("");
  };

  const handleBackFrom2FA = () => {
    setTwoFactorStep(false);
    setTwoFactorMethod(null);
    setTwoFactorToken("");
    setTwoFactorUsername("");
  };

  const onSubmit = async (data: LoginFormValues | SignupFormValues) => {
    try {
      if (variant === "signup") {
        // Signup flow
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
        // Login flow - Use external API
        const loginRes = await externalApiLogin(data.username, data.password);

        if (!loginRes.meta.status) {
          const errorMsg =
            loginRes.errors?.username?.[0] ||
            loginRes.meta.message ||
            "خطا در ورود";
          toast.error(errorMsg);
          return;
        }

        if (loginRes.data?.method === "login") {
          // Direct login - no 2FA needed
          toast.success("ورود موفقیت‌آمیز بود!");
          // Store token and redirect
          localStorage.setItem("auth_token", loginRes.data.token);
          router.push("/profile/acc");
        } else if (loginRes.data?.method === "sms") {
          // SMS 2FA required
          toast.success("کد تایید به پیامک ارسال شد!");
          setTwoFactorMethod("sms");
          setTwoFactorToken(loginRes.data.token);
          setTwoFactorUsername(data.username);
          setTwoFactorStep(true);
        } else if (loginRes.data?.method === "ga") {
          // Google Authenticator 2FA required
          toast.success("لطفاً کد رمزساز گوگل را وارد کنید");
          setTwoFactorMethod("ga");
          setTwoFactorToken(loginRes.data.token);
          setTwoFactorUsername(data.username);
          setTwoFactorStep(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("خطا در ارتباط با سرور");
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
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("خطا در تایید کد");
    }
  };

  const handleVerify2FA = async (code: string) => {
    try {
      if (!twoFactorToken) {
        toast.error("خطا در تایید");
        return;
      }

      const verifyRes = await verify2FA(twoFactorToken, code);

      if (!verifyRes.meta.status) {
        const errorMsg = verifyRes.meta.message || "کد اشتباه است";
        toast.error(errorMsg);
        return;
      }

      toast.success("ورود موفقیت‌آمیز بود!");
      // Store final token (10 hours validity)
      localStorage.setItem("auth_token", verifyRes.data?.token || "");
      // Also store token expiry time (10 hours from now)
      const expiryTime = new Date(Date.now() + 10 * 60 * 60 * 1000).getTime();
      localStorage.setItem("auth_token_expiry", expiryTime.toString());
      router.push("/profile/acc");
    } catch (error) {
      console.error("2FA verification error:", error);
      toast.error("خطا در تایید کد");
    }
  };

  const handleRequestSMSOTP = async () => {
    try {
      if (!twoFactorToken) {
        toast.error("توکن معتبر نیست");
        return;
      }

      const res = await requestSMSOTP(twoFactorToken);

      if (!res.meta.status) {
        toast.error(res.meta.message || "خطا در درخواست کد پیامک");
        return;
      }

      toast.success("کد پیامک ارسال شد!");
      // Update token if a new one was provided
      if (res.data?.token) {
        setTwoFactorToken(res.data.token);
      }
      // Switch to SMS method
      setTwoFactorMethod("sms");
    } catch (error) {
      console.error("Request SMS OTP error:", error);
      toast.error("خطا در درخواست کد پیامک");
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
    // 2FA states
    twoFactorStep,
    twoFactorMethod,
    twoFactorToken,
    handleVerify2FA,
    handleBackFrom2FA,
    handleRequestSMSOTP,
    twoFactorUsername,
  };
}
