// lib/auth.ts
import axios from "axios";

interface SignupData {
  username: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface ApiError {
  error: string;
}

export const signupUser = async (data: SignupData) => {
  try {
    const res = await axios.post("/api/auth/signup", {
      phone: data.username,
      password: data.password,
    });
    return res.data;
  } catch (error) {
    // ✅ استفاده از type narrowing برای خطای Axios
    if (axios.isAxiosError<ApiError>(error)) {
      throw error.response?.data?.error ?? "خطای ناشناخته در ثبت‌نام.";
    }
    throw "خطای ناشناخته در ثبت‌نام.";
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const res = await axios.post("/api/auth/callback/credentials", {
      phone: data.username,
      password: data.password,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<ApiError>(error)) {
      throw error.response?.data?.error ?? "خطای ناشناخته در ورود.";
    }
    throw "خطای ناشناخته در ورود.";
  }
};
