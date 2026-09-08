'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  PublishedSwitch,
  SaveBar,
  TextField,
} from '@/components/admin/landing/CmsFormFields';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  useAdminBusinessConsulting,
  useUpdateBusinessConsulting,
} from '@/lib/hooks/useAdminLandingCms';

type Dict = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export default function LandingBusinessCmsPage() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const { data: page, isLoading } = useAdminBusinessConsulting();
  const update = useUpdateBusinessConsulting(str(page?.id));
  const [form, setForm] = useState<Dict>({});

  useEffect(() => {
    if (page) setForm({ ...page });
  }, [page]);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  if (authLoading || isLoading) {
    return (
      <AdminPageShell title="مشاوره کسب‌وکار" description="ویرایش صفحه مشاوره">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }
  if (!user) return null;
  if (!page?.id) {
    return (
      <AdminPageShell title="مشاوره کسب‌وکار" description="ویرایش صفحه مشاوره">
        <p className="text-sm text-muted-foreground">رکوردی یافت نشد — ابتدا seed را اجرا کنید.</p>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="مشاوره کسب‌وکار — ساختار و راه‌های تماس"
      description="تنظیمات اطلاعات تماس، آیدی تلگرام و متن‌های تخصصی مشاوره"
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" asChild className="gap-1.5 text-xs font-semibold">
            <Link href="/admin/landing">
              <Sparkles className="size-3.5" />
              استودیو CMS صفحات
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/landing">
              <ArrowRight className="size-4" />
              بازگشت
            </Link>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="size-4 text-primary shrink-0" />
          <div>
            <span className="font-bold text-foreground">
              ویرایش زنده متون و تصویر صفحه مشاوره:
            </span>
            <p className="mt-0.5 text-muted-foreground">
              در استودیو CMS می‌توانید تصویر هیرو و کلیه متون مشاوره را با پیش‌نمایش زنده ویرایش کنید.
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild className="shrink-0 gap-1 text-xs">
          <Link href="/admin/landing">
            استودیو CMS
            <ArrowLeft className="size-3.5" />
          </Link>
        </Button>
      </div>

      <Card className="space-y-4 p-4">
        <TextField label="عنوان" value={str(form.title)} onChange={(v) => set('title', v)} />
        <TextField label="توضیحات" value={str(form.description)} onChange={(v) => set('description', v)} multiline />
        <TextField label="آدرس تصویر" value={str(form.image)} onChange={(v) => set('image', v)} dir="ltr" />
        <TextField label="شماره تماس" value={str(form.phoneNumber)} onChange={(v) => set('phoneNumber', v)} />
        <TextField label="آیدی تلگرام" value={str(form.telegramId)} onChange={(v) => set('telegramId', v)} dir="ltr" />
        <TextField label="لینک تلگرام" value={str(form.telegramLink)} onChange={(v) => set('telegramLink', v)} dir="ltr" />
        <TextField label="لینک دوره‌ها" value={str(form.coursesLink)} onChange={(v) => set('coursesLink', v)} dir="ltr" />
        <TextField label="عنوان مشاوره حضوری" value={str(form.inPersonTitle)} onChange={(v) => set('inPersonTitle', v)} />
        <TextField label="توضیح مشاوره حضوری" value={str(form.inPersonDescription)} onChange={(v) => set('inPersonDescription', v)} multiline />
        <TextField label="عنوان مشاوره آنلاین" value={str(form.onlineTitle)} onChange={(v) => set('onlineTitle', v)} />
        <TextField label="توضیح مشاوره آنلاین" value={str(form.onlineDescription)} onChange={(v) => set('onlineDescription', v)} multiline />
        <TextField label="عنوان دوره‌ها" value={str(form.coursesTitle)} onChange={(v) => set('coursesTitle', v)} />
        <TextField label="توضیح دوره‌ها" value={str(form.coursesDescription)} onChange={(v) => set('coursesDescription', v)} multiline />
        <TextField label="Meta Title" value={str(form.metaTitle)} onChange={(v) => set('metaTitle', v)} />
        <TextField label="Meta Description" value={str(form.metaDescription)} onChange={(v) => set('metaDescription', v)} multiline />
        <PublishedSwitch checked={Boolean(form.published)} onChange={(v) => set('published', v)} />
      </Card>
      <SaveBar
        saving={update.isPending}
        onSave={() => {
          const { id: _i, createdAt: _c, updatedAt: _u, ...payload } = form;
          update.mutateAsync(payload);
        }}
      />
    </AdminPageShell>
  );
}
