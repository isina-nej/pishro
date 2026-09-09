'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminEmptyState, AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { api } from '@/lib/api-client';
import {
  useAdminCategoriesList,
  useCreateAdminCategory,
  useDeleteAdminCategory,
} from '@/lib/hooks/useAdminCategories';

export const dynamic = 'force-dynamic';

type FormState = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  coverImage: string;
  color: string;
  published: boolean;
  featured: boolean;
  order: number;
};

const emptyForm = (): FormState => ({
  slug: '',
  title: '',
  description: '',
  icon: '',
  coverImage: '',
  color: '',
  published: true,
  featured: false,
  order: 0,
});

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminCategoriesPage() {
  const { user, isLoading: isAuthLoading } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const { data, isLoading, refetch } = useAdminCategoriesList(page, 50, {
    search: searchInput || undefined,
  });
  const createMutation = useCreateAdminCategory();
  const deleteMutation = useDeleteAdminCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; courses: number } | null>(null);

  if (isAuthLoading) return <AdminLoadingState />;
  if (!user) return null;

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const openCreate = () => {
    setForm(emptyForm());
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = (item: (typeof items)[number]) => {
    setForm({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description ?? '',
      icon: item.icon ?? '',
      coverImage: item.coverImage ?? '',
      color: item.color ?? '',
      published: item.published,
      featured: item.featured,
      order: item.order ?? 0,
    });
    setFormError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title.trim() || !form.slug.trim()) {
      setFormError('عنوان و اسلاگ الزامی است');
      return;
    }
    const payload = {
      slug: toSlug(form.slug),
      title: form.title.trim(),
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      coverImage: form.coverImage.trim() || null,
      color: form.color.trim() || null,
      published: form.published,
      featured: form.featured,
      order: Number(form.order) || 0,
    };
    try {
      if (form.id) {
        await api.patch(`/api/admin/categories/${form.id}`, payload);
        await refetch();
      } else {
        await createMutation.mutateAsync(payload);
      }
      setDialogOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'خطا در ذخیره دسته‌بندی');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      await refetch();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <AdminPageShell
      title="دسته‌بندی‌ها"
      description="دسته‌بندی دوره‌ها (کتگوری) را بسازید، ویرایش و حذف کنید. حذف، دوره‌های لینک‌شده را جدا می‌کند ولی پاک نمی‌کند."
      actions={
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          دسته‌بندی جدید
        </Button>
      }
    >
      <Card className="p-4">
        <Input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          placeholder="جستجو در عنوان، اسلاگ یا توضیح..."
          className="text-right"
        />
      </Card>

      {isLoading ? (
        <AdminLoadingState label="در حال دریافت دسته‌بندی‌ها..." />
      ) : items.length === 0 ? (
        <AdminEmptyState
          title="دسته‌بندی‌ای یافت نشد"
          description="اولین دسته‌بندی را بسازید تا در فرم دوره قابل انتخاب باشد."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              ایجاد اولین دسته‌بندی
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {item.slug}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant={item.published ? 'default' : 'outline'}>
                      {item.published ? 'منتشر' : 'مخفی'}
                    </Badge>
                    {item.featured && <Badge variant="secondary">ویژه</Badge>}
                  </div>
                </div>
                {item.description && (
                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                )}
                <p className="mb-3 text-xs text-muted-foreground">
                  {(item._count?.courses ?? 0).toLocaleString('fa-IR')} دوره لینک شده
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(item)}>
                    <Pencil className="h-4 w-4" />
                    ویرایش
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      setDeleteTarget({
                        id: item.id,
                        title: item.title,
                        courses: item._count?.courses ?? 0,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                قبلی
              </Button>
              <span className="text-sm text-muted-foreground">
                صفحه {pagination.page.toLocaleString('fa-IR')} از {pagination.totalPages.toLocaleString('fa-IR')}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                بعدی
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>{form.id ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}</DialogTitle>
            <DialogDescription>
              عنوان و اسلاگ الزامی است. اسلاگ در آدرس صفحه دسته‌بندی استفاده می‌شود.
            </DialogDescription>
          </DialogHeader>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>عنوان *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      slug: prev.id ? prev.slug : toSlug(title),
                    }));
                  }}
                  placeholder="مثلاً ارز دیجیتال"
                />
              </div>
              <div className="space-y-2">
                <Label>اسلاگ *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="cryptocurrency"
                  dir="ltr"
                  className="text-left"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>توضیح</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>آیکون</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder="نام آیکون یا مسیر"
                />
              </div>
              <div className="space-y-2">
                <Label>رنگ</Label>
                <Input
                  value={form.color}
                  onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                  placeholder="#0B3D2E"
                  dir="ltr"
                  className="text-left"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>تصویر کاور (URL)</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                placeholder="https://..."
                dir="ltr"
                className="text-left"
              />
            </div>

            <div className="space-y-2">
              <Label>ترتیب نمایش</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label className="!mt-0">منتشر (در سایت نمایش داده شود)</Label>
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, published: v }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label className="!mt-0">ویژه</Label>
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, featured: v }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={handleSave} disabled={createMutation.isPending}>
              {form.id ? 'ذخیره تغییرات' : 'ایجاد دسته‌بندی'}
            </Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف دسته‌بندی</DialogTitle>
            <DialogDescription>
              «{deleteTarget?.title}» حذف می‌شود.
              {deleteTarget && deleteTarget.courses > 0
                ? ` ${deleteTarget.courses.toLocaleString('fa-IR')} دوره لینک‌شده از آن جدا می‌شود ولی پاک نمی‌شود.`
                : ' دوره‌ای به آن لینک نیست.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              بله، حذف کن
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
