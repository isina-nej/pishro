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
  useAdminHomeLanding,
  useAdminHomeMiniSliders,
  useAdminHomeSlides,
  useAdminMobileSteps,
  useCreateHomeMiniSlider,
  useCreateHomeSlide,
  useCreateMobileStep,
  useDeleteHomeMiniSlider,
  useDeleteHomeSlide,
  useDeleteMobileStep,
  useUpdateHomeLanding,
  useUpdateHomeMiniSlider,
  useUpdateHomeSlide,
  useUpdateMobileStep,
} from '@/lib/hooks/useAdminLandingCms';

type Dict = Record<string, unknown>;

function str(v: unknown) {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function num(v: unknown, fallback = 0) {
  return typeof v === 'number' ? v : Number(v) || fallback;
}

export default function LandingHomeCmsPage() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const { data: landings, isLoading } = useAdminHomeLanding();
  const landing = landings?.[0] as Dict | undefined;
  const updateLanding = useUpdateHomeLanding(str(landing?.id));

  const [form, setForm] = useState<Dict>({});

  useEffect(() => {
    if (landing) setForm({ ...landing });
  }, [landing]);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  if (authLoading || isLoading) {
    return (
      <AdminPageShell title="لندینگ خانه" description="ویرایش صفحه اصلی">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }
  if (!user) return null;

  if (!landing?.id) {
    return (
      <AdminPageShell title="لندینگ خانه" description="ویرایش صفحه اصلی">
        <p className="text-sm text-muted-foreground">
          هنوز رکورد لندینگ وجود ندارد. ابتدا `npm run seed` را اجرا کنید.
        </p>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="لندینگ خانه"
      description="متن‌ها، تصویر/ویدیو و بخش‌های وابسته صفحه اصلی"
      actions={
        <Button variant="outline" asChild>
          <Link href="/admin/landing">
            <ArrowRight className="size-4" />
            بازگشت
          </Link>
        </Button>
      }
    >
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="content">محتوای اصلی</TabsTrigger>
          <TabsTrigger value="calculator">ماشین‌حساب</TabsTrigger>
          <TabsTrigger value="slides">اسلایدها</TabsTrigger>
          <TabsTrigger value="mini">مینی‌اسلایدر</TabsTrigger>
          <TabsTrigger value="mobile">قدم‌های موبایل</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card className="space-y-4 p-4">
            <TextField label="عنوان اصلی هیرو" value={str(form.mainHeroTitle)} onChange={(v) => set('mainHeroTitle', v)} />
            <TextField label="زیرعنوان اصلی" value={str(form.mainHeroSubtitle)} onChange={(v) => set('mainHeroSubtitle', v)} />
            <TextField label="متن دکمه اصلی" value={str(form.mainHeroCta1Text)} onChange={(v) => set('mainHeroCta1Text', v)} />
            <TextField label="لینک دکمه اصلی" value={str(form.mainHeroCta1Link)} onChange={(v) => set('mainHeroCta1Link', v)} dir="ltr" />
            <TextField label="عنوان هیرو" value={str(form.heroTitle)} onChange={(v) => set('heroTitle', v)} />
            <TextField label="زیرعنوان هیرو" value={str(form.heroSubtitle)} onChange={(v) => set('heroSubtitle', v)} />
            <TextField label="توضیح هیرو" value={str(form.heroDescription)} onChange={(v) => set('heroDescription', v)} multiline />
            <TextField label="آدرس ویدیو هیرو" value={str(form.heroVideoUrl)} onChange={(v) => set('heroVideoUrl', v)} dir="ltr" />
            <TextField label="متن CTA هیرو" value={str(form.heroCta1Text)} onChange={(v) => set('heroCta1Text', v)} />
            <TextField label="لینک CTA هیرو" value={str(form.heroCta1Link)} onChange={(v) => set('heroCta1Link', v)} dir="ltr" />
            <JsonField label="متن‌های Overlay (JSON)" value={form.overlayTexts} onChange={(v) => set('overlayTexts', v)} hint='آرایه رشته، مثل ["متن ۱","متن ۲"]' />
            <JsonField label="آمار (JSON)" value={form.statsData} onChange={(v) => set('statsData', v)} hint='[{"label":"...","value":3000,"suffix":"+"}]' />
            <TextField label="عنوان چرا پیشرو" value={str(form.whyUsTitle)} onChange={(v) => set('whyUsTitle', v)} />
            <TextField label="توضیح چرا پیشرو" value={str(form.whyUsDescription)} onChange={(v) => set('whyUsDescription', v)} multiline />
            <JsonField label="آیتم‌های چرا پیشرو (JSON)" value={form.whyUsItems} onChange={(v) => set('whyUsItems', v)} />
            <TextField label="عنوان باشگاه خبری" value={str(form.newsClubTitle)} onChange={(v) => set('newsClubTitle', v)} />
            <TextField label="توضیح باشگاه خبری" value={str(form.newsClubDescription)} onChange={(v) => set('newsClubDescription', v)} multiline />
            <TextField label="Meta Title" value={str(form.metaTitle)} onChange={(v) => set('metaTitle', v)} />
            <TextField label="Meta Description" value={str(form.metaDescription)} onChange={(v) => set('metaDescription', v)} multiline />
            <PublishedSwitch checked={Boolean(form.published)} onChange={(v) => set('published', v)} />
          </Card>
          <SaveBar
            saving={updateLanding.isPending}
            onSave={() => {
              const { id: _id, createdAt: _c, updatedAt: _u, ...payload } = form;
              if (typeof payload.overlayTexts === 'string' || typeof payload.statsData === 'string') {
                return;
              }
              updateLanding.mutateAsync(payload);
            }}
          />
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card className="space-y-4 p-4">
            <TextField label="عنوان ماشین‌حساب" value={str(form.calculatorTitle)} onChange={(v) => set('calculatorTitle', v)} />
            <TextField label="توضیح" value={str(form.calculatorDescription)} onChange={(v) => set('calculatorDescription', v)} multiline />
            <TextField label="نرخ کم" value={str(form.calculatorRateLow)} onChange={(v) => set('calculatorRateLow', Number(v))} dir="ltr" />
            <TextField label="نرخ متوسط" value={str(form.calculatorRateMedium)} onChange={(v) => set('calculatorRateMedium', Number(v))} dir="ltr" />
            <TextField label="نرخ بالا" value={str(form.calculatorRateHigh)} onChange={(v) => set('calculatorRateHigh', Number(v))} dir="ltr" />
            <TextField label="توضیح پورتفوی کم" value={str(form.calculatorPortfolioLowDesc)} onChange={(v) => set('calculatorPortfolioLowDesc', v)} />
            <TextField label="توضیح پورتفوی متوسط" value={str(form.calculatorPortfolioMediumDesc)} onChange={(v) => set('calculatorPortfolioMediumDesc', v)} />
            <TextField label="توضیح پورتفوی بالا" value={str(form.calculatorPortfolioHighDesc)} onChange={(v) => set('calculatorPortfolioHighDesc', v)} />
            <JsonField label="گام‌های مبلغ (JSON)" value={form.calculatorAmountSteps} onChange={(v) => set('calculatorAmountSteps', v)} />
            <JsonField label="گام‌های مدت (JSON)" value={form.calculatorDurationSteps} onChange={(v) => set('calculatorDurationSteps', v)} />
            <TextField label="تلفن حضوری" value={str(form.calculatorInPersonPhone)} onChange={(v) => set('calculatorInPersonPhone', v)} />
            <TextField label="آیدی تلگرام" value={str(form.calculatorOnlineTelegram)} onChange={(v) => set('calculatorOnlineTelegram', v)} dir="ltr" />
            <TextField label="لینک تلگرام" value={str(form.calculatorOnlineTelegramLink)} onChange={(v) => set('calculatorOnlineTelegramLink', v)} dir="ltr" />
          </Card>
          <SaveBar
            saving={updateLanding.isPending}
            onSave={() => {
              const { id: _id, createdAt: _c, updatedAt: _u, ...payload } = form;
              updateLanding.mutateAsync(payload);
            }}
          />
        </TabsContent>

        <TabsContent value="slides">
          <SlidesEditor />
        </TabsContent>
        <TabsContent value="mini">
          <MiniSlidersEditor />
        </TabsContent>
        <TabsContent value="mobile">
          <MobileStepsEditor />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}

function SlidesEditor() {
  const { data: slides = [], isLoading } = useAdminHomeSlides();
  const create = useCreateHomeSlide();
  const update = useUpdateHomeSlide();
  const remove = useDeleteHomeSlide();
  const [editing, setEditing] = useState<Dict | null>(null);

  if (isLoading) return <AdminLoadingState />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() =>
            setEditing({ title: '', description: '', imageUrl: '', order: slides.length + 1, published: true })
          }
        >
          <Plus className="size-4" />
          اسلاید جدید
        </Button>
      </div>
      {editing && (
        <Card className="space-y-3 p-4">
          <TextField label="عنوان" value={str(editing.title)} onChange={(v) => setEditing({ ...editing, title: v })} />
          <TextField label="توضیح" value={str(editing.description)} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
          <TextField label="آدرس تصویر" value={str(editing.imageUrl)} onChange={(v) => setEditing({ ...editing, imageUrl: v })} dir="ltr" />
          <TextField label="ترتیب" value={str(editing.order)} onChange={(v) => setEditing({ ...editing, order: Number(v) || 0 })} dir="ltr" />
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
        {(slides as Dict[]).map((slide) => (
          <Card key={str(slide.id)} className="flex items-start justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{str(slide.title)}</p>
              <p className="text-xs text-muted-foreground dir-ltr">{str(slide.imageUrl)}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(slide)}>
                <Pencil className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (window.confirm('حذف این اسلاید؟')) remove.mutate(str(slide.id));
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

function MiniSlidersEditor() {
  const { data: items = [], isLoading } = useAdminHomeMiniSliders();
  const create = useCreateHomeMiniSlider();
  const update = useUpdateHomeMiniSlider();
  const remove = useDeleteHomeMiniSlider();
  const [editing, setEditing] = useState<Dict | null>(null);

  if (isLoading) return <AdminLoadingState />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ imageUrl: '', row: 1, order: items.length + 1, published: true })}>
          <Plus className="size-4" />
          آیتم جدید
        </Button>
      </div>
      {editing && (
        <Card className="space-y-3 p-4">
          <TextField label="آدرس تصویر" value={str(editing.imageUrl)} onChange={(v) => setEditing({ ...editing, imageUrl: v })} dir="ltr" />
          <TextField label="ردیف (1 یا 2)" value={str(editing.row)} onChange={(v) => setEditing({ ...editing, row: Number(v) || 1 })} dir="ltr" />
          <TextField label="ترتیب" value={str(editing.order)} onChange={(v) => setEditing({ ...editing, order: Number(v) || 0 })} dir="ltr" />
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
        {(items as Dict[]).map((item) => (
          <Card key={str(item.id)} className="flex items-center justify-between gap-3 p-3">
            <div>
              <p className="text-sm">ردیف {num(item.row)} — ترتیب {num(item.order)}</p>
              <p className="text-xs text-muted-foreground">{str(item.imageUrl)}</p>
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

function MobileStepsEditor() {
  const { data: steps = [], isLoading } = useAdminMobileSteps();
  const create = useCreateMobileStep();
  const update = useUpdateMobileStep();
  const remove = useDeleteMobileStep();
  const [editing, setEditing] = useState<Dict | null>(null);

  if (isLoading) return <AdminLoadingState />;

  const contentType = str(editing?.contentType || 'IMAGE') === 'PAGE' ? 'PAGE' : 'IMAGE';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          هر تعداد قدم که بخواهید اضافه کنید. داخل قاب موبایل می‌تواند تصویر یا یک صفحه از سایت باشد.
          الان {steps.length} قدم دارید.
        </p>
        <Button
          onClick={() =>
            setEditing({
              stepNumber: steps.length + 1,
              title: '',
              description: '',
              contentType: 'IMAGE',
              imageUrl: '',
              pageUrl: '',
              coverImageUrl: '/images/home/mobile-scroll/mobile.webp',
              gradient: '',
              link: '',
              order: steps.length + 1,
              published: true,
            })
          }
        >
          <Plus className="size-4" />
          قدم جدید
        </Button>
      </div>
      {editing && (
        <Card className="space-y-3 p-4">
          <TextField
            label="شماره قدم"
            value={str(editing.stepNumber)}
            onChange={(v) => setEditing({ ...editing, stepNumber: Number(v) || 1 })}
            dir="ltr"
          />
          <TextField
            label="عنوان"
            value={str(editing.title)}
            onChange={(v) => setEditing({ ...editing, title: v })}
          />
          <TextField
            label="توضیح (کنار موبایل)"
            value={str(editing.description)}
            onChange={(v) => setEditing({ ...editing, description: v })}
            multiline
          />

          <div className="space-y-2">
            <p className="text-sm font-medium">محتوای داخل موبایل</p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={contentType === 'IMAGE' ? 'default' : 'outline'}
                onClick={() => setEditing({ ...editing, contentType: 'IMAGE' })}
              >
                تصویر
              </Button>
              <Button
                type="button"
                size="sm"
                variant={contentType === 'PAGE' ? 'default' : 'outline'}
                onClick={() => setEditing({ ...editing, contentType: 'PAGE' })}
              >
                صفحه سایت
              </Button>
            </div>
          </div>

          {contentType === 'IMAGE' ? (
            <TextField
              label="آدرس تصویر داخل موبایل"
              value={str(editing.imageUrl)}
              onChange={(v) => setEditing({ ...editing, imageUrl: v })}
              dir="ltr"
            />
          ) : (
            <TextField
              label="آدرس صفحه (مسیر داخلی مثل /courses یا لینک کامل)"
              value={str(editing.pageUrl)}
              onChange={(v) => setEditing({ ...editing, pageUrl: v })}
              dir="ltr"
            />
          )}

          <TextField
            label="کاور/قاب موبایل (اختیاری)"
            value={str(editing.coverImageUrl)}
            onChange={(v) => setEditing({ ...editing, coverImageUrl: v })}
            dir="ltr"
          />
          <TextField
            label="لینک «اطلاعات بیشتر» (اختیاری)"
            value={str(editing.link)}
            onChange={(v) => setEditing({ ...editing, link: v })}
            dir="ltr"
          />
          <TextField
            label="ترتیب نمایش"
            value={str(editing.order)}
            onChange={(v) => setEditing({ ...editing, order: Number(v) || 0 })}
            dir="ltr"
          />
          <PublishedSwitch
            checked={Boolean(editing.published)}
            onChange={(v) => setEditing({ ...editing, published: v })}
          />
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                const payload: Dict = {
                  stepNumber: num(editing.stepNumber, 1),
                  title: str(editing.title),
                  description: str(editing.description),
                  contentType,
                  coverImageUrl: str(editing.coverImageUrl) || null,
                  link: str(editing.link) || null,
                  order: num(editing.order, num(editing.stepNumber, 1)),
                  published: Boolean(editing.published),
                  imageUrl: contentType === 'IMAGE' ? str(editing.imageUrl) || null : null,
                  pageUrl: contentType === 'PAGE' ? str(editing.pageUrl) || null : null,
                };
                if (editing.id) {
                  await update.mutateAsync({ id: str(editing.id), ...payload });
                } else {
                  await create.mutateAsync(payload);
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
        {(steps as Dict[]).map((step) => {
          const type = str(step.contentType) === 'PAGE' ? 'PAGE' : 'IMAGE';
          return (
            <Card key={str(step.id)} className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-medium">
                  قدم {num(step.stepNumber)} — {str(step.title)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {type === 'PAGE'
                    ? `صفحه: ${str(step.pageUrl) || '—'}`
                    : `تصویر: ${str(step.imageUrl) || '—'}`}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {str(step.description)}
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setEditing(step)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (window.confirm('حذف این قدم؟')) remove.mutate(str(step.id));
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
