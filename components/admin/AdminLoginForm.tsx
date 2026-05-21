'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLoginFormProps {
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export default function AdminLoginForm({ onError, onSuccess }: AdminLoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // فارسی و انگلیسی: 0912345678 یا 0-912-345-678
    const phoneRegex = /^(\+?98|0)?9\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      phone: '',
      password: '',
    };

    if (loginType === 'email') {
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email';
      }
    } else {
      if (!formData.phone) {
        errors.phone = 'Phone is required';
      } else if (!validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid phone (09xxxxxxxxx)';
      }
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return !(loginType === 'email' ? errors.email : errors.phone) && !errors.password;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: loginType === 'email' ? formData.email : undefined,
          phone: loginType === 'phone' ? formData.phone : undefined,
          password: formData.password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Login failed. Please try again.';
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
        return;
      }

      // Store token in localStorage as backup
      if (data.accessToken) {
        localStorage.setItem('admin_access_token', data.accessToken);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      }

      setSuccess(true);
      setFormData({ email: '', phone: '', password: '' });
      
      // Call success callback
      onSuccess?.();

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 500);
    } catch (err) {
      const errorMessage = 'An error occurred. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-right">
        <div className="flex items-center justify-end gap-3 mb-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-3 shadow-lg">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            پنل ادمین
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          وارد حساب ادمین خود شوید
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <p className="text-green-800 dark:text-green-200 font-medium">
              Login successful! Redirecting...
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border border-red-300 dark:border-red-700 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">❌</span>
            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Login Type Toggle */}
        <div className="flex gap-3 mb-8 flex-row-reverse">
          <button
            type="button"
            onClick={() => {
              setLoginType('email');
              setFormData({ ...formData, phone: '' });
              setFieldErrors({ ...fieldErrors, phone: '' });
            }}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg',
              loginType === 'email'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <Mail className="size-4 md:size-5" />
            ایمیل
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('phone');
              setFormData({ ...formData, email: '' });
              setFieldErrors({ ...fieldErrors, email: '' });
            }}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg',
              loginType === 'phone'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <span className="text-base md:text-lg">📱</span>
            موبایل
          </button>
        </div>

        {/* Email Input */}
        {loginType === 'email' && (
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-gray-900 dark:text-white text-right">
              آدرس ایمیل
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 size-5 text-blue-500 dark:text-blue-400 pointer-events-none" />
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="admin@pishrosarmaye.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={cn(
                  'pl-12 pr-4 py-3 block w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-0 focus-visible:border-blue-500 transition text-right text-sm md:text-base',
                  fieldErrors.email && 'border-red-500 dark:border-red-500'
                )}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1 text-right flex items-center justify-end gap-1">
                <span>⚠️</span> {fieldErrors.email}
              </p>
            )}
          </div>
        )}

        {/* Phone Input */}
        {loginType === 'phone' && (
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-bold text-gray-900 dark:text-white text-right">
              شماره موبایل
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-lg pointer-events-none">📱</span>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="09123456789"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                className={cn(
                  'pl-12 pr-4 py-3 block w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-0 focus-visible:border-purple-500 transition text-right text-sm md:text-base',
                  fieldErrors.phone && 'border-red-500 dark:border-red-500'
                )}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-red-500 text-xs mt-1 text-right flex items-center justify-end gap-1">
                <span>⚠️</span> {fieldErrors.phone}
              </p>
            )}
          </div>
        )}

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-bold text-gray-900 dark:text-white text-right">
            کلمه عبور
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 size-5 text-purple-500 dark:text-purple-400 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
              disabled={isLoading}
            >
              {showPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </button>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="کلمه عبور را وارد کنید"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={cn(
                'pl-12 pr-12 py-3 block w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-0 focus-visible:border-purple-500 transition text-right text-sm md:text-base',
                fieldErrors.password && 'border-red-500 dark:border-red-500'
              )}
            />
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1 text-right flex items-center justify-end gap-1">
              <span>⚠️</span> {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center flex-row-reverse gap-3 py-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer transition accent-blue-600"
          />
          <label htmlFor="rememberMe" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            مرا 30 روز به مرور بسپار
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-bold text-base md:text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl',
            isLoading
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              درحال ورود...
            </>
          ) : (
            <>
              <span>🔐</span>
              ورود
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Pishro Sarmaye © {new Date().getFullYear()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          تمام حقوق محفوظ است
        </p>
      </div>
    </div>
  );
}
