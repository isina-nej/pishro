import { api } from "@/lib/api-client";
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
    lessons?: { id: string }[];
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
  const { data } = await api.get<ApiSuccessResponse<UserData>>("/api/user/me");
  return data;
}

// ✅ Get enrolled courses
export async function getEnrolledCourses(page: number = 1, limit: number = 10) {
  const { data } = await api.get<ApiSuccessResponse<PaginatedData<EnrolledCourse>>>(
    `/api/user/enrolled-courses?page=${page}&limit=${limit}`
  );
  return data;
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

  const { data } = await api.get<ApiSuccessResponse<PaginatedData<Transaction>>>(url);
  return data;
}

// ✅ Get user orders
export async function getUserOrders(
  page: number = 1,
  limit: number = 10,
  status?: string
) {
  let url = `/api/user/orders?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;

  const { data } = await api.get<ApiSuccessResponse<PaginatedData<UserOrder>>>(url);
  return data;
}

// ✅ Update enrollment progress
export async function updateEnrollmentProgress(
  enrollmentId: string,
  progress: number,
  completed?: boolean
) {
  const { data } = await api.patch<ApiSuccessResponse<EnrolledCourse>>(
    "/api/user/enrollment",
    { enrollmentId, progress, completed }
  );
  return data;
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
  const { data: res } = await api.put<ApiSuccessResponse<UserData>>("/api/user/personal", data);
  return res;
}

// ✅ Update avatar
export async function updateAvatar(avatarUrl: string) {
  const { data } = await api.put("/api/user/avatar", { avatarUrl });
  return data;
}

// ✅ Update payment info
export async function updatePayInfo(data: {
  cardNumber: string;
  shebaNumber: string;
  accountOwner: string;
}) {
  const { data: res } = await api.put<ApiSuccessResponse<UserData>>("/api/user/pay", data);
  return res;
}

// ✅ Upload avatar image
export async function uploadAvatarImage(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post<ApiSuccessResponse<{ avatarUrl: string }>>(
    "/api/user/upload-avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}
