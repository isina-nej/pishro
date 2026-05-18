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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to your admin account
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm">
            Login successful! Redirecting...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Login Type Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setLoginType('email');
              setFormData({ ...formData, phone: '' });
              setFieldErrors({ ...fieldErrors, phone: '' });
            }}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition',
              loginType === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            )}
          >
            <Mail className="inline-block mr-2 size-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('phone');
              setFormData({ ...formData, email: '' });
              setFieldErrors({ ...fieldErrors, email: '' });
            }}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition',
              loginType === 'phone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            )}
          >
            📱 Phone
          </button>
        </div>

        {/* Email Input */}
        {loginType === 'email' && (
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 size-5 text-gray-400 dark:text-gray-500" />
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="admin@pishrosarmaye.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={cn(
                  'pr-10 pl-4 py-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition',
                  fieldErrors.email && 'border-red-500 dark:border-red-500'
                )}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-2">{fieldErrors.email}</p>
            )}
          </div>
        )}

        {/* Phone Input */}
        {loginType === 'phone' && (
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute right-3 top-3 text-gray-400 dark:text-gray-500">📱</span>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="09123456789"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                className={cn(
                  'pr-10 pl-4 py-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition',
                  fieldErrors.phone && 'border-red-500 dark:border-red-500'
                )}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-red-500 text-xs mt-2">{fieldErrors.phone}</p>
            )}
          </div>
        )}

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute right-10 top-3 size-5 text-gray-400 dark:text-gray-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={cn(
                'pr-10 pl-4 py-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition',
                fieldErrors.password && 'border-red-500 dark:border-red-500'
              )}
            />
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-2">{fieldErrors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full py-2 px-4 rounded-lg font-bold transition',
            isLoading
              ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white'
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Pishro Sarmaye © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
