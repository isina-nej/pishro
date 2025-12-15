import axios from "axios";

interface SignupData {
  username: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface SignupResponse {
  message: string;
  user?: { id: string; phone: string };
  smsError?: boolean;
}

interface ApiError {
  error: string;
}

/**
 * ثبت‌نام کاربر + ارسال کد تایید (OTP)
 */
export const signupUser = async (data: SignupData): Promise<SignupResponse> => {
  try {
    const res = await axios.post("/api/auth/signup", {
      phone: data.username,
      password: data.password,
    });

    return res.data; // { message, user, smsError }
  } catch (error) {
    if (axios.isAxiosError<ApiError>(error)) {
      return { message: error.response?.data?.error ?? "خطا در ثبت‌نام." };
    }
    return { message: "خطای ناشناخته در ثبت‌نام." };
  }
};

/**
 * ورود کاربر با credentials
 */
export const loginUser = async (data: LoginData) => {
  try {
    const res = await axios.post("/api/auth/callback/credentials", {
      phone: data.username,
      password: data.password,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<ApiError>(error)) {
      return { error: error.response?.data?.error ?? "خطای ناشناخته در ورود." };
    }
    return { error: "خطای ناشناخته در ورود." };
  }
};
