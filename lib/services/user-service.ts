import axios from "axios";
import { ApiSuccessResponse, PaginatedData } from "@/lib/api-response";

// ===========================
// Types
// ===========================

export interface UserStats {
  totalOrders: number;
  totalEnrollments: number;
  totalComments: number;
}

export interface UserData {
  id: string;
  phone: string;
  phoneVerified: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  nationalCode?: string;
  birthDate?: string;
  avatarUrl?: string;
  cardNumber?: string;
  shebaNumber?: string;
  accountOwner?: string;
  createdAt: string;
  stats: UserStats;
}

export interface EnrolledCourse {
  id: string;
  enrolledAt: string;
  progress: number;
  completedAt?: string;
  lastAccessAt?: string;
  isCompleted: boolean;
  course: {
    id: string;
    subject: string;
    img?: string;
    price: number;
    discountPercent?: number;
    time?: string;
    rating?: number;
    videosCount?: number;
    description?: string;
  };
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  gateway?: string;
  refNumber?: string;
  description?: string;
  createdAt: string;
  order?: {
    id: string;
    total: number;
    status: string;
  };
}

export interface UserOrder {
  id: string;
  total: number;
  status: string;
  paymentRef?: string;
  createdAt: string;
  itemCount: number;
  items: {
    courseId: string;
    title: string;
    price: number;
    img?: string;
    discountPercent?: number;
  }[];
}

// ===========================
// API Functions
// ===========================

// ✅ Get current user info
export async function getCurrentUser() {
  const res = await axios.get<ApiSuccessResponse<UserData>>("/api/user/me");
  return res.data;
}

// ✅ Get enrolled courses
export async function getEnrolledCourses(page: number = 1, limit: number = 10) {
  const res = await axios.get<ApiSuccessResponse<PaginatedData<EnrolledCourse>>>(
    `/api/user/enrolled-courses?page=${page}&limit=${limit}`
  );
  return res.data;
}

// ✅ Get user transactions
export async function getUserTransactions(
  page: number = 1,
  limit: number = 20,
  type?: string,
  status?: string
) {
  let url = `/api/user/transactions?page=${page}&limit=${limit}`;
  if (type) url += `&type=${type}`;
  if (status) url += `&status=${status}`;

  const res = await axios.get<ApiSuccessResponse<PaginatedData<Transaction>>>(url);
  return res.data;
}

// ✅ Get user orders
export async function getUserOrders(
  page: number = 1,
  limit: number = 10,
  status?: string
) {
  let url = `/api/user/orders?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;

  const res = await axios.get<ApiSuccessResponse<PaginatedData<UserOrder>>>(url);
  return res.data;
}

// ✅ Update enrollment progress
export async function updateEnrollmentProgress(
  enrollmentId: string,
  progress: number,
  completed?: boolean
) {
  const res = await axios.patch<ApiSuccessResponse<EnrolledCourse>>(
    "/api/user/enrollment",
    { enrollmentId, progress, completed }
  );
  return res.data;
}

// ✅ Update personal info
export async function updatePersonalInfo(data: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalCode?: string;
  birthDate?: Date | null;
  avatarUrl?: string;
}) {
  const res = await axios.put<ApiSuccessResponse<UserData>>("/api/user/personal", data);
  return res.data;
}

// ✅ Update avatar
export async function updateAvatar(avatarUrl: string) {
  const res = await axios.put("/api/user/avatar", { avatarUrl });
  return res.data;
}

// ✅ Update payment info
export async function updatePayInfo(data: {
  cardNumber: string;
  shebaNumber: string;
  accountOwner: string;
}) {
  const res = await axios.put<ApiSuccessResponse<UserData>>("/api/user/pay", data);
  return res.data;
}

// ✅ Upload avatar image
export async function uploadAvatarImage(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axios.post<ApiSuccessResponse<{ avatarUrl: string }>>(
    "/api/user/upload-avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
}
