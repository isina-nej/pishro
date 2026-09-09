"use client";

import React, { useState } from "react";
import {
  Monitor,
  Smartphone,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  RotateCcw,
  Lock,
  BookOpen,
  FileText,
} from "lucide-react";
import { DynamicIcon } from "@/components/site/DynamicIcon";
import { cn } from "@/lib/utils";

interface CmsLivePreviewProps {
  pageId: string;
  route?: string;
  values: Record<string, string>;
  defaults: Record<string, string>;
}

export default function CmsLivePreview({
  pageId,
  route = "/",
  values,
  defaults,
}: CmsLivePreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [refreshKey, setRefreshKey] = useState(0);

  const v = (key: string, fallback = "") =>
    values[key] !== undefined && values[key] !== ""
      ? values[key]
      : defaults[key] !== undefined
      ? defaults[key]
      : fallback;

  return (
    <div
      className="flex h-full flex-col rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden"
      dir="rtl"
    >
      {/* Preview Header & Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-3.5 py-2.5 gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-foreground">پیش‌نمایش زنده و ریل‌تایم</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme switcher for preview */}
          <button
            type="button"
            onClick={() => setPreviewTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            title={`تغییر به تم ${previewTheme === "dark" ? "روشن" : "تاریک"}`}
            className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground"
          >
            {previewTheme === "dark" ? (
              <Sun className="size-3.5 text-amber-500" />
            ) : (
              <Moon className="size-3.5 text-indigo-500" />
            )}
          </button>

          {/* Refresh animation */}
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            title="رفرش مجدد پیش‌نمایش"
            className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
          </button>

          {/* Device selector */}
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition",
                device === "desktop"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="size-3.5" />
              <span>دسکتاپ</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition",
                device === "mobile"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="size-3.5" />
              <span>موبایل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Browser Address Bar for Desktop */}
      {device === "desktop" && (
        <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-3 py-1.5 text-[11px] text-muted-foreground" dir="ltr">
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-rose-400" />
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="size-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex flex-1 items-center gap-1.5 rounded-md bg-background/80 border border-border px-2 py-0.5 font-mono text-[10px] text-foreground/80">
            <Lock className="size-2.5 text-emerald-500" />
            <span className="text-muted-foreground">https://pishrosarmaye.com</span>
            <span className="font-semibold text-primary">{route}</span>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div key={refreshKey} className="flex-1 overflow-y-auto bg-muted/10 p-3 sm:p-4">
        <div
          className={cn(
            "mx-auto transition-all duration-300",
            previewTheme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-white text-slate-900",
            device === "mobile"
              ? "max-w-[320px] rounded-[2.5rem] border-[6px] border-slate-800 p-3 shadow-2xl relative min-h-[580px]"
              : "w-full rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs"
          )}
        >
          {/* Mobile phone notch & status bar */}
          {device === "mobile" && (
            <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2 text-[10px] text-muted-foreground font-mono" dir="ltr">
              <span>09:41</span>
              <div className="size-2.5 rounded-full bg-slate-700 mx-auto" />
              <span>5G 100%</span>
            </div>
          )}

          {/* ================= PAGE PREVIEW: HOME V32 ================= */}
          {pageId === "home-v32" && (
            <div className="space-y-5">
              {/* Hero Banner Mockup */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-900 via-slate-950 to-emerald-950 p-4 sm:p-5 text-white shadow-md">
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] text-emerald-400 font-semibold">
                    <Sparkles className="size-3" />
                    <span>لندینگ سرمایه‌گذاری هوشمند</span>
                  </div>

                  <h1 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {v("hero.title", "پیشرو سرمایه")}
                  </h1>

                  <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                    {v("hero.subtitle", "پیشرو در آموزش و سرمایه‌گذاری")}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow transition hover:bg-emerald-500">
                      📞 {v("hero.phoneCta", "تماس با پشتیبانی")}
                    </span>
                    <span className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow transition hover:bg-amber-500">
                      💰 {v("hero.calculatorCta", "محاسبه سود")}
                    </span>
                  </div>

                  {/* Chips with Icons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { text: v("hero.chip1", "آموزش ترید"), icon: v("hero.chip1Icon", "GraduationCap") },
                      { text: v("hero.chip2", "سبدهای تضمینی"), icon: v("hero.chip2Icon", "ShieldCheck") },
                      { text: v("hero.chip3", "مشاوره"), icon: v("hero.chip3Icon", "Briefcase") },
                      { text: v("hero.chip4", "پشتیبانی"), icon: v("hero.chip4Icon", "Headphones") },
                    ].map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-xs"
                      >
                        <DynamicIcon name={c.icon} className="size-2.5 text-emerald-400" />
                        <span>{c.text}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Phone Card Mockup */}
                <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-3 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[11px] text-white/60 border-b border-white/10 pb-1.5">
                    <span>{v("phone.title", "سرمایه‌گذاری")}</span>
                    <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300 font-bold">
                      {v("phone.portfolioChange", "+۴٫۲٪")}
                    </span>
                  </div>
                  <div className="mt-2 text-base font-black text-white">
                    {v("phone.portfolioValue", "۲۲۳٬۱۵۸٬۷۰۰")}{" "}
                    <span className="text-[10px] font-normal text-white/60">{v("phone.currency", "تومان")}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-white/70">
                    <span>{v("phone.card1Label", "سرمایه‌گذاری")}</span>
                    <span className="font-bold text-emerald-400">{v("phone.card1Value", "تضمینی")}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-white/70">
                    <span>{v("phone.card2Label", "سرمایه‌گذاری خودکار")}</span>
                    <span className="font-bold text-amber-400">{v("phone.card2Value", "ماهانه")}</span>
                  </div>
                </div>
              </div>

              {/* Trust Cards with Dynamic Icons */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground">کارت‌های مزیت و اعتماد:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      title: v("trust.1Title", "دوره‌های پیشرفته"),
                      text: v("trust.1Text", "آموزش حرفه‌ای ترید"),
                      icon: v("trust.1Icon", "GraduationCap"),
                    },
                    {
                      title: v("trust.2Title", "پشتیبانی"),
                      text: v("trust.2Text", "دسترسی به مشاوران"),
                      icon: v("trust.2Icon", "Headphones"),
                    },
                    {
                      title: v("trust.3Title", "متناسب با نیاز شما"),
                      text: v("trust.3Text", "زیر نظر متخصصان"),
                      icon: v("trust.3Icon", "Sparkles"),
                    },
                    {
                      title: v("trust.4Title", "+۶ سال"),
                      text: v("trust.4Text", "سابقه فعالیت"),
                      icon: v("trust.4Icon", "Award"),
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 rounded-xl border border-border/80 bg-card p-2.5 text-right shadow-2xs"
                    >
                      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <DynamicIcon name={card.icon} className="size-4" />
                      </div>
                      <b className="text-xs font-bold text-foreground truncate">{card.title}</b>
                      <span className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
                        {card.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Split Balance Section */}
              <div className="rounded-xl border border-border/80 bg-card p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <b className="text-xs font-bold text-foreground">{v("split.title", "متناسب با نیاز شما")}</b>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {v("split.row1Value", "+۲٫۱٪")}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                  {v("split.description", "از آموزش تا سرمایه‌گذاری متناسب با نیاز شما")}
                </p>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-[10px]">
                  <span className="text-muted-foreground">{v("split.balanceLabel", "موجودی سبد")}</span>
                  <span className="font-bold text-foreground">{v("split.balanceValue", "۵۲۶٬۸۲۵٬۰۰۰")}</span>
                </div>
              </div>

              {/* Audience Cards */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground">{v("audience.title", "مسیرهای مخاطب")}:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: v("audience.card1", "مبتدی"), icon: v("audience.card1Icon", "GraduationCap"), link: v("audience.card1Link", "/courses"), color: "from-blue-900 to-slate-900" },
                    { label: v("audience.card2", "معامله‌گر"), icon: v("audience.card2Icon", "TrendingUp"), link: v("audience.card2Link", "/investment-plans"), color: "from-emerald-950 to-slate-900" },
                    { label: v("audience.card3", "سبد و نهاد"), icon: v("audience.card3Icon", "PieChart"), link: v("audience.card3Link", "/investment-plans"), color: "from-amber-950 to-slate-900" },
                    { label: v("audience.card4", "مشاوره"), icon: v("audience.card4Icon", "Briefcase"), link: v("audience.card4Link", "/business-consulting"), color: "from-indigo-950 to-slate-900" },
                  ].map((aud, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between rounded-xl bg-gradient-to-br p-2.5 text-white shadow-xs",
                        aud.color
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <DynamicIcon name={aud.icon} className="size-3.5 text-white/80" />
                        <span className="text-xs font-bold">{aud.label}</span>
                      </div>
                      <ArrowLeft className="size-3 text-white/50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE PREVIEW: HOME SECTIONS (CALCULATOR, CLUB) ================= */}
          {pageId === "home-sections" && (
            <div className="space-y-4">
              {/* Classic coins hero preview */}
              <div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 text-white text-center">
                <div className="flex size-8 mx-auto items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mb-2">
                  <DynamicIcon name="Coins" className="size-4" />
                </div>
                <h3 className="text-sm font-bold">{v("classic.title", "پیشرو در مسیر سرمایه گذاری هوشمند")}</h3>
                <p className="text-[10px] text-white/60 mt-1">ویدیو هیرو: {v("classic.video", "/videos/v32-coins.mp4")}</p>
              </div>

              {/* Calculator Section Mockup */}
              <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-1.5">
                    <DynamicIcon name={v("calculator.icon", "Calculator")} className="size-4 text-primary" />
                    <b className="text-xs font-bold text-foreground">{v("calculator.title", "ماشین حساب")}</b>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{v("calculator.currency", "تومان")}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{v("calculator.description")}</p>
                <div className="rounded-lg bg-primary/10 p-2 text-center text-primary font-bold text-xs">
                  {v("calculator.result", "نتیجه سرمایه‌ گذاریت")}
                </div>
              </div>

              {/* News Club Mockup */}
              <div className="rounded-xl border border-border bg-card p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <DynamicIcon name={v("club.icon", "Bell")} className="size-4 text-amber-500" />
                  <b className="text-xs font-bold text-foreground">{v("club.title", "باشگاه")} {v("club.titleAccent", "پیشرو")}</b>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{v("club.description")}</p>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg border bg-muted/40 px-2 py-1 text-[10px] text-muted-foreground">
                    {v("club.phonePlaceholder", "09115829721")}
                  </div>
                  <span className="rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                    {v("club.submit", "عضویت")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE PREVIEW: COURSES ================= */}
          {pageId === "courses" && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-900 via-primary/30 to-slate-950 p-4 sm:p-5 text-white">
                <span className="inline-block rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-emerald-300">
                  {v("hero.badge", "دوره‌های آموزشی پیشرو")}
                </span>
                <h2 className="mt-2 text-base font-bold leading-snug">{v("hero.title", "دوره‌های تخصصی")}</h2>
                <p className="mt-1 text-xs text-white/70 leading-relaxed line-clamp-2">{v("hero.description")}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  {[
                    { label: v("hero.stat1", "دوره آموزشی"), icon: v("hero.stat1Icon", "BookOpen"), num: "۱۲+" },
                    { label: v("hero.stat2", "دانشجوی فعال"), icon: v("hero.stat2Icon", "Users"), num: "۳۵۰+" },
                    { label: v("hero.stat3", "دسته‌بندی"), icon: v("hero.stat3Icon", "Layers"), num: "۵" },
                    { label: v("hero.stat4", "میانگین رضایت"), icon: v("hero.stat4Icon", "Star"), num: "۴٫۹" },
                  ].map((st, i) => (
                    <div key={i} className="rounded-lg bg-white/5 p-2 backdrop-blur-xs">
                      <DynamicIcon name={st.icon} className="mx-auto size-3.5 text-emerald-400" />
                      <div className="mt-1 text-xs font-bold text-white">{st.num}</div>
                      <div className="text-[10px] text-white/60">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters preview */}
              <div className="rounded-xl border border-border bg-card p-3 space-y-2">
                <span className="text-[10px] text-muted-foreground">{v("filters.title", "دوره‌های آموزشی")}</span>
                <div className="rounded-lg border bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground">
                  {v("filters.searchPlaceholder", "جستجوی سریع در بین دوره‌ها")}
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE PREVIEW: CONTACT ================= */}
          {pageId === "contact" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {v("badge", "ارتباط با پیشرو")}
                </span>
                <h3 className="text-sm font-bold text-foreground">{v("title", "تماس با ما")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v("description")}</p>
              </div>

              <div className="space-y-1.5">
                {[
                  { label: v("phoneLabel", "تلفن ثابت"), icon: v("phoneIcon", "Phone"), val: "۰۲۱-۸۸۸۸۸۸۸۸" },
                  { label: v("mobileLabel", "موبایل"), icon: v("mobileIcon", "Smartphone"), val: "۰۹۱۲۳۴۵۶۷۸۹" },
                  { label: v("emailLabel", "ایمیل"), icon: v("emailIcon", "Mail"), val: "info@pishro.com" },
                  { label: v("hoursTitle", "ساعات کاری"), icon: v("hoursIcon", "Clock"), val: "۹ الی ۱۷" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <DynamicIcon name={item.icon} className="size-3.5" />
                      </div>
                      <span className="text-muted-foreground font-medium">{item.label}</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-foreground" dir="ltr">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PAGE PREVIEW: ABOUT US ================= */}
          {pageId === "about" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5">
                  <DynamicIcon name={v("about.stat1Icon", "Award")} className="size-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-foreground">درباره پیشرو</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  مجموعه‌ای متمرکز بر آموزش تخصصی و مدیریت سرمایه با تکیه بر تحلیل‌های فنی و داده‌محور.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <div className="text-xs font-bold text-primary">+۶ سال</div>
                    <div className="text-[10px] text-muted-foreground">سابقه فعالیت</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <div className="text-xs font-bold text-primary">+۲۵۰۰</div>
                    <div className="text-[10px] text-muted-foreground">دانشجو و سرمایه‌گذار</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE PREVIEW: BUSINESS CONSULTING ================= */}
          {pageId === "business" && (
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-bl from-slate-900 to-indigo-950 p-4 text-white space-y-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                  <DynamicIcon name={v("business.heroIcon", "Briefcase")} className="size-4" />
                </div>
                <h3 className="text-sm font-bold">مشاوره تخصصی کسب‌وکار</h3>
                <p className="text-[10px] text-white/70 leading-relaxed">
                  طراحی راهکارهای مالی و استراتژی‌های مدیریت دارایی ویژه شرکت‌ها و سرمایه‌گذاران حقوقی.
                </p>
              </div>
            </div>
          )}

          {/* ================= PAGE PREVIEW: INVESTMENT PLANS ================= */}
          {pageId === "investment" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <DynamicIcon name={v("investment.heroIcon", "TrendingUp")} className="size-4" />
                  <h3 className="text-sm font-bold text-foreground">سبدهای سرمایه‌گذاری</h3>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  طرح‌های اختصاصی با نرخ بازده پیش‌بینی‌شده و سطوح ریسک تفکیک‌شده.
                </p>
              </div>
            </div>
          )}

          {/* ================= PAGE PREVIEW: NEWS & BLOG ================= */}
          {pageId === "news" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <FileText className="size-4" />
                  <h3 className="text-sm font-bold text-foreground">{v("hero.title", "تازه‌ترین مقالات")}</h3>
                </div>
                <p className="text-[10px] text-muted-foreground">{v("hero.description", "تحلیل‌های بازار سرمایه")}</p>
              </div>
            </div>
          )}

          {/* ================= PAGE PREVIEW: LIBRARY ================= */}
          {pageId === "library" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <BookOpen className="size-4" />
                  <h3 className="text-sm font-bold text-foreground">{v("hero.title", "کتابخانه دیجیتال")}</h3>
                </div>
                <p className="text-[10px] text-muted-foreground">{v("hero.subtitle")}</p>
              </div>
            </div>
          )}

          {/* ================= FALLBACK FOR OTHER PAGES ================= */}
          {!["home-v32", "home-sections", "courses", "contact", "about", "business", "investment", "news", "library"].includes(pageId) && (
            <div className="space-y-3 py-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-6" />
              </div>
              <p className="text-xs font-bold text-foreground">پیش‌نمایش فعال برای بخش انتخابی</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                تغییرات فیلدها در ستون چپ به صورت لحظه‌ای در داده‌های صفحه ذخیره و منعکس می‌شوند.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
