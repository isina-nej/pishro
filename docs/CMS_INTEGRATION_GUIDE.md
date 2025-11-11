# 🚀 راهنمای یکپارچه‌سازی CMS با API احراز هویت

این راهنما برای برنامه‌نویس پروژه `pishro-admin` CMS نوشته شده است.

---

## ⚡ شروع سریع

### 1️⃣ تنظیمات اولیه

در پروژه CMS خود، فایل `.env.local` را ایجاد کنید:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**در production:**
```env
NEXT_PUBLIC_API_URL=https://api.pishro.com
```

---

## 🔧 پیاده‌سازی

### گام 1: ایجاد API Client

فایل `lib/api-client.ts` را ایجاد کنید:

```typescript
// lib/api-client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true, // 🔥 خیلی مهم: برای ارسال cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// مدیریت خطاهای عمومی
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session منقضی شده - redirect به صفحه login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

### گام 2: ایجاد Auth Service

فایل `lib/auth-service.ts` را ایجاد کنید:

```typescript
// lib/auth-service.ts
import { apiClient } from './api-client';

export interface User {
  id: string;
  phone: string;
  role: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phoneVerified: boolean;
  avatarUrl?: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
}

/**
 * ورود کاربر
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      '/api/auth/login',
      credentials
    );

    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'خطا در ورود');
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در برقراری ارتباط با سرور'
    );
  }
}

/**
 * بررسی session فعلی
 */
export async function checkSession(): Promise<User | null> {
  try {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      '/api/auth/session'
    );

    if (response.data.status === 'success' && response.data.data?.user) {
      return response.data.data.user;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * خروج از حساب
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
}
```

---

### گام 3: ایجاد Auth Context

فایل `contexts/auth-context.tsx` را ایجاد کنید:

```typescript
// contexts/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, login as loginService, logout as logoutService, checkSession } from '@/lib/auth-service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // بررسی session در بارگذاری اولیه
  useEffect(() => {
    checkCurrentSession();
  }, []);

  async function checkCurrentSession() {
    try {
      const currentUser = await checkSession();
      setUser(currentUser);
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(phone: string, password: string) {
    try {
      const userData = await loginService({ phone, password });
      setUser(userData);
    } catch (error: any) {
      throw error;
    }
  }

  async function logout() {
    try {
      await logoutService();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

### گام 4: اضافه کردن Provider به Layout

در فایل `app/layout.tsx`:

```typescript
// app/layout.tsx
import { AuthProvider } from '@/contexts/auth-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### گام 5: ایجاد صفحه Login

فایل `app/login/page.tsx` را ایجاد کنید:

```typescript
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(phone, password);
      router.push('/dashboard'); // یا صفحه اصلی CMS
    } catch (err: any) {
      setError(err.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          ورود به پنل مدیریت
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              شماره تلفن
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور خود را وارد کنید"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### گام 6: محافظت از صفحات (Protected Routes)

فایل `components/protected-route.tsx` را ایجاد کنید:

```typescript
// components/protected-route.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>در حال بارگذاری...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

استفاده در صفحات محافظت شده:

```typescript
// app/dashboard/page.tsx
'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">داشبورد</h1>
          <div className="flex items-center gap-4">
            <span>خوش آمدید، {user?.name || user?.phone}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              خروج
            </button>
          </div>
        </div>

        {/* محتوای dashboard */}
      </div>
    </ProtectedRoute>
  );
}
```

---

## 🔐 استفاده از API در درخواست‌های دیگر

بعد از login، برای دسترسی به API های admin:

```typescript
// مثال: دریافت لیست کاربران
import { apiClient } from '@/lib/api-client';

async function fetchUsers() {
  try {
    const response = await apiClient.get('/api/admin/users', {
      params: {
        page: 1,
        limit: 20,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// مثال: ایجاد دوره جدید
async function createCourse(courseData: any) {
  try {
    const response = await apiClient.post('/api/admin/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}

// مثال: آپلود تصویر
async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
```

---

## ⚠️ نکات مهم

### 1. **همیشه withCredentials را true کنید**
```typescript
// ✅ درست
axios.create({ withCredentials: true });

// ❌ غلط
axios.create({ withCredentials: false });
```

### 2. **بررسی role کاربر**
```typescript
const { user, isAdmin } = useAuth();

if (isAdmin) {
  // دسترسی به امکانات ادمین
} else {
  // عدم دسترسی
}
```

### 3. **مدیریت خطای 401**
خطای 401 یعنی session منقضی شده. کاربر را به صفحه login هدایت کنید:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. **HTTPS در Production**
```env
# ❌ در production استفاده نکنید
NEXT_PUBLIC_API_URL=http://api.pishro.com

# ✅ حتماً HTTPS
NEXT_PUBLIC_API_URL=https://api.pishro.com
```

### 5. **بررسی دوره‌ای Session**
برای امنیت بیشتر، هر 5 دقیقه یکبار session را بررسی کنید:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    checkSession();
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(interval);
}, []);
```

---

## 📊 جدول API Endpoints

| Method | Endpoint | توضیحات | نیاز به Auth |
|--------|----------|---------|-------------|
| POST | `/api/auth/login` | ورود کاربر | ❌ |
| GET | `/api/auth/session` | بررسی session | ✅ |
| POST | `/api/auth/logout` | خروج کاربر | ✅ |
| GET | `/api/admin/users` | لیست کاربران | ✅ (Admin) |
| POST | `/api/admin/courses` | ایجاد دوره | ✅ (Admin) |
| PUT | `/api/admin/courses/:id` | ویرایش دوره | ✅ (Admin) |
| DELETE | `/api/admin/courses/:id` | حذف دوره | ✅ (Admin) |

---

## 🐛 عیب‌یابی (Troubleshooting)

### مشکل: Session ذخیره نمی‌شود

**علت:** `withCredentials` فعال نیست

**راه حل:**
```typescript
// در تمام درخواست‌ها
axios.create({ withCredentials: true });

// یا در fetch
fetch(url, { credentials: 'include' });
```

---

### مشکل: خطای CORS

**علت:** دامنه CMS در لیست allowed origins نیست

**راه حل:**
در پروژه اصلی (pishro)، متغیر محیطی را تنظیم کنید:
```env
NEXT_PUBLIC_CMS_URL=http://localhost:3001
```

---

### مشکل: خطای 401 بعد از login

**علت 1:** Cookie ارسال نمی‌شود

**راه حل:** `withCredentials: true` را بررسی کنید

**علت 2:** Session منقضی شده

**راه حل:** دوباره login کنید

---

## 📞 پشتیبانی

اگر مشکلی دارید:
1. ابتدا console browser را بررسی کنید
2. Network tab را چک کنید (cookies ارسال شده یا نه؟)
3. با تیم backend تماس بگیرید

---

## ✅ Checklist پیاده‌سازی

- [ ] نصب axios و تنظیم `withCredentials: true`
- [ ] ایجاد `api-client.ts`
- [ ] ایجاد `auth-service.ts`
- [ ] ایجاد `auth-context.tsx`
- [ ] اضافه کردن `AuthProvider` به layout
- [ ] ایجاد صفحه login
- [ ] ایجاد `ProtectedRoute` component
- [ ] محافظت از صفحات admin
- [ ] تست login و logout
- [ ] تست دسترسی به API های admin
- [ ] تنظیم متغیرهای محیطی production

---

**موفق باشید! 🎉**
