# ⚡ Quick Start - پیاده‌سازی سریع احراز هویت در CMS

راهنمای فوری برای راه‌اندازی احراز هویت در 5 دقیقه!

---

## 🎯 3 قدم برای شروع

### قدم 1: نصب و تنظیم axios

```bash
npm install axios
# یا
yarn add axios
```

ایجاد فایل `lib/api.ts`:

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true, // 🔥 مهم!
});
```

---

### قدم 2: ایجاد Auth Hook

ایجاد فایل `hooks/use-auth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  phone: string;
  name?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await api.get('/api/auth/session');
      setUser(res.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(phone: string, password: string) {
    const res = await api.post('/api/auth/login', { phone, password });
    setUser(res.data.data);
  }

  async function logout() {
    await api.post('/api/auth/logout');
    setUser(null);
  }

  return { user, loading, login, logout, isAuthenticated: !!user };
}
```

---

### قدم 3: استفاده در صفحه Login

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(phone, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ورود');
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="09123456789"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="رمز عبور"
      />
      {error && <p>{error}</p>}
      <button type="submit">ورود</button>
    </form>
  );
}
```

---

## ✅ تست سریع

### 1. تست Login در Console

```javascript
// باز کردن Console در مرورگر
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// تست login
await api.post('/api/auth/login', {
  phone: '09123456789',
  password: 'password123'
});

// تست session
await api.get('/api/auth/session');

// تست logout
await api.post('/api/auth/logout');
```

---

## 🔐 محافظت از صفحات

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!user) return null;

  return (
    <div>
      <h1>سلام {user.name}</h1>
      <button onClick={logout}>خروج</button>
    </div>
  );
}
```

---

## 🌐 متغیرهای محیطی

ایجاد فایل `.env.local`:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Production
# NEXT_PUBLIC_API_URL=https://api.pishro.com
```

---

## 🚨 چک‌لیست عیب‌یابی

اگر کار نمی‌کند:

- [ ] `withCredentials: true` تنظیم شده؟
- [ ] URL صحیح است؟ (`http://localhost:3000`)
- [ ] Console خطا نشان می‌دهد؟
- [ ] Network tab → cookies ارسال می‌شوند؟

---

## 📱 مثال کامل (Copy-Paste Ready)

```typescript
// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/auth/session')
      .then(res => setUser(res.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (phone: string, password: string) => {
    const res = await api.post('/api/auth/login', { phone, password });
    setUser(res.data.data);
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  return { user, loading, login, logout };
}

// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(phone, password);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'خطا در ورود');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={phone} onChange={e => setPhone(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>ورود</button>
    </form>
  );
}

// app/dashboard/page.tsx
'use client';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <h1>Dashboard - {user.name}</h1>
      <button onClick={logout}>خروج</button>
    </div>
  );
}
```

---

## 🎉 تمام!

حالا می‌تونید:
- ✅ Login کنید
- ✅ Session رو چک کنید
- ✅ Logout کنید
- ✅ از API های admin استفاده کنید

برای اطلاعات بیشتر: `CMS_INTEGRATION_GUIDE.md` 📖
