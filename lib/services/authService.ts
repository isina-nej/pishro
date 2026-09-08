export async function signupUser(data: { phone: string; password: string }) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function verifyOtp(phone: string, code: string) {
  const res = await fetch("/api/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  return await res.json();
}

export async function resendOtp(phone: string, password: string) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  return await res.json();
}

export async function resetPassword(phone: string, code: string, newPassword: string) {
  const res = await fetch("/api/auth/forgot-password/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code, newPassword }),
  });
  return await res.json();
}

// External API Login with 2FA support
export interface ExternalLoginResponse {
  data?: {
    id: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    name?: string | null;
    role: string;
  };
  meta: {
    status: boolean;
    message: string;
  };
  errors?: Record<string, string[]>;
}

export interface Verify2FAResponse {
  data?: {
    token: string; // Final authentication token
    method: "login";
  };
  meta: {
    status: boolean;
    message: string;
    message_code: string;
  };
  errors?: Record<string, string[]>;
}

export interface SendSMSOTPResponse {
  data?: {
    method: "sms";
    token: string;
  };
  meta: {
    status: boolean;
    message: string;
    message_code: string;
  };
  errors?: Record<string, string[]>;
}

export async function externalApiLogin(username: string, password: string) {
  try {
    const res = await fetch("/api/auth/external-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data: ExternalLoginResponse = await res.json();
    return data;
  } catch (error) {
    console.error("External login error:", error);
    return {
      meta: {
        status: false,
        message: "خطا در ارتباط با سرور",
      },
    } as ExternalLoginResponse;
  }
}

// Request SMS OTP when GA is enabled
export async function requestSMSOTP(token: string) {
  try {
    const res = await fetch("/api/auth/send-sms-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data: SendSMSOTPResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Send SMS OTP error:", error);
    return {
      meta: {
        status: false,
        message: "خطا در درخواست کد پیامک",
        message_code: "500-1",
      },
    } as SendSMSOTPResponse;
  }
}

// Verify OTP (both SMS and GA)
export async function verify2FA(token: string, otp: string) {
  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, otp }),
    });
    const data: Verify2FAResponse = await res.json();
    return data;
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      meta: {
        status: false,
        message: "خطا در تایید کد",
        message_code: "500-1",
      },
    } as Verify2FAResponse;
  }
}

// Forgot password - request OTP (dedicated reset endpoint, separate purpose)
export interface ForgotPasswordResponse {
  status: "success" | "error";
  message: string;
  data?: {
    phone?: string;
  };
}

export async function requestPasswordReset(phone: string) {
  try {
    const res = await fetch("/api/auth/forgot-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (data.status === "success") {
      return {
        status: "success" as const,
        message: data.message || "کد بازیابی ارسال شد",
        data: { phone }
      };
    } else {
      return {
        status: "error" as const,
        message: data.message || "خطا در ارسال کد"
      };
    }
  } catch (error) {
    console.error("Request password reset error:", error);
    return {
      status: "error" as const,
      message: "خطا در درخواست بازنشانی رمز عبور"
    };
  }
}

// NOTE: changePasswordByToken / logout(token) / checkToken were dead code
// (no callers; they targeted the legacy IPPanel token flow, not NextAuth).
// User logout goes through POST /api/auth/logout + NextAuth signOut
// (see components/profile/profileAside.tsx). Kept out deliberately.
