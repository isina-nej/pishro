"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  EyeOff,
  ImageIcon,
  Loader2,
  Menu,
  Moon,
  Palette,
  PanelBottom,
  Plus,
  Save,
  Sun,
  Monitor,
  Trash2,
  Pencil,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  AdminLoadingState,
  AdminPageShell,
} from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ColorField from "@/components/admin/theme/ColorField";
import BrandingSection from "@/components/admin/settings/BrandingSection";
import HiddenPagesSection from "@/components/admin/settings/HiddenPagesSection";
import UserPanelPaletteSection from "@/components/admin/settings/UserPanelPaletteSection";
import NavbarItemsSection from "@/components/admin/settings/NavbarItemsSection";
import FooterContentSection from "@/components/admin/settings/FooterContentSection";
import HomeLayoutSection from "@/components/admin/settings/HomeLayoutSection";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import {
  LANDING_PALETTES,
  DEFAULT_PALETTE_ID,
  DEFAULT_THEME_MODE,
  DEFAULT_USER_PANEL_PALETTE_ID,
  type LandingPalette,
  type SiteThemeMode,
} from "@/lib/theme/landing-palettes";
import {
  DEFAULT_EDITABLE_DARK,
  DEFAULT_EDITABLE_LIGHT,
  EDITABLE_COLOR_FIELDS,
  buildTokensFromEditable,
  type EditablePaletteColors,
} from "@/lib/theme/custom-palette";
import { parseHiddenPages } from "@/lib/site/hidable-pages";
import {
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_NAVBAR_ITEMS,
  parseFooterContent,
  parseNavbarItems,
  type FooterContent,
  type NavbarItem,
} from "@/lib/site/chrome-content";
import { cn } from "@/lib/utils";
import {
  DEFAULT_HOME_LAYOUT,
  parseHomeLayout,
  type HomeLayout,
} from "@/lib/site/home-layout";

type SettingsTab = "site" | "panel" | "branding" | "pages" | "nav" | "footer";

type SettingsPayload = {
  paletteId?: string;
  themeMode?: string;
  siteName?: string | null;
  siteDescription?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  ogImageUrl?: string | null;
  hiddenPages?: unknown;
  userPanelPaletteId?: string;
  navbarItems?: unknown;
  footerContent?: unknown;
  homeLayout?: string;
};

type CustomPaletteItem = {
  id: string;
  paletteId: string;
  name: string;
  nameFa: string;
  description: string;
  lightColors: EditablePaletteColors;
  darkColors: EditablePaletteColors;
  light: LandingPalette["light"];
  dark: LandingPalette["dark"];
};

async function fetchSettings(): Promise<SettingsPayload> {
  const res = await fetch("/api/admin/settings", { credentials: "include" });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در دریافت تنظیمات");
  }
  return json.data as SettingsPayload;
}

async function saveSettings(
  body: Record<string, unknown>
): Promise<SettingsPayload> {
  const res = await fetch("/api/admin/settings", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در ذخیره تنظیمات");
  }
  return json.data as SettingsPayload;
}

async function fetchCustomPalettes(): Promise<CustomPaletteItem[]> {
  const res = await fetch("/api/admin/palettes", { credentials: "include" });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در دریافت پالت‌های سفارشی");
  }
  return json.data as CustomPaletteItem[];
}

type EditorState = {
  id?: string;
  name: string;
  nameFa: string;
  description: string;
  lightColors: EditablePaletteColors;
  darkColors: EditablePaletteColors;
};

function emptyEditor(): EditorState {
  return {
    name: "",
    nameFa: "",
    description: "",
    lightColors: { ...DEFAULT_EDITABLE_LIGHT },
    darkColors: { ...DEFAULT_EDITABLE_DARK },
  };
}

export default function AdminSettingsPage() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<SettingsTab>("site");
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [themeMode, setThemeMode] = useState<SiteThemeMode>(DEFAULT_THEME_MODE);
  const [savedPaletteId, setSavedPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [savedThemeMode, setSavedThemeMode] =
    useState<SiteThemeMode>(DEFAULT_THEME_MODE);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [customs, setCustoms] = useState<CustomPaletteItem[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [editorTab, setEditorTab] = useState<"light" | "dark">("light");
  const [savingCustom, setSavingCustom] = useState(false);
  const [userPanelPaletteId, setUserPanelPaletteId] = useState(
    DEFAULT_USER_PANEL_PALETTE_ID
  );
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [hiddenPages, setHiddenPages] = useState<string[]>([]);
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>(
    DEFAULT_NAVBAR_ITEMS.map((item) => ({ ...item }))
  );
  const [footerContent, setFooterContent] = useState<FooterContent>(
    structuredClone(DEFAULT_FOOTER_CONTENT)
  );
  const [homeLayout, setHomeLayout] = useState<HomeLayout>(DEFAULT_HOME_LAYOUT);
  const [savedHomeLayout, setSavedHomeLayout] =
    useState<HomeLayout>(DEFAULT_HOME_LAYOUT);

  const reload = async () => {
    const [settings, customList] = await Promise.all([
      fetchSettings(),
      fetchCustomPalettes(),
    ]);
    const nextPalette = settings.paletteId || DEFAULT_PALETTE_ID;
    const nextMode =
      settings.themeMode === "light" ||
      settings.themeMode === "dark" ||
      settings.themeMode === "system"
        ? settings.themeMode
        : DEFAULT_THEME_MODE;
    setPaletteId(nextPalette);
    setThemeMode(nextMode);
    setSavedPaletteId(nextPalette);
    setSavedThemeMode(nextMode);
    setUserPanelPaletteId(
      settings.userPanelPaletteId || DEFAULT_USER_PANEL_PALETTE_ID
    );
    setSiteName(settings.siteName || "");
    setSiteDescription(settings.siteDescription || "");
    setLogoUrl(settings.logoUrl || "");
    setFaviconUrl(settings.faviconUrl || "");
    setOgImageUrl(settings.ogImageUrl || "");
    setHiddenPages(parseHiddenPages(settings.hiddenPages));
    setNavbarItems(parseNavbarItems(settings.navbarItems));
    setFooterContent(parseFooterContent(settings.footerContent));
    setHomeLayout(parseHomeLayout(settings.homeLayout));
    setSavedHomeLayout(parseHomeLayout(settings.homeLayout));
    setCustoms(customList);
  };

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "خطا در بارگذاری");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const dirty = paletteId !== savedPaletteId || themeMode !== savedThemeMode;

  const allPalettes: LandingPalette[] = useMemo(() => {
    const customAsLanding: LandingPalette[] = customs.map((c) => ({
      id: c.paletteId,
      name: c.name,
      nameFa: c.nameFa,
      description: c.description || "پالت سفارشی",
      light: c.light,
      dark: c.dark,
    }));
    return [...LANDING_PALETTES, ...customAsLanding];
  }, [customs]);

  const selected =
    allPalettes.find((p) => p.id === paletteId) ?? LANDING_PALETTES[0];

  const previewTokens =
    previewMode === "dark" ? selected.dark : selected.light;

  const editorPreviewTokens = useMemo(() => {
    const colors =
      editorTab === "dark" ? editor.darkColors : editor.lightColors;
    return buildTokensFromEditable(colors, editorTab);
  }, [editor, editorTab]);

  const onSave = async () => {
    setSaving(true);
    try {
      const data = await saveSettings({ paletteId, themeMode });
      setSavedPaletteId(data.paletteId || paletteId);
      setSavedThemeMode((data.themeMode as SiteThemeMode) || themeMode);
      toast.success("پالت رنگی سایت ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const onSavePanelPalette = async () => {
    setSaving(true);
    try {
      await saveSettings({ userPanelPaletteId });
      toast.success("پالت پنل کاربر ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const onSaveHomeLayout = async () => {
    setSaving(true);
    try {
      const data = await saveSettings({ homeLayout });
      setSavedHomeLayout(parseHomeLayout(data.homeLayout));
      toast.success("طرح صفحه اصلی ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const onSaveBranding = async () => {
    setSaving(true);
    try {
      await saveSettings({
        siteName: siteName.trim() || null,
        siteDescription: siteDescription.trim() || null,
        logoUrl: logoUrl.trim() || null,
        faviconUrl: faviconUrl.trim() || null,
        ogImageUrl: ogImageUrl.trim() || null,
      });
      toast.success("برندینگ ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const onSaveHiddenPages = async () => {
    setSaving(true);
    try {
      await saveSettings({ hiddenPages });
      toast.success("نمایش صفحات ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const onSaveNavbarItems = async () => {
    setSaving(true);
    try {
      const data = await saveSettings({ navbarItems });
      setNavbarItems(parseNavbarItems(data.navbarItems));
      toast.success("منوی صفحات ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const onSaveFooterContent = async () => {
    setSaving(true);
    try {
      const data = await saveSettings({ footerContent });
      setFooterContent(parseFooterContent(data.footerContent));
      toast.success("اطلاعات فوتر ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditor(emptyEditor());
    setEditorTab("light");
    setEditorOpen(true);
  };

  const openEdit = (item: CustomPaletteItem) => {
    setEditor({
      id: item.id,
      name: item.name,
      nameFa: item.nameFa,
      description: item.description,
      lightColors: { ...item.lightColors },
      darkColors: { ...item.darkColors },
    });
    setEditorTab("light");
    setEditorOpen(true);
  };

  const saveCustom = async () => {
    setSavingCustom(true);
    try {
      const payload = {
        name: editor.name,
        nameFa: editor.nameFa,
        description: editor.description,
        lightColors: editor.lightColors,
        darkColors: editor.darkColors,
      };
      const url = editor.id
        ? `/api/admin/palettes/${editor.id}`
        : "/api/admin/palettes";
      const method = editor.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "خطا در ذخیره پالت سفارشی");
      }
      const saved = json.data as CustomPaletteItem;
      toast.success(editor.id ? "پالت ویرایش شد" : "پالت سفارشی ساخته شد");
      setEditorOpen(false);
      await reload();
      setPaletteId(saved.paletteId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSavingCustom(false);
    }
  };

  const removeCustom = async (item: CustomPaletteItem) => {
    if (!window.confirm(`پالت «${item.nameFa}» حذف شود؟`)) return;
    try {
      const res = await fetch(`/api/admin/palettes/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "خطا در حذف");
      }
      toast.success("پالت حذف شد");
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در حذف");
    }
  };

  const setEditorColor = (
    mode: "light" | "dark",
    key: keyof EditablePaletteColors,
    hex: string
  ) => {
    setEditor((prev) => ({
      ...prev,
      [mode === "light" ? "lightColors" : "darkColors"]: {
        ...(mode === "light" ? prev.lightColors : prev.darkColors),
        [key]: hex,
      },
    }));
  };

  if (authLoading || loading) {
    return <AdminLoadingState label="در حال بارگذاری تنظیمات..." />;
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <AdminPageShell title="تنظیمات" description="دسترسی محدود">
        <Card className="p-6 text-sm text-muted-foreground">
          فقط ادمین می‌تواند ظاهر سایت را مدیریت کند.
        </Card>
      </AdminPageShell>
    );
  }

  const tabs: {
    id: SettingsTab;
    label: string;
    icon: typeof Palette;
  }[] = [
    { id: "site", label: "پالت سایت", icon: Palette },
    { id: "panel", label: "پالت پنل کاربر", icon: UserRound },
    { id: "branding", label: "لوگو و آیکن", icon: ImageIcon },
    { id: "nav", label: "منوی صفحات", icon: Menu },
    { id: "footer", label: "فوتر", icon: PanelBottom },
    { id: "pages", label: "مدیریت نمایش", icon: EyeOff },
  ];

  return (
    <AdminPageShell
      title="ظاهر سایت"
      description="پالت، لوگو، نام گزینه‌های منو، اطلاعات فوتر و نمایش صفحات را از اینجا مدیریت کنید."
      actions={
        tab === "site" ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              پالت سفارشی
            </Button>
            <Button onClick={onSave} disabled={!dirty || saving} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              ذخیره پالت فعال
            </Button>
          </div>
        ) : undefined
      }
    >
      <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-1.5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition",
              tab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "panel" && (
        <UserPanelPaletteSection
          userPanelPaletteId={userPanelPaletteId}
          customs={customs}
          onChange={setUserPanelPaletteId}
          onSave={onSavePanelPalette}
          saving={saving}
        />
      )}

      {tab === "branding" && (
        <BrandingSection
          siteName={siteName}
          siteDescription={siteDescription}
          logoUrl={logoUrl}
          faviconUrl={faviconUrl}
          ogImageUrl={ogImageUrl}
          onChange={(patch) => {
            if (patch.siteName !== undefined) setSiteName(patch.siteName);
            if (patch.siteDescription !== undefined) {
              setSiteDescription(patch.siteDescription);
            }
            if (patch.logoUrl !== undefined) setLogoUrl(patch.logoUrl);
            if (patch.faviconUrl !== undefined) setFaviconUrl(patch.faviconUrl);
            if (patch.ogImageUrl !== undefined) setOgImageUrl(patch.ogImageUrl);
          }}
          onSave={onSaveBranding}
          saving={saving}
        />
      )}

      {tab === "pages" && (
        <HiddenPagesSection
          hiddenPages={hiddenPages}
          onChange={setHiddenPages}
          onSave={onSaveHiddenPages}
          saving={saving}
        />
      )}

      {tab === "nav" && (
        <NavbarItemsSection
          items={navbarItems}
          onChange={setNavbarItems}
          onSave={onSaveNavbarItems}
          saving={saving}
        />
      )}

      {tab === "footer" && (
        <FooterContentSection
          content={footerContent}
          onChange={setFooterContent}
          onSave={onSaveFooterContent}
          saving={saving}
        />
      )}

      {tab === "site" && (
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <HomeLayoutSection
            homeLayout={homeLayout}
            savedHomeLayout={savedHomeLayout}
            onChange={setHomeLayout}
            onSave={onSaveHomeLayout}
            saving={saving}
          />

          <Card className="space-y-4 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">پالت‌های آماده</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {LANDING_PALETTES.map((palette, index) => {
                const active = palette.id === paletteId;
                const swatch = palette.light;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setPaletteId(palette.id)}
                    className={cn(
                      "rounded-2xl border p-3 text-right transition",
                      active
                        ? "border-primary ring-2 ring-primary/25"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div
                      className="mb-3 h-14 overflow-hidden rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${swatch.homeDeep} 0%, ${swatch.homeGlow} 55%, ${swatch.homeGold} 100%)`,
                      }}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold">
                          {index + 1}. {palette.nameFa}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {palette.description}
                        </p>
                      </div>
                      {active && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold">پالت‌های سفارشی</h2>
              <Button size="sm" variant="outline" onClick={openCreate} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                جدید
              </Button>
            </div>
            {customs.length === 0 ? (
              <p className="text-xs leading-6 text-muted-foreground">
                هنوز پالت سفارشی ندارید. با «پالت سفارشی» یکی بسازید و رنگ‌ها را
                با کد یا رنگ‌چین گرافیکی تنظیم کنید.
              </p>
            ) : (
              <div className="space-y-2">
                {customs.map((item) => {
                  const active = item.paletteId === paletteId;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3",
                        active
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      )}
                    >
                      <button
                        type="button"
                        className="h-12 w-12 shrink-0 rounded-lg border border-border"
                        style={{
                          background: `linear-gradient(135deg, ${item.lightColors.primary}, ${item.lightColors.secondary} 55%, ${item.lightColors.accent})`,
                        }}
                        onClick={() => setPaletteId(item.paletteId)}
                        title="انتخاب به‌عنوان پالت فعال"
                      />
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-right"
                        onClick={() => setPaletteId(item.paletteId)}
                      >
                        <p className="truncate text-sm font-bold">{item.nameFa}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {item.name}
                          {item.description ? ` — ${item.description}` : ""}
                        </p>
                      </button>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEdit(item)}
                          aria-label="ویرایش"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeCustom(item)}
                          aria-label="حذف"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="space-y-4 p-4 sm:p-5">
            <h2 className="text-sm font-bold">حالت پیش‌فرض تم</h2>
            <p className="text-xs leading-6 text-muted-foreground">
              برای بازدیدکنندهٔ جدید. کاربر می‌تواند لایت/دارک را عوض کند؛ پالت
              ذخیره‌شده برای هر دو حالت استفاده می‌شود.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "light", label: "لایت", icon: Sun },
                  { id: "dark", label: "دارک", icon: Moon },
                  { id: "system", label: "سیستم", icon: Monitor },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setThemeMode(id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition",
                    themeMode === id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-bold">پیش‌نمایش پالت فعال</h2>
              <div className="flex rounded-lg bg-muted p-1">
                {(["light", "dark"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[11px] font-bold",
                      previewMode === mode
                        ? "bg-card shadow-sm"
                        : "text-muted-foreground"
                    )}
                  >
                    {mode === "light" ? "لایت" : "دارک"}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="space-y-4 p-5"
              style={{
                background: previewTokens.homeBg,
                color: previewTokens.homeInk,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-lg font-extrabold"
                  style={{ color: previewTokens.homeDeep }}
                >
                  پیشرو
                </span>
                <span
                  className="text-xs"
                  style={{ color: previewTokens.homeMuted }}
                >
                  {selected.nameFa}
                </span>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{
                  background: `linear-gradient(145deg, ${previewTokens.homeDeep}, ${previewTokens.homeGlow})`,
                  color: previewTokens.homeOnDark,
                }}
              >
                <p className="text-sm font-bold">مسیر رشد مالی با پیشرو</p>
                <p
                  className="mt-1 text-[11px]"
                  style={{ color: previewTokens.homeOnDarkMuted }}
                >
                  آموزش و سرمایه‌گذاری در یک تجربهٔ یکپارچه
                </p>
              </div>
              <div className="flex gap-2">
                {[
                  previewTokens.homeBg,
                  previewTokens.homeDeep,
                  previewTokens.homeGlow,
                  previewTokens.homeGold,
                ].map((hex) => (
                  <span
                    key={hex}
                    className="h-8 flex-1 rounded-lg border border-black/5"
                    style={{ background: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          </Card>

          {dirty && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              پالت/تم انتخاب‌شده هنوز ذخیره نشده. «ذخیره پالت فعال» را بزنید.
            </p>
          )}
        </div>
      </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-3 sm:items-center">
          <Card className="max-h-[92vh] w-full max-w-3xl overflow-y-auto p-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">
                  {editor.id ? "ویرایش پالت سفارشی" : "پالت سفارشی جدید"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  کد رنگ (#RRGGBB) را تایپ کنید یا روی مربع رنگ کلیک کنید و با
                  موس انتخاب کنید.
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditorOpen(false)}
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">نام فارسی</Label>
                <Input
                  value={editor.nameFa}
                  onChange={(e) =>
                    setEditor((p) => ({ ...p, nameFa: e.target.value }))
                  }
                  placeholder="مثلاً سبز اختصاصی"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">نام انگلیسی</Label>
                <Input
                  value={editor.name}
                  onChange={(e) =>
                    setEditor((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Custom Green"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">توضیح</Label>
                <Textarea
                  value={editor.description}
                  onChange={(e) =>
                    setEditor((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={2}
                  placeholder="اختیاری"
                />
              </div>
            </div>

            <div className="mt-4 flex rounded-xl bg-muted p-1">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setEditorTab(mode)}
                  className={cn(
                    "flex-1 rounded-lg py-2 text-xs font-bold",
                    editorTab === mode
                      ? "bg-card shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  {mode === "light" ? "رنگ‌های لایت" : "رنگ‌های دارک"}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {EDITABLE_COLOR_FIELDS.map((field) => (
                <ColorField
                  key={`${editorTab}-${field.key}`}
                  label={field.label}
                  hint={field.hint}
                  value={
                    editorTab === "light"
                      ? editor.lightColors[field.key]
                      : editor.darkColors[field.key]
                  }
                  onChange={(hex) => setEditorColor(editorTab, field.key, hex)}
                />
              ))}
            </div>

            <div
              className="mt-5 rounded-2xl border border-border p-4"
              style={{
                background: editorPreviewTokens.homeBg,
                color: editorPreviewTokens.homeInk,
              }}
            >
              <p className="text-xs font-bold" style={{ color: editorPreviewTokens.homeMuted }}>
                پیش‌نمایش لحظه‌ای ({editorTab === "light" ? "لایت" : "دارک"})
              </p>
              <div
                className="mt-3 rounded-xl p-4"
                style={{
                  background: `linear-gradient(145deg, ${editorPreviewTokens.homeDeep}, ${editorPreviewTokens.homeGlow})`,
                  color: editorPreviewTokens.homeOnDark,
                }}
              >
                <p className="text-sm font-bold">پیشرو</p>
                <p
                  className="mt-1 text-[11px]"
                  style={{ color: editorPreviewTokens.homeOnDarkMuted }}
                >
                  نمونه تیتر روی پالت سفارشی شما
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => setEditorOpen(false)}>
                انصراف
              </Button>
              <Button
                onClick={saveCustom}
                disabled={
                  savingCustom || !editor.name.trim() || !editor.nameFa.trim()
                }
                className="gap-2"
              >
                {savingCustom ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                ذخیره پالت سفارشی
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AdminPageShell>
  );
}
