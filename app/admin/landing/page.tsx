"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Filter,
  Home,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Layers,
  LayoutTemplate,
  Loader2,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  MessageSquareQuote,
  Palette,
  Sliders,
  Undo2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminLoadingState, AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import {
  PUBLIC_CONTENT_GROUP_LABELS,
  PUBLIC_CONTENT_PAGES,
  getPublicContentDefaults,
  type PublicContentOverrides,
  type PublicContentPage,
} from "@/lib/site/public-content";
import IconPicker from "@/components/admin/cms/IconPicker";
import ImageUploadField from "@/components/admin/cms/ImageUploadField";
import CmsLivePreview from "@/components/admin/cms/CmsLivePreview";
import { cn } from "@/lib/utils";

type FilterType = "all" | "text" | "image" | "icon" | "link";

const GROUP_ICONS: Record<PublicContentPage["group"], typeof Home> = {
  landing: Home,
  content: GraduationCap,
  service: Briefcase,
  shared: Layers,
};

const FIELD_TYPE_BADGES: Record<
  string,
  { label: string; className: string }
> = {
  text: { label: "متن", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  textarea: { label: "پاراگراف", className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  image: { label: "تصویر", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  icon: { label: "آیکن", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  link: { label: "پیوند", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
};

async function fetchCmsContent(): Promise<{
  content: PublicContentOverrides;
  rawOverrides: PublicContentOverrides;
  defaults: PublicContentOverrides;
}> {
  const res = await fetch("/api/admin/cms", { credentials: "include" });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در دریافت اطلاعات CMS");
  }
  return json.data;
}

async function saveCmsContent(content: PublicContentOverrides) {
  const res = await fetch("/api/admin/cms", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در ذخیره تغییرات CMS");
  }
  return json.data;
}

async function resetPageOnServer(pageId?: string) {
  const res = await fetch("/api/admin/cms/reset", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageId }),
  });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در بازگردانی به پیش‌فرض");
  }
  return json.data;
}

export default function AdminCmsStudioPage() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Content state
  const [content, setContent] = useState<PublicContentOverrides>(() =>
    getPublicContentDefaults()
  );
  const [savedContent, setSavedContent] = useState<PublicContentOverrides>(() =>
    getPublicContentDefaults()
  );

  // Navigation & filtering state
  const [selectedGroup, setSelectedGroup] =
    useState<PublicContentPage["group"]>("landing");
  const [selectedPageId, setSelectedPageId] = useState<string>("home-v32");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  // Load CMS data on mount
  const reload = useCallback(async () => {
    try {
      const data = await fetchCmsContent();
      setContent(data.content);
      setSavedContent(data.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در بارگذاری محتوا");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    reload();
  }, [authLoading, user, reload]);

  // Pages under active group
  const groupPages = useMemo(
    () => PUBLIC_CONTENT_PAGES.filter((p) => p.group === selectedGroup),
    [selectedGroup]
  );

  // Ensure selected page stays valid when switching groups
  useEffect(() => {
    if (!groupPages.some((p) => p.id === selectedPageId)) {
      if (groupPages[0]) setSelectedPageId(groupPages[0].id);
    }
  }, [selectedGroup, groupPages, selectedPageId]);

  const activePage = useMemo(
    () =>
      PUBLIC_CONTENT_PAGES.find((p) => p.id === selectedPageId) ??
      PUBLIC_CONTENT_PAGES[0],
    [selectedPageId]
  );

  const defaults = useMemo(
    () => (activePage ? getPublicContentDefaults(activePage.id) : {}),
    [activePage]
  );

  const activePageValues = useMemo(
    () => (activePage ? content[activePage.id] || {} : {}),
    [activePage, content]
  );

  const activePageSaved = useMemo(
    () => (activePage ? savedContent[activePage.id] || {} : {}),
    [activePage, savedContent]
  );

  // Track unsaved changes for active page & total site
  const unsavedCount = useMemo(() => {
    let count = 0;
    for (const page of PUBLIC_CONTENT_PAGES) {
      const cur = content[page.id] || {};
      const sav = savedContent[page.id] || {};
      const fields = page.sections.flatMap((s) => s.fields);
      for (const f of fields) {
        if (cur[f.key] !== undefined && cur[f.key] !== sav[f.key]) {
          count++;
        }
      }
    }
    return count;
  }, [content, savedContent]);

  // Set single field
  const setField = (pageId: string, key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [pageId]: {
        ...(prev[pageId] || {}),
        [key]: value,
      },
    }));
  };

  // Reset single field to its default value
  const resetField = (pageId: string, key: string, defaultVal: string) => {
    setField(pageId, key, defaultVal);
    toast.success("فیلد به مقدار پیش‌فرض بازگشت");
  };

  // Reset page to initial defaults
  const resetCurrentPage = async () => {
    if (!activePage) return;
    try {
      const data = await resetPageOnServer(activePage.id);
      if (data?.content) {
        setContent(data.content);
        setSavedContent(data.content);
      } else {
        const pageDefaults = defaults[activePage.id] || {};
        setContent((prev) => ({
          ...prev,
          [activePage.id]: { ...pageDefaults },
        }));
      }
      toast.success(`صفحه «${activePage.title}» به مقادیر پیش‌فرض کارخانه بازگشت`);
    } catch {
      const pageDefaults = defaults[activePage.id] || {};
      setContent((prev) => ({
        ...prev,
        [activePage.id]: { ...pageDefaults },
      }));
      toast.success(`مقادیر صفحه «${activePage.title}» به پیش‌فرض بازگردانده شد`);
    }
  };

  // Discard all unsaved changes
  const discardAllChanges = () => {
    setContent(structuredClone(savedContent));
    toast.success("تغییرات ذخیره‌نشده لغو شدند");
  };

  // Save all modifications
  const handleSave = useCallback(async () => {
    if (saving || unsavedCount === 0) return;
    setSaving(true);
    try {
      await saveCmsContent(content);
      setSavedContent(structuredClone(content));
      toast.success("تمام تغییرات محتوا و تصاویر با موفقیت ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در ذخیره محتوا");
    } finally {
      setSaving(false);
    }
  }, [content, saving, unsavedCount]);

  // Keyboard shortcut: Ctrl+S / Cmd+S to save
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  // Copy field key to clipboard
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    toast.success("کلید فیلد کپی شد");
  };

  // Filter sections & fields
  const filteredSections = useMemo(() => {
    if (!activePage) return [];
    const query = searchQuery.trim().toLowerCase();

    return activePage.sections
      .map((section) => {
        const matchingFields = section.fields.filter((field) => {
          const fieldType = field.type || "text";

          // Type filter
          if (typeFilter === "text" && fieldType !== "text" && fieldType !== "textarea") {
            return false;
          }
          if (typeFilter === "image" && fieldType !== "image") {
            return false;
          }
          if (typeFilter === "icon" && fieldType !== "icon") {
            return false;
          }
          if (typeFilter === "link" && fieldType !== "link") {
            return false;
          }

          // Search query
          if (!query) return true;
          const currentVal = activePageValues[field.key] || "";
          return (
            field.label.toLowerCase().includes(query) ||
            field.key.toLowerCase().includes(query) ||
            currentVal.toLowerCase().includes(query) ||
            (field.hint && field.hint.toLowerCase().includes(query))
          );
        });

        return { ...section, fields: matchingFields };
      })
      .filter((section) => section.fields.length > 0);
  }, [activePage, searchQuery, typeFilter, activePageValues]);

  if (authLoading || loading) {
    return (
      <AdminPageShell title="استودیو CMS و محتوا" description="در حال بارگذاری استودیو...">
        <AdminLoadingState label="در حال دریافت اطلاعات صفحات..." />
      </AdminPageShell>
    );
  }

  if (!user) return null;

  return (
    <AdminPageShell
      title="استودیو مدیریت محتوا و لندینگ (CMS پیشرو)"
      description="کنترل کامل متون، تصاویر، بنرها، آیکن‌ها و پیوندهای تمام صفحات سایت عمومی"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {unsavedCount > 0 && (
            <Badge variant="outline" className="gap-1 border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse">
              <span className="size-1.5 rounded-full bg-amber-500" />
              {unsavedCount} تغییر ذخیره‌نشده
            </Badge>
          )}

          {activePage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(activePage.route, "_blank")}
              className="gap-1.5 text-xs font-semibold"
              title="مشاهده زنده این صفحه در تب جدید"
            >
              <ExternalLink className="size-3.5" />
              مشاهده صفحه
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetCurrentPage}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            title="بازگرداندن مقادیر این صفحه به حالت پیش‌فرض"
          >
            <RotateCcw className="size-3.5" />
            پیش‌فرض صفحه
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || unsavedCount === 0}
            className="gap-2 text-xs font-bold shadow-sm"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            ذخیره تغییرات
            <kbd className="hidden sm:inline-block rounded bg-primary-foreground/20 px-1 py-0.5 font-mono text-[9px]">
              ⌘S
            </kbd>
          </Button>
        </div>
      }
    >
      {/* Top Shortcuts Bar to existing specialized editors */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LayoutTemplate className="size-4 text-primary" />
          <span className="font-semibold text-foreground">میانبرهای CMS داده‌محور:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/comments"
            className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
          >
            <MessageSquareQuote className="size-3.5" />
            <span>نظرات کاربران</span>
          </Link>
          <Link
            href="/admin/investment-funds"
            className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
          >
            <TrendingUp className="size-3.5" />
            <span>صندوق‌های سرمایه‌گذاری</span>
          </Link>
          <Link
            href="/admin/landing/home"
            className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
          >
            <Sliders className="size-3.5" />
            <span>قدم‌های موبایل‌اسکرولر</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
          >
            <Palette className="size-3.5" />
            <span>قالب و رنگ‌های سایت</span>
          </Link>
        </div>
      </div>

      {/* Main Categories Navigation */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-2">
          {(["landing", "content", "service", "shared"] as const).map((groupKey) => {
            const IconComp = GROUP_ICONS[groupKey];
            const isGroupActive = selectedGroup === groupKey;
            const count = PUBLIC_CONTENT_PAGES.filter((p) => p.group === groupKey).length;
            return (
              <button
                key={groupKey}
                type="button"
                onClick={() => setSelectedGroup(groupKey)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
                  isGroupActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <IconComp className="size-4" />
                <span>{PUBLIC_CONTENT_GROUP_LABELS[groupKey]}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px]",
                    isGroupActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Page Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {groupPages.map((page) => {
            const isPageActive = page.id === selectedPageId;
            const pageValues = content[page.id] || {};
            const pageSaved = savedContent[page.id] || {};
            const hasChanges = Object.keys(pageValues).some(
              (k) => pageValues[k] !== pageSaved[k]
            );

            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setSelectedPageId(page.id)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition",
                  isPageActive
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-2xs"
                    : "border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <span>{page.title}</span>
                <span className="font-mono text-[10px] opacity-60" dir="ltr">
                  {page.route}
                </span>
                {hasChanges && (
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" title="تغییرات ذخیره‌نشده" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی سریع در عنوان‌ها، متن‌ها، آیکن‌ها و کلیدها..."
            className="h-10 pr-9 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              پاک‌کردن
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">
          {[
            { id: "all", label: "همه فیلدها", icon: Filter },
            { id: "text", label: "متن‌ها", icon: Type },
            { id: "image", label: "تصاویر", icon: ImageIcon },
            { id: "icon", label: "آیکن‌ها", icon: Sparkles },
            { id: "link", label: "پیوندها", icon: LinkIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id as FilterType)}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition shrink-0",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Page Meta Header */}
      {activePage && (
        <div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">{activePage.title}</h2>
              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground" dir="ltr">
                {activePage.route}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {activePage.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted/60 px-2 py-0.5 font-medium">
              {activePage.sections.length} بخش
            </span>
            <span>•</span>
            <span className="rounded-md bg-muted/60 px-2 py-0.5 font-medium">
              {activePage.sections.flatMap((s) => s.fields).length} مؤلفه
            </span>
          </div>
        </div>
      )}

      {/* Two Column Canvas: Left (Editors), Right (Sticky Live Preview) */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left Column: Sections & Field Editors */}
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <Card key={section.id} className="p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{section.title}</h3>
                  {section.description && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                      {section.description}
                    </p>
                  )}
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {section.fields.length} فیلد
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((field) => {
                  const currentValue =
                    activePageValues[field.key] !== undefined
                      ? activePageValues[field.key]
                      : defaults[activePage.id]?.[field.key] ?? field.defaultValue;
                  const isDirty =
                    activePageValues[field.key] !== undefined &&
                    activePageValues[field.key] !== activePageSaved[field.key];
                  const isModifiedFromDefault =
                    currentValue !== field.defaultValue;
                  const fieldType = field.type || "text";
                  const badgeInfo = FIELD_TYPE_BADGES[fieldType] || FIELD_TYPE_BADGES.text;

                  return (
                    <div
                      key={field.key}
                      className={cn(
                        "group relative rounded-xl border border-border/60 bg-muted/10 p-3 space-y-2 transition hover:border-border hover:bg-card",
                        isDirty && "border-amber-500/40 bg-amber-500/5",
                        (fieldType === "textarea" || fieldType === "image") && "sm:col-span-2"
                      )}
                    >
                      {/* Field Header */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "rounded-md border px-1.5 py-0.2 text-[9px] font-bold",
                              badgeInfo.className
                            )}
                          >
                            {badgeInfo.label}
                          </span>
                          <Label className="text-xs font-semibold text-foreground">
                            {field.label}
                          </Label>
                          {isDirty && (
                            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" title="ویرایش شده" />
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Quick Undo to default button */}
                          {isModifiedFromDefault && (
                            <button
                              type="button"
                              onClick={() => resetField(activePage.id, field.key, field.defaultValue)}
                              title={`بازگردانی به پیش‌فرض: ${field.defaultValue}`}
                              className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition"
                            >
                              <Undo2 className="size-2.5" />
                              <span>پیش‌فرض</span>
                            </button>
                          )}

                          {/* Copy key button */}
                          <button
                            type="button"
                            onClick={() => handleCopyKey(field.key)}
                            title="کپی شناسه فیلد"
                            className="flex items-center rounded px-1 py-0.5 text-[9px] font-mono text-muted-foreground/60 hover:text-foreground transition"
                            dir="ltr"
                          >
                            {copiedKey === field.key ? (
                              <Check className="size-2.5 text-emerald-500" />
                            ) : (
                              <Copy className="size-2.5 opacity-0 group-hover:opacity-100" />
                            )}
                            <span className="ml-1">{field.key}</span>
                          </button>
                        </div>
                      </div>

                      {/* Specialized Field Inputs */}
                      {fieldType === "textarea" && (
                        <div>
                          <Textarea
                            value={currentValue}
                            rows={3}
                            onChange={(e) => setField(activePage.id, field.key, e.target.value)}
                            placeholder={field.hint || field.defaultValue}
                            className="text-xs leading-relaxed font-sans"
                          />
                          <div className="mt-1 flex justify-end text-[10px] text-muted-foreground">
                            {currentValue.length} کاراکتر
                          </div>
                        </div>
                      )}

                      {fieldType === "text" && (
                        <div className="relative">
                          <Input
                            value={currentValue}
                            onChange={(e) => setField(activePage.id, field.key, e.target.value)}
                            placeholder={field.hint || field.defaultValue}
                            className="h-9 text-xs"
                          />
                        </div>
                      )}

                      {fieldType === "image" && (
                        <ImageUploadField
                          value={currentValue}
                          onChange={(url) => setField(activePage.id, field.key, url)}
                          hint={field.hint}
                        />
                      )}

                      {fieldType === "icon" && (
                        <IconPicker
                          value={currentValue}
                          onChange={(iconName) => setField(activePage.id, field.key, iconName)}
                          hint={field.hint}
                        />
                      )}

                      {fieldType === "link" && (
                        <div className="space-y-1">
                          <Input
                            value={currentValue}
                            onChange={(e) => setField(activePage.id, field.key, e.target.value)}
                            dir="ltr"
                            placeholder={field.hint || "/courses یا tel:..."}
                            className="h-9 text-xs font-mono"
                          />
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            <span className="text-[10px] text-muted-foreground">نمونه:</span>
                            {["/courses", "/investment-plans", "/business-consulting", "/contact", "/about-us"].map(
                              (sample) => (
                                <button
                                  key={sample}
                                  type="button"
                                  onClick={() => setField(activePage.id, field.key, sample)}
                                  className="rounded px-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground font-mono"
                                  dir="ltr"
                                >
                                  {sample}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {field.hint && fieldType !== "image" && fieldType !== "icon" && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{field.hint}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}

          {filteredSections.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground space-y-2">
              <Search className="mx-auto size-8 opacity-40" />
              <p className="text-sm font-semibold">موردی با این فیلتر یا عبارت جستجو پیدا نشد.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                }}
                className="text-xs"
              >
                پاک کردن فیلترها
              </Button>
            </Card>
          )}
        </div>

        {/* Right Column: Sticky Live Preview */}
        <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-110px)]">
          <CmsLivePreview
            pageId={activePage?.id || "home-v32"}
            route={activePage?.route || "/"}
            values={activePageValues}
            defaults={defaults[activePage?.id || ""] || {}}
          />
        </div>
      </div>

      {/* Floating Bottom Quick-Save Dock when there are unsaved changes */}
      {unsavedCount > 0 && (
        <aside
          aria-label="نوار ذخیره تغییرات"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-background/95 px-4 py-2.5 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              {unsavedCount} تغییر ذخیره‌نشده در سایت
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={discardAllChanges}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              انصراف
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-8 gap-1.5 text-xs font-bold shadow"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              ذخیره تغییرات (⌘S)
            </Button>
          </div>
        </aside>
      )}
    </AdminPageShell>
  );
}
