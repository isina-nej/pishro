'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { MessageSquareQuote, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  uploadCommentAvatar,
  useAdminComments,
  useCreateAdminComment,
  useDeleteAdminComment,
  useUpdateAdminComment,
  type AdminComment,
} from '@/lib/hooks/useAdminComments';

type FormState = {
  id?: string;
  userName: string;
  userCompany: string;
  userRole: string;
  userAvatar: string;
  text: string;
  rating: number;
  published: boolean;
  verified: boolean;
  featured: boolean;
};

const emptyForm = (): FormState => ({
  userName: '',
  userCompany: '',
  userRole: 'STUDENT',
  userAvatar: '',
  text: '',
  rating: 5,
  published: true,
  verified: true,
  featured: true,
});

function toForm(comment: AdminComment): FormState {
  return {
    id: comment.id,
    userName: comment.userName || '',
    userCompany: comment.userCompany || '',
    userRole: comment.userRole || 'STUDENT',
    userAvatar: comment.userAvatar || '',
    text: comment.text || '',
    rating: comment.rating && comment.rating > 5
      ? Math.min(5, Math.floor(comment.rating / 2))
      : comment.rating || 5,
    published: Boolean(comment.published),
    verified: Boolean(comment.verified),
    featured: Boolean(comment.featured),
  };
}

export default function AdminCommentsPage() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const { data: comments = [], isLoading } = useAdminComments();
  const create = useCreateAdminComment();
  const update = useUpdateAdminComment();
  const remove = useDeleteAdminComment();
  const [editing, setEditing] = useState<FormState | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (authLoading || isLoading) {
    return (
      <AdminPageShell title="نظرات کاربران" description="مدیریت نظرات صفحه اصلی">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }
  if (!user) return null;

  const saving = create.isPending || update.isPending;

  async function onPickAvatar(file: File | null) {
    if (!file || !editing) return;
    try {
      setUploading(true);
      const url = await uploadCommentAvatar(file);
      setEditing({ ...editing, userAvatar: url });
    } catch {
      // toast handled in caller / network
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function onSave() {
    if (!editing) return;
    const payload = {
      userName: editing.userName.trim(),
      userCompany: editing.userCompany.trim() || null,
      userRole: editing.userRole || null,
      userAvatar: editing.userAvatar.trim() || null,
      text: editing.text.trim(),
      rating: editing.rating,
      published: editing.published,
      verified: editing.verified,
      featured: editing.featured,
    };
    if (editing.id) {
      await update.mutateAsync({ id: editing.id, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    setEditing(null);
  }

  return (
    <AdminPageShell
      title="نظرات کاربران"
      description="نظرات نمایش‌داده‌شده در بخش نظرات صفحه اصلی. فقط نظرات منتشرشده و ویژه روی سایت دیده می‌شوند."
      actions={
        <Button
          onClick={() => setEditing(emptyForm())}
          disabled={Boolean(editing)}
        >
          <Plus className="size-4" />
          نظر جدید
        </Button>
      }
    >
      <Card className="mb-4 flex items-start gap-3 p-4 text-sm text-muted-foreground">
        <MessageSquareQuote className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          نظرات فیک از seed حذف شده‌اند. هر نظری که اینجا با وضعیت «منتشر شده»، «تأیید شده»
          و «ویژه» ذخیره کنید، در مارquee صفحه اصلی نمایش داده می‌شود.
        </p>
      </Card>

      {editing && (
        <Card className="mb-4 space-y-4 p-4">
          <div className="grid gap-4 md:grid-cols-[140px_1fr]">
            <div className="space-y-2">
              <Label>عکس پروفایل</Label>
              <div className="relative mx-auto size-28 overflow-hidden rounded-full border bg-muted md:mx-0">
                {editing.userAvatar ? (
                  <Image
                    src={editing.userAvatar}
                    alt={editing.userName || 'avatar'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                    بدون عکس
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => onPickAvatar(e.target.files?.[0] || null)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="size-4" />
                {uploading ? 'در حال آپلود...' : 'آپلود عکس'}
              </Button>
              <Input
                dir="ltr"
                placeholder="/images/... یا URL"
                value={editing.userAvatar}
                onChange={(e) =>
                  setEditing({ ...editing, userAvatar: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>نام</Label>
                  <Input
                    value={editing.userName}
                    onChange={(e) =>
                      setEditing({ ...editing, userName: e.target.value })
                    }
                    placeholder="نام نمایشی"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نقش / عنوان</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={editing.userRole}
                    onChange={(e) =>
                      setEditing({ ...editing, userRole: e.target.value })
                    }
                  >
                    <option value="STUDENT">دانشجو / کاربر</option>
                    <option value="PROFESSIONAL_TRADER">معامله‌گر حرفه‌ای</option>
                    <option value="INVESTOR">سرمایه‌گذار</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>شرکت (اختیاری)</Label>
                  <Input
                    value={editing.userCompany}
                    onChange={(e) =>
                      setEditing({ ...editing, userCompany: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>امتیاز (۱ تا ۵)</Label>
                  <Input
                    dir="ltr"
                    type="number"
                    min={1}
                    max={5}
                    value={editing.rating}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        rating: Math.min(5, Math.max(1, Number(e.target.value) || 1)),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>متن نظر</Label>
                <Textarea
                  rows={4}
                  value={editing.text}
                  onChange={(e) =>
                    setEditing({ ...editing, text: e.target.value })
                  }
                  placeholder="متن نظر کاربر..."
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <Label>منتشر شده</Label>
                  <Switch
                    checked={editing.published}
                    onCheckedChange={(v) =>
                      setEditing({ ...editing, published: v })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <Label>تأیید شده</Label>
                  <Switch
                    checked={editing.verified}
                    onCheckedChange={(v) =>
                      setEditing({ ...editing, verified: v })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <Label>ویژه (صفحه اصلی)</Label>
                  <Switch
                    checked={editing.featured}
                    onCheckedChange={(v) =>
                      setEditing({ ...editing, featured: v })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={onSave} disabled={saving || uploading}>
                  {saving ? 'در حال ذخیره...' : 'ذخیره'}
                </Button>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  انصراف
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {comments.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            هنوز نظری ثبت نشده. با «نظر جدید» اولین نظر را اضافه کنید.
          </Card>
        ) : (
          comments.map((comment) => (
            <Card
              key={comment.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full border bg-muted">
                  {comment.userAvatar ? (
                    <Image
                      src={comment.userAvatar}
                      alt={comment.userName || ''}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-medium">
                    {comment.userName || 'بدون نام'}
                    {comment.featured ? (
                      <span className="mr-2 text-xs text-primary">· ویژه</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[comment.userRole, comment.userCompany].filter(Boolean).join(' · ') ||
                      '—'}
                    {' · '}
                    امتیاز {comment.rating ?? '—'}
                    {!comment.published ? ' · پیش‌نویس' : ''}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                    {comment.text}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 self-end sm:self-start">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditing(toForm(comment))}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (window.confirm('حذف این نظر؟')) remove.mutate(comment.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminPageShell>
  );
}
