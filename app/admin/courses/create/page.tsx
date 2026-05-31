'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Plus, Settings2, Sparkles } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api-client';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useCreateAdminCourse } from '@/lib/hooks/useAdminCourses';

export const dynamic = 'force-dynamic';

interface CategoryOption {
  id: string;
  title: string;
  slug: string;
}

interface CourseFormData {
  subject: string;
  slug: string;
  price: number;
  description: string;
  categoryId: string;
  instructor: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | '';
  status: 'ACTIVE' | 'COMING_SOON' | 'ARCHIVED';
  published: boolean;
  featured: boolean;
  hasChapters: boolean;
}

const steps = [
  { id: 'content', title: 'محتوا', description: 'عنوان و توضیحات' },
  { id: 'details', title: 'جزئیات', description: 'قیمت و دسته‌بندی' },
  { id: 'publish', title: 'انتشار', description: 'وضعیت و نمایش' },
];

const levelLabels: Record<Exclude<CourseFormData['level'], ''>, string> = {
  BEGINNER: 'مقدماتی',
  INTERMEDIATE: 'متوسط',
  ADVANCED: 'پیشرفته',
};

const statusLabels: Record<CourseFormData['status'], string> = {
  ACTIVE: 'فعال',
  COMING_SOON: 'به‌زودی',
  ARCHIVED: 'آرشیو',
};

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAdminAuth();
  const [formData, setFormData] = useState<CourseFormData>({
    subject: '',
    slug: '',
    price: 0,
    description: '',
    categoryId: '',
    instructor: '',
    level: '',
    status: 'ACTIVE',
    published: true,
    featured: false,
    hasChapters: false,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createCourseMutation = useCreateAdminCourse();
  const isSubmitting = createCourseMutation.isPending;

  useEffect(() => {
    if (!user) return;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const { data } = await api.get('/api/admin/categories?limit=100&published=true');
        setCategories(data.data?.items ?? []);
      } catch (error) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', error);
        setSubmitError('دسته‌بندی‌ها دریافت نشدند. می‌توانید دوره را بدون دسته‌بندی بسازید.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [user]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === formData.categoryId),
    [categories, formData.categoryId]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? Number(value)
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      nextErrors.subject = 'عنوان دوره الزامی است';
    }

    if (formData.price < 0) {
      nextErrors.price = 'قیمت باید عدد نامنفی باشد';
    }

    if (!Number.isInteger(formData.price)) {
      nextErrors.price = 'قیمت باید عدد صحیح باشد';
    }

    if (formData.slug && formData.slug.length > 220) {
      nextErrors.slug = 'آدرس دوره بیش از حد طولانی است';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (!validate()) {
      setActiveStep(0);
      return;
    }

    try {
      const result = await createCourseMutation.mutateAsync({
        subject: formData.subject,
        slug: formData.slug || undefined,
        price: formData.price,
        description: formData.description || undefined,
        categoryId: formData.categoryId || undefined,
        instructor: formData.instructor || undefined,
        level: formData.level || undefined,
        status: formData.status,
        published: formData.published,
        featured: formData.featured,
        hasChapters: formData.hasChapters,
      });

      router.push(`/admin/courses/${result.id}/edit`);
    } catch (error) {
      console.error('خطا در ایجاد دوره:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'ایجاد دوره ناموفق بود. اطلاعات را بررسی کنید و دوباره تلاش کنید.'
      );
    }
  };

  if (isAuthLoading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return null;
  }

  const content = (
    <AdminPageShell
      title="افزودن دوره جدید"
      description="اطلاعات اصلی، دسته‌بندی و وضعیت انتشار دوره را مرحله‌به‌مرحله تکمیل کنید."
      actions={
        <Button variant="outline" asChild>
          <Link href="/admin/courses">
            بازگشت به دوره‌ها
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="grid border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-3">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`flex items-center justify-end gap-3 px-4 py-3 text-right transition ${
                    activeStep === index
                      ? 'bg-white text-blue-700 dark:bg-slate-900 dark:text-blue-300'
                      : 'text-slate-500 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-slate-900/70'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-xs">{step.description}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {submitError}
                </div>
              )}

              {activeStep === 0 && (
                <div className="space-y-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">عنوان دوره *</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={(event) => {
                          handleInputChange(event);
                          if (!formData.slug) {
                            setFormData((prev) => ({ ...prev, slug: createSlug(event.target.value) }));
                          }
                        }}
                        placeholder="مثلاً آموزش جامع تحلیل تکنیکال"
                        disabled={isSubmitting}
                        maxLength={200}
                        className="text-right"
                      />
                      {errors.subject && <p className="text-xs text-red-600">{errors.subject}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">آدرس دوره</label>
                      <Input
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="technical-analysis"
                        disabled={isSubmitting}
                        className="text-left"
                        dir="ltr"
                      />
                      {errors.slug && <p className="text-xs text-red-600">{errors.slug}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">توضیح دوره</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="خلاصه‌ای از دوره، خروجی یادگیری و مناسب بودن آن برای دانشجو..."
                      rows={6}
                      disabled={isSubmitting}
                      className="text-right"
                    />
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">قیمت *</label>
                    <Input
                      type="number"
                      name="price"
                      min={0}
                      max={2147483647}
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      disabled={isSubmitting}
                      className="text-right"
                    />
                    {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">مدرس</label>
                    <Input
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      placeholder="نام مدرس دوره"
                      disabled={isSubmitting}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">دسته‌بندی</label>
                    <Select
                      value={formData.categoryId || 'none'}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, categoryId: value === 'none' ? '' : value }))
                      }
                      disabled={isSubmitting || categoriesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={categoriesLoading ? 'در حال دریافت...' : 'انتخاب دسته‌بندی'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون دسته‌بندی</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">سطح دوره</label>
                    <Select
                      value={formData.level || 'none'}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          level: value === 'none' ? '' : (value as CourseFormData['level']),
                        }))
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب سطح" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">تعیین نشده</SelectItem>
                        <SelectItem value="BEGINNER">مقدماتی</SelectItem>
                        <SelectItem value="INTERMEDIATE">متوسط</SelectItem>
                        <SelectItem value="ADVANCED">پیشرفته</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">وضعیت دوره</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value as CourseFormData['status'] }))
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">فعال</SelectItem>
                        <SelectItem value="COMING_SOON">به‌زودی</SelectItem>
                        <SelectItem value="ARCHIVED">آرشیو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {[
                    { key: 'published', label: 'نمایش در سایت', hint: 'دوره برای کاربران قابل مشاهده باشد' },
                    { key: 'featured', label: 'دوره ویژه', hint: 'در بخش‌های منتخب نمایش داده شود' },
                    { key: 'hasChapters', label: 'دارای فصل‌بندی', hint: 'بعداً درس‌ها را داخل فصل‌ها مرتب کنید' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(formData[item.key as keyof CourseFormData])}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, [item.key]: event.target.checked }))
                        }
                        className="mt-1"
                        disabled={isSubmitting}
                      />
                      <span className="text-right">
                        <span className="block text-sm font-semibold text-slate-950 dark:text-white">{item.label}</span>
                        <span className="text-xs leading-6 text-slate-500 dark:text-slate-400">{item.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
                  disabled={activeStep === 0 || isSubmitting}
                >
                  مرحله قبل
                </Button>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  {activeStep < steps.length - 1 ? (
                    <Button onClick={() => setActiveStep((step) => Math.min(steps.length - 1, step + 1))}>
                      مرحله بعد
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      ایجاد دوره
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant={formData.published ? 'default' : 'outline'}>
                {formData.published ? 'منتشر می‌شود' : 'مخفی'}
              </Badge>
              <div className="flex items-center gap-2 text-right">
                <div>
                  <h2 className="font-semibold text-slate-950 dark:text-white">پیش‌نمایش دوره</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">قبل از ثبت نهایی</p>
                </div>
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-right dark:border-slate-800 dark:bg-slate-900/70">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                {formData.subject || 'عنوان دوره'}
              </h3>
              <p className="line-clamp-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                {formData.description || 'توضیح کوتاه دوره اینجا نمایش داده می‌شود.'}
              </p>
              <div className="flex flex-wrap justify-end gap-2">
                <Badge variant="secondary">{formData.price.toLocaleString('fa-IR')} تومان</Badge>
                {selectedCategory && <Badge variant="outline">{selectedCategory.title}</Badge>}
                {formData.level && <Badge variant="outline">{levelLabels[formData.level]}</Badge>}
                <Badge variant="outline">{statusLabels[formData.status]}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center justify-end gap-2">
              <h2 className="font-semibold text-slate-950 dark:text-white">چک‌لیست ثبت</h2>
              <Settings2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              {[
                { done: Boolean(formData.subject.trim()), label: 'عنوان دوره وارد شده' },
                { done: formData.price >= 0, label: 'قیمت معتبر است' },
                { done: Boolean(formData.description.trim()), label: 'توضیحات تکمیل شده' },
                { done: Boolean(formData.categoryId), label: 'دسته‌بندی انتخاب شده' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-end gap-2 text-sm">
                  <span className={item.done ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}>
                    {item.label}
                  </span>
                  <CheckCircle2 className={`h-4 w-4 ${item.done ? 'text-green-600' : 'text-slate-300'}`} />
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </AdminPageShell>
  );

  return (
    <AdminSidebar user={user} currentPage="courses" onLogout={logout}>
      {content}
    </AdminSidebar>
  );
}
