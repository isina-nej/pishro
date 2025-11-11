# 🔐 API احراز هویت برای CMS

این مستند نحوه استفاده از API های احراز هویت برای پروژه `pishro-admin` CMS را توضیح می‌دهد.

## 📋 فهرست

1. [نصب و پیکربندی](#نصب-و-پیکربندی)
2. [API Endpoints](#api-endpoints)
3. [مثال‌های استفاده](#مثالهای-استفاده)
4. [مدیریت Session](#مدیریت-session)
5. [مدیریت خطاها](#مدیریت-خطاها)

---

## نصب و پیکربندی

### 1. تنظیم متغیرهای محیطی

در پروژه اصلی (pishro)، متغیر محیطی زیر را اضافه کنید:

```env
# .env.local
NEXT_PUBLIC_CMS_URL=http://localhost:3001
# یا آدرس production CMS شما
```

### 2. پیکربندی CMS

در پروژه CMS (`pishro-admin`)، آدرس API را تنظیم کنید:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
# یا آدرس production API شما
```

---

## API Endpoints

### 1. Login (ورود)

**Endpoint:** `POST /api/auth/login`

**توضیحات:** احراز هویت کاربر با شماره تلفن و رمز عبور

**Request Body:**
```json
{
  "phone": "09123456789",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "ورود با موفقیت انجام شد",
  "data": {
    "id": "user-id",
    "phone": "09123456789",
    "role": "ADMIN",
    "firstName": "علی",
    "lastName": "احمدی",
    "name": "علی احمدی",
    "email": "ali@example.com",
    "phoneVerified": true,
    "avatarUrl": "https://..."
  }
}
```

**Response (Error):**
```json
{
  "status": "fail",
  "message": "شماره تلفن یا رمز عبور اشتباه است",
  "data": {
    "auth": "شماره تلفن یا رمز عبور اشتباه است"
  }
}
```

**Status Codes:**
- `200`: ورود موفق
- `401`: اطلاعات ورود نادرست
- `422`: خطای اعتبارسنجی (validation error)
- `500`: خطای سرور

---

### 2. Session Check (بررسی نشست)

**Endpoint:** `GET /api/auth/session`

**توضیحات:** بررسی وضعیت احراز هویت کاربر فعلی

**Request:** بدون نیاز به body

**Response (Success):**
```json
{
  "status": "success",
  "message": "نشست کاربر فعال است",
  "data": {
    "user": {
      "id": "user-id",
      "phone": "09123456789",
      "name": "علی احمدی",
      "role": "ADMIN"
    }
  }
}
```

**Response (Unauthorized):**
```json
{
  "status": "fail",
  "message": "کاربر احراز هویت نشده است",
  "data": {
    "auth": "کاربر احراز هویت نشده است"
  }
}
```

**Status Codes:**
- `200`: کاربر احراز هویت شده
- `401`: کاربر احراز هویت نشده

---

### 3. Logout (خروج)

**Endpoint:** `POST /api/auth/logout`

**توضیحات:** خروج کاربر و پاک کردن session

**Request:** بدون نیاز به body

**Response (Success):**
```json
{
  "status": "success",
  "message": "خروج با موفقیت انجام شد",
  "data": {
    "loggedOut": true
  }
}
```

**Status Codes:**
- `200`: خروج موفق
- `500`: خطای سرور

---

## مثال‌های استفاده

### استفاده با Fetch API

```typescript
// Login
async function login(phone: string, password: string) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // مهم: برای ارسال cookies
    body: JSON.stringify({ phone, password }),
  });

  const data = await response.json();

  if (data.status === 'success') {
    console.log('User:', data.data);
    return data.data;
  } else {
    throw new Error(data.message);
  }
}

// Check Session
async function checkSession() {
  const response = await fetch('http://localhost:3000/api/auth/session', {
    method: 'GET',
    credentials: 'include', // مهم: برای ارسال cookies
  });

  const data = await response.json();
  return data.status === 'success' ? data.data.user : null;
}

// Logout
async function logout() {
  const response = await fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // مهم: برای ارسال cookies
  });

  const data = await response.json();
  return data.status === 'success';
}
```

### استفاده با Axios

```typescript
import axios from 'axios';

// تنظیم axios برای ارسال خودکار cookies
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // مهم: برای ارسال cookies
});

// Login
async function login(phone: string, password: string) {
  try {
    const response = await api.post('/api/auth/login', {
      phone,
      password,
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'خطا در ورود');
    }
    throw error;
  }
}

// Check Session
async function checkSession() {
  try {
    const response = await api.get('/api/auth/session');
    return response.data.data.user;
  } catch (error) {
    return null;
  }
}

// Logout
async function logout() {
  try {
    await api.post('/api/auth/logout');
    return true;
  } catch (error) {
    return false;
  }
}
```

### استفاده در React Component

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

interface User {
  id: string;
  phone: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // بررسی session در بارگذاری اولیه
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const response = await api.get('/api/auth/session');
      if (response.data.status === 'success') {
        setUser(response.data.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(phone: string, password: string) {
    try {
      const response = await api.post('/api/auth/login', {
        phone,
        password,
      });

      if (response.data.status === 'success') {
        setUser(response.data.data);
        return { success: true };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data.message || 'خطا در ورود',
        };
      }
      return { success: false, error: 'خطای ناشناخته' };
    }
  }

  async function logout() {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    user,
    loading,
    login,
    logout,
    checkSession,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };
}
```

---

## مدیریت Session

### نکات مهم:

1. **Cookies:** Session با استفاده از HTTP-only cookies مدیریت می‌شود
2. **credentials: 'include':** همیشه باید در درخواست‌های fetch یا axios فعال باشد
3. **CORS:** سرور به طور خودکار CORS را برای دامنه‌های مجاز پشتیبانی می‌کند
4. **Auto-refresh:** برای بررسی خودکار session، می‌توانید از `useEffect` استفاده کنید

### مثال Auto-refresh:

```typescript
// بررسی session هر 5 دقیقه
useEffect(() => {
  const interval = setInterval(() => {
    checkSession();
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(interval);
}, []);
```

---

## مدیریت خطاها

### انواع خطاها:

#### 1. Validation Error (422)
```json
{
  "status": "fail",
  "message": "فرمت شماره تلفن نامعتبر است",
  "data": {
    "phone": "فرمت شماره تلفن نامعتبر است. باید 09XXXXXXXXX باشد"
  }
}
```

#### 2. Authentication Error (401)
```json
{
  "status": "fail",
  "message": "شماره تلفن یا رمز عبور اشتباه است",
  "data": {
    "auth": "شماره تلفن یا رمز عبور اشتباه است"
  }
}
```

#### 3. Server Error (500)
```json
{
  "status": "error",
  "message": "خطایی در فرآیند ورود رخ داد",
  "code": "INTERNAL_ERROR"
}
```

### مثال مدیریت خطا:

```typescript
async function handleLogin(phone: string, password: string) {
  try {
    const response = await api.post('/api/auth/login', {
      phone,
      password,
    });

    if (response.data.status === 'success') {
      // Success
      return { success: true, user: response.data.data };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      if (data?.status === 'fail') {
        // Client error (validation, auth, etc.)
        return {
          success: false,
          error: data.message,
          fields: data.data, // خطاهای فیلد به فیلد
        };
      }

      if (data?.status === 'error') {
        // Server error
        return {
          success: false,
          error: data.message,
          code: data.code,
        };
      }
    }

    return {
      success: false,
      error: 'خطای ناشناخته رخ داد',
    };
  }
}
```

---

## الزامات امنیتی

### 1. HTTPS در Production
در محیط production حتماً از HTTPS استفاده کنید:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. تنظیم CORS
آدرس CMS خود را در متغیرهای محیطی تنظیم کنید:
```env
NEXT_PUBLIC_CMS_URL=https://admin.yourdomain.com
```

### 3. محافظت از Admin Routes
پس از login، همیشه `role` کاربر را بررسی کنید:
```typescript
if (user?.role !== 'ADMIN') {
  // Redirect to unauthorized page
  router.push('/unauthorized');
}
```

### 4. Timeout مدیریت Session
اگر session منقضی شد، کاربر را به صفحه login هدایت کنید:
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## پشتیبانی

اگر سوالی دارید یا مشکلی پیش آمد، با تیم توسعه تماس بگیرید.

**مخزن پروژه:** [amir-9/pishro](https://github.com/amir-9/pishro)
