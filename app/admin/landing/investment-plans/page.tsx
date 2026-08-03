'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  JsonField,
  PublishedSwitch,
  SaveBar,
  TextField,
} from '@/components/admin/landing/CmsFormFields';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  useAdminInvestmentPlansPage,
  useCreateInvestmentPlanItem,
  useCreateInvestmentTag,
  useDeleteInvestmentPlanItem,
  useDeleteInvestmentTag,
  useUpdateInvestmentPlanItem,
  useUpdateInvestmentPlansPage,
  useUpdateInvestmentTag,
} from '@/lib/hooks/useAdminLandingCms';

type Dict = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export default function LandingInvestmentPlansCmsPage() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const { data: page, isLoading } = useAdminInvestmentPlansPage();
  const update = useUpdateInvestmentPlansPage(str(page?.id));
  const [form, setForm] = useState<Dict>({});

  useEffect(() => {
    if (page) setForm({ ...page });
  }, [page]);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  if (authLoading || isLoading) {
    return (
      <AdminPageShell title="سبدهای سرمایه‌گذاری" description="ویرایش صفحه سبدها">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }
  if (!user) return null;
  if (!page?.id) {
    return (
      <AdminPageShell title="سبدهای سرمایه‌گذاری" description="ویرایش صفحه سبدها">
        <p className="text-sm text-muted-foreground">رکوردی یافت نشد — ابتدا seed را اجرا کنید.</p>
      </AdminPageShell>
    );
  }

  const plans = (page.plans as Dict[]) || [];
  const tags = (page.tags as Dict[]) || [];
  const pageId = str(page.id);

  return (
    <AdminPageShell
      title="سبدهای سرمایه‌گذاری"
      description="محتوای صفحه، انواع سبد و تگ‌ها"
      actions={
        <Button variant="outline" asChild>
          <Link href="/admin/landing">
            <ArrowRight className="size-4" />
            بازگشت
          </Link>
        </Button>
      }
    >
      <Tabs defaultValue="page" className="space-y-4">
        <TabsList>
          <TabsTrigger value="page">صفحه</TabsTrigger>
          <TabsTrigger value="plans">انواع سبد</TabsTrigger>
          <TabsTrigger value="tags">تگ‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="page" className="space-y-4">
          <Card className="space-y-4 p-4">
            <TextField label="عنوان" value={str(form.title)} onChange={(v) => set('title', v)} />
            <TextField label="توضیحات" value={str(form.description)} onChange={(v) => set('description', v)} multiline />
            <TextField label="آدرس تصویر" value={str(form.image)} onChange={(v) => set('image', v)} dir="ltr" />
            <JsonField label="کارت‌های معرفی (JSON)" value={form.plansIntroCards} onChange={(v) => set('plansIntroCards', v)} />
            <TextField label="حداقل مبلغ" value={str(form.minAmount)} onChange={(v) => set('minAmount', Number(v) || 0)} dir="ltr" />
            <TextField label="حداکثر مبلغ" value={str(form.maxAmount)} onChange={(v) => set('maxAmount', Number(v) || 0)} dir="ltr" />
            <TextField label="گام مبلغ" value={str(form.amountStep)} onChange={(v) => set('amountStep', Number(v) || 0)} dir="ltr" />
            <TextField label="Meta Title" value={str(form.metaTitle)} onChange={(v) => set('metaTitle', v)} />
            <TextField label="Meta Description" value={str(form.metaDescription)} onChange={(v) => set('metaDescription', v)} multiline />
            <PublishedSwitch checked={Boolean(form.published)} onChange={(v) => set('published', v)} />
          </Card>
          <SaveBar
            saving={update.isPending}
            onSave={() => {
              const { id: _i, plans: _p, tags: _t, createdAt: _c, updatedAt: _u, ...payload } = form;
              update.mutateAsync(payload);
            }}
          />
        </TabsContent>

        <TabsContent value="plans">
          <PlansEditor items={plans} investmentPlansId={pageId} />
        </TabsContent>
        <TabsContent value="tags">
          <TagsEditor items={tags} investmentPlansId={pageId} />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}

function PlansEditor({ items, investmentPlansId }: { items: Dict[]; investmentPlansId: string }) {
  const create = useCreateInvestmentPlanItem();
  const update = useUpdateInvestmentPlanItem();
  const remove = useDeleteInvestmentPlanItem();
  const [editing, setEditing] = useState<Dict | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() =>
            setEditing({
              investmentPlansId,
              label: '',
              icon: '',
              description: '',
              order: items.length + 1,
              published: true,
            })
          }
        >
          <Plus className="size-4" />
          نوع سبد جدید
        </Button>
      </div>
      {editing && (
        <Card className="space-y-3 p-4">
          <TextField label="برچسب" value={str(editing.label)} onChange={(v) => setEditing({ ...editing, label: v })} />
          <TextField label="آیکون" value={str(editing.icon)} onChange={(v) => setEditing({ ...editing, icon: v })} dir="ltr" />
          <TextField label="توضیح" value={str(editing.description)} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
          <PublishedSwitch checked={Boolean(editing.published)} onChange={(v) => setEditing({ ...editing, published: v })} />
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                if (editing.id) {
                  const { id, ...rest } = editing;
                  await update.mutateAsync({ id: str(id), ...rest });
                } else {
                  await create.mutateAsync(editing);
                }
                setEditing(null);
              }}
            >
              ذخیره
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>
              انصراف
            </Button>
          </div>
        </Card>
      )}
      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={str(item.id)} className="flex items-start justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{str(item.label)}</p>
              <p className="text-sm text-muted-foreground">{str(item.description)}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(item)}>
                <Pencil className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (window.confirm('حذف؟')) remove.mutate(str(item.id));
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TagsEditor({ items, investmentPlansId }: { items: Dict[]; investmentPlansId: string }) {
  const create = useCreateInvestmentTag();
  const update = useUpdateInvestmentTag();
  const remove = useDeleteInvestmentTag();
  const [editing, setEditing] = useState<Dict | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() =>
            setEditing({
              investmentPlansId,
              title: '',
              color: '',
              icon: '',
              order: items.length + 1,
              published: true,
            })
          }
        >
          <Plus className="size-4" />
          تگ جدید
        </Button>
      </div>
      {editing && (
        <Card className="space-y-3 p-4">
          <TextField label="عنوان" value={str(editing.title)} onChange={(v) => setEditing({ ...editing, title: v })} />
          <TextField label="رنگ" value={str(editing.color)} onChange={(v) => setEditing({ ...editing, color: v })} dir="ltr" />
          <TextField label="آیکون" value={str(editing.icon)} onChange={(v) => setEditing({ ...editing, icon: v })} dir="ltr" />
          <PublishedSwitch checked={Boolean(editing.published)} onChange={(v) => setEditing({ ...editing, published: v })} />
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                if (editing.id) {
                  const { id, ...rest } = editing;
                  await update.mutateAsync({ id: str(id), ...rest });
                } else {
                  await create.mutateAsync(editing);
                }
                setEditing(null);
              }}
            >
              ذخیره
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>
              انصراف
            </Button>
          </div>
        </Card>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={str(item.id)} className="flex items-center justify-between gap-3 p-3">
            <p className="font-medium">{str(item.title)}</p>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(item)}>
                <Pencil className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (window.confirm('حذف؟')) remove.mutate(str(item.id));
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
