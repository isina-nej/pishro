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
  useAdminAboutPage,
  useCreateCertificate,
  useCreateResumeItem,
  useCreateTeamMember,
  useDeleteCertificate,
  useDeleteResumeItem,
  useDeleteTeamMember,
  useUpdateAboutPage,
  useUpdateCertificate,
  useUpdateResumeItem,
  useUpdateTeamMember,
} from '@/lib/hooks/useAdminLandingCms';

type Dict = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export default function LandingAboutCmsPage() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const { data: about, isLoading } = useAdminAboutPage();
  const update = useUpdateAboutPage(str(about?.id));
  const [form, setForm] = useState<Dict>({});

  useEffect(() => {
    if (about) setForm({ ...about });
  }, [about]);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  if (authLoading || isLoading) {
    return (
      <AdminPageShell title="درباره ما" description="ویرایش صفحه درباره ما">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }
  if (!user) return null;
  if (!about?.id) {
    return (
      <AdminPageShell title="درباره ما" description="ویرایش صفحه درباره ما">
        <p className="text-sm text-muted-foreground">رکوردی یافت نشد — ابتدا seed را اجرا کنید.</p>
      </AdminPageShell>
    );
  }

  const aboutPageId = str(about.id);
  const resumeItems = (about.resumeItems as Dict[]) || [];
  const teamMembers = (about.teamMembers as Dict[]) || [];
  const certificates = (about.certificates as Dict[]) || [];

  return (
    <AdminPageShell
      title="درباره ما"
      description="هیرو، رزومه، تیم و گواهی‌نامه‌ها"
      actions={
        <Button variant="outline" asChild>
          <Link href="/admin/landing">
            <ArrowRight className="size-4" />
            بازگشت
          </Link>
        </Button>
      }
    >
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="hero">هیرو و CTA</TabsTrigger>
          <TabsTrigger value="resume">رزومه</TabsTrigger>
          <TabsTrigger value="team">تیم</TabsTrigger>
          <TabsTrigger value="certs">گواهی‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card className="space-y-4 p-4">
            <TextField label="عنوان هیرو" value={str(form.heroTitle)} onChange={(v) => set('heroTitle', v)} />
            <TextField label="زیرعنوان" value={str(form.heroSubtitle)} onChange={(v) => set('heroSubtitle', v)} />
            <TextField label="توضیح" value={str(form.heroDescription)} onChange={(v) => set('heroDescription', v)} multiline />
            <TextField label="متن بج" value={str(form.heroBadgeText)} onChange={(v) => set('heroBadgeText', v)} />
            <JsonField label="آمار هیرو (JSON)" value={form.heroStats} onChange={(v) => set('heroStats', v)} />
            <TextField label="عنوان رزومه" value={str(form.resumeTitle)} onChange={(v) => set('resumeTitle', v)} />
            <TextField label="زیرعنوان رزومه" value={str(form.resumeSubtitle)} onChange={(v) => set('resumeSubtitle', v)} />
            <TextField label="عنوان تیم" value={str(form.teamTitle)} onChange={(v) => set('teamTitle', v)} />
            <TextField label="زیرعنوان تیم" value={str(form.teamSubtitle)} onChange={(v) => set('teamSubtitle', v)} />
            <TextField label="عنوان گواهی‌ها" value={str(form.certificatesTitle)} onChange={(v) => set('certificatesTitle', v)} />
            <TextField label="زیرعنوان گواهی‌ها" value={str(form.certificatesSubtitle)} onChange={(v) => set('certificatesSubtitle', v)} />
            <TextField label="عنوان CTA" value={str(form.ctaTitle)} onChange={(v) => set('ctaTitle', v)} />
            <TextField label="توضیح CTA" value={str(form.ctaDescription)} onChange={(v) => set('ctaDescription', v)} multiline />
            <TextField label="متن دکمه CTA" value={str(form.ctaButtonText)} onChange={(v) => set('ctaButtonText', v)} />
            <TextField label="لینک دکمه CTA" value={str(form.ctaButtonLink)} onChange={(v) => set('ctaButtonLink', v)} dir="ltr" />
            <TextField label="Meta Title" value={str(form.metaTitle)} onChange={(v) => set('metaTitle', v)} />
            <TextField label="Meta Description" value={str(form.metaDescription)} onChange={(v) => set('metaDescription', v)} multiline />
            <PublishedSwitch checked={Boolean(form.published)} onChange={(v) => set('published', v)} />
          </Card>
          <SaveBar
            saving={update.isPending}
            onSave={() => {
              const {
                id: _i,
                resumeItems: _r,
                teamMembers: _t,
                certificates: _c,
                news: _n,
                createdAt: _ca,
                updatedAt: _ua,
                ...payload
              } = form;
              update.mutateAsync(payload);
            }}
          />
        </TabsContent>

        <TabsContent value="resume">
          <ChildListEditor
            items={resumeItems}
            aboutPageId={aboutPageId}
            kind="resume"
          />
        </TabsContent>
        <TabsContent value="team">
          <ChildListEditor items={teamMembers} aboutPageId={aboutPageId} kind="team" />
        </TabsContent>
        <TabsContent value="certs">
          <ChildListEditor items={certificates} aboutPageId={aboutPageId} kind="cert" />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}

function ChildListEditor({
  items,
  aboutPageId,
  kind,
}: {
  items: Dict[];
  aboutPageId: string;
  kind: 'resume' | 'team' | 'cert';
}) {
  const createResume = useCreateResumeItem();
  const updateResume = useUpdateResumeItem();
  const deleteResume = useDeleteResumeItem();
  const createTeam = useCreateTeamMember();
  const updateTeam = useUpdateTeamMember();
  const deleteTeam = useDeleteTeamMember();
  const createCert = useCreateCertificate();
  const updateCert = useUpdateCertificate();
  const deleteCert = useDeleteCertificate();
  const [editing, setEditing] = useState<Dict | null>(null);

  const blank =
    kind === 'resume'
      ? { aboutPageId, title: '', description: '', icon: '', color: '', bgColor: '', order: items.length + 1, published: true }
      : kind === 'team'
        ? { aboutPageId, name: '', role: '', image: '', education: '', description: '', specialties: [], order: items.length + 1, published: true }
        : { aboutPageId, title: '', description: '', image: '', order: items.length + 1, published: true };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing(blank)}>
          <Plus className="size-4" />
          افزودن
        </Button>
      </div>
      {editing && (
        <Card className="space-y-3 p-4">
          {kind === 'team' ? (
            <>
              <TextField label="نام" value={str(editing.name)} onChange={(v) => setEditing({ ...editing, name: v })} />
              <TextField label="نقش" value={str(editing.role)} onChange={(v) => setEditing({ ...editing, role: v })} />
              <TextField label="تصویر" value={str(editing.image)} onChange={(v) => setEditing({ ...editing, image: v })} dir="ltr" />
              <TextField label="تحصیلات" value={str(editing.education)} onChange={(v) => setEditing({ ...editing, education: v })} />
              <TextField label="توضیح" value={str(editing.description)} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
              <JsonField label="تخصص‌ها (JSON)" value={editing.specialties} onChange={(v) => setEditing({ ...editing, specialties: v })} />
            </>
          ) : (
            <>
              <TextField label="عنوان" value={str(editing.title)} onChange={(v) => setEditing({ ...editing, title: v })} />
              <TextField label="توضیح" value={str(editing.description)} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
              {kind === 'resume' ? (
                <>
                  <TextField label="آیکون" value={str(editing.icon)} onChange={(v) => setEditing({ ...editing, icon: v })} dir="ltr" />
                  <TextField label="رنگ" value={str(editing.color)} onChange={(v) => setEditing({ ...editing, color: v })} dir="ltr" />
                  <TextField label="پس‌زمینه" value={str(editing.bgColor)} onChange={(v) => setEditing({ ...editing, bgColor: v })} dir="ltr" />
                </>
              ) : (
                <TextField label="تصویر" value={str(editing.image)} onChange={(v) => setEditing({ ...editing, image: v })} dir="ltr" />
              )}
            </>
          )}
          <PublishedSwitch checked={Boolean(editing.published)} onChange={(v) => setEditing({ ...editing, published: v })} />
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                if (editing.id) {
                  const { id, ...rest } = editing;
                  if (kind === 'resume') await updateResume.mutateAsync({ id: str(id), ...rest });
                  if (kind === 'team') await updateTeam.mutateAsync({ id: str(id), ...rest });
                  if (kind === 'cert') await updateCert.mutateAsync({ id: str(id), ...rest });
                } else {
                  if (kind === 'resume') await createResume.mutateAsync(editing);
                  if (kind === 'team') await createTeam.mutateAsync(editing);
                  if (kind === 'cert') await createCert.mutateAsync(editing);
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
              <p className="font-medium">{str(item.title || item.name)}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{str(item.description || item.role)}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(item)}>
                <Pencil className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (!window.confirm('حذف؟')) return;
                  if (kind === 'resume') deleteResume.mutate(str(item.id));
                  if (kind === 'team') deleteTeam.mutate(str(item.id));
                  if (kind === 'cert') deleteCert.mutate(str(item.id));
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
