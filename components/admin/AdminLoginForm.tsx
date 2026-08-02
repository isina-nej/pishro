'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Mail, Phone, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminAuthKeys } from '@/lib/hooks/useAdminAuth';

interface AdminLoginFormProps {
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+?98|0)?9\d{9}$/;

type IdentifierType = 'email' | 'phone';

const detectIdentifierType = (value: string): IdentifierType =>
  value.includes('@') ? 'email' : 'phone';

// Server-side lookup is an exact string match against AdminUser.phone,
// which is seeded/stored as "09xxxxxxxxx" — without this normalization,
// client-accepted variants like "+98912..." or "912..." pass validation
// but silently fail the login lookup.
const normalizePhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('98')) return `0${digits.slice(2)}`;
  if (digits.startsWith('0')) return digits;
  return `0${digits}`;
};

export default function AdminLoginForm({ onError, onSuccess }: AdminLoginFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ identifier: '', password: '' });

  const identifierType = detectIdentifierType(identifier);
  const IdentifierIcon = identifierType === 'email' ? Mail : Phone;

  const validate = (): boolean => {
    const trimmed = identifier.trim();
    const errors = { identifier: '', password: '' };

    if (!trimmed) {
      errors.identifier = 'شماره موبایل یا ایمیل الزامی است';
    } else if (detectIdentifierType(trimmed) === 'email') {
      if (!EMAIL_REGEX.test(trimmed)) errors.identifier = 'ایمیل وارد شده معتبر نیست';
    } else if (!PHONE_REGEX.test(trimmed.replace(/\D/g, ''))) {
      errors.identifier = 'شماره موبایل وارد شده معتبر نیست';
    }

    if (!password) {
      errors.password = 'کلمه عبور الزامی است';
    } else if (password.length < 6) {
      errors.password = 'کلمه عبور باید حداقل ۶ کاراکتر باشد';
    }

    setFieldErrors(errors);
    return !errors.identifier && !errors.password;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsLoading(true);

    const trimmed = identifier.trim();
    const type = detectIdentifierType(trimmed);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: type === 'email' ? trimmed.toLowerCase() : undefined,
          phone: type === 'phone' ? normalizePhone(trimmed) : undefined,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'ورود ناموفق بود. دوباره تلاش کنید.';
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data.accessToken) {
        localStorage.setItem('admin_access_token', data.accessToken);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      }

      // Warm the shared admin-auth query cache with the real user right away.
      // Without this, the /admin/login mount already cached this same query
      // as "logged out", and the redirect below would land on /admin/dashboard
      // still reading that stale cached value for up to its 5-minute staleTime
      // — i.e. the login would silently appear to fail even on success.
      queryClient.setQueryData(adminAuthKeys.me(), data.user);

      setSuccess(true);
      onSuccess?.();
      router.push('/admin/dashboard');
    } catch {
      const errorMessage = 'خطایی رخ داد. دوباره تلاش کنید.';
      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if (fieldErrors.identifier) setFieldErrors((prev) => ({ ...prev, identifier: '' }));
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
    if (error) setError(null);
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center">
          <Image
            src="/logo/logo-login.png"
            alt="پیشرو"
            width={72}
            height={72}
            className="shrink-0 rounded-2xl object-cover shadow-lg"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-foreground">پنل مدیریت پیشرو</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          برای ورود، اطلاعات حساب ادمین خود را وارد کنید
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4">
          <CheckCircle2 className="size-5 shrink-0 text-success" />
          <p className="text-sm font-medium text-success">ورود موفق. در حال انتقال...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="size-5 shrink-0 text-destructive" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Identifier Input — accepts either email or phone in a single field */}
        <div className="space-y-2">
          <label htmlFor="identifier" className="block text-right text-sm font-semibold text-foreground">
            شماره موبایل یا ایمیل
          </label>
          <div className="relative">
            <IdentifierIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="identifier"
              type="text"
              name="identifier"
              inputMode="email"
              autoComplete="username"
              placeholder="09xxxxxxxxx یا admin@pishrosarmaye.com"
              value={identifier}
              onChange={handleIdentifierChange}
              disabled={isLoading}
              className={cn(
                'h-12 rounded-xl border-2 pl-11 pr-4 text-right text-sm md:text-base',
                fieldErrors.identifier && 'border-destructive focus-visible:ring-destructive'
              )}
            />
          </div>
          {fieldErrors.identifier && (
            <p className="flex items-center justify-end gap-1 text-right text-xs text-destructive">
              {fieldErrors.identifier}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-right text-sm font-semibold text-foreground">
            کلمه عبور
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
            </button>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="کلمه عبور را وارد کنید"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              className={cn(
                'h-12 rounded-xl border-2 pl-11 pr-11 text-right text-sm md:text-base',
                fieldErrors.password && 'border-destructive focus-visible:ring-destructive'
              )}
            />
          </div>
          {fieldErrors.password && (
            <p className="flex items-center justify-end gap-1 text-right text-xs text-destructive">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-end gap-3 py-1">
          <label htmlFor="rememberMe" className="cursor-pointer select-none text-sm font-medium text-muted-foreground">
            مرا ۳۰ روز به خاطر بسپار
          </label>
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="size-5 cursor-pointer rounded-md border-2 border-input text-primary accent-primary focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-bold shadow-md transition-colors',
            isLoading
              ? 'cursor-not-allowed bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              درحال ورود...
            </>
          ) : (
            'ورود به پنل'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          پیشرو سرمایه © {new Date().getFullYear()} — تمام حقوق محفوظ است
        </p>
      </div>
    </div>
  );
}
