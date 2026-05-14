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
    method: "ga" | "sms" | "login"; // ga (Google Authenticator), sms, or direct login
    token: string;
  };
  meta: {
    status: boolean;
    message: string;
    message_code: string;
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
        message_code: "500-1",
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

// Forgot password - request OTP (Internal phone-based system)
export interface ForgotPasswordResponse {
  status: "success" | "error";
  message: string;
  data?: {
    phone?: string;
  };
}

export async function requestPasswordReset(phone: string) {
  try {
    // Use internal system - phone-based password reset
    // For now, we'll use the signup endpoint to generate OTP
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password: "temp" }),
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

// Change password with token
export interface ChangePasswordResponse {
  data?: null;
  meta: {
    status: boolean;
    message: string;
    message_code: string;
  };
  errors?: Record<string, string[]>;
}

export async function changePasswordByToken(
  token: string,
  otp: string,
  password: string
) {
  try {
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, otp, password }),
    });
    const data: ChangePasswordResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Change password error:", error);
    return {
      meta: {
        status: false,
        message: "خطا در تغییر رمز عبور",
        message_code: "500-1",
      },
    } as ChangePasswordResponse;
  }
}

// Logout
export interface LogoutResponse {
  data?: null;
  meta: {
    status: boolean;
    message: string;
    message_code: string;
  };
}

export async function logout(token: string) {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data: LogoutResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Logout error:", error);
    return {
      meta: {
        status: false,
        message: "خطا در خروج",
        message_code: "500-1",
      },
    } as LogoutResponse;
  }
}

// Check token validity
export interface CheckTokenResponse {
  data?: {
    user_name: string;
    user_id: number;
    document_block: boolean;
    is_reseller: boolean;
    send_block: boolean;
    name: string;
  };
  meta: {
    status: boolean;
    message: string;
    message_code: string;
  };
  errors?: Record<string, string[]>;
}

export async function checkToken(token: string) {
  try {
    const res = await fetch("/api/auth/check-token-ippanel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data: CheckTokenResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Check token error:", error);
    return {
      meta: {
        status: false,
        message: "خطا در بررسی توکن",
        message_code: "500-1",
      },
    } as CheckTokenResponse;
  }
}
