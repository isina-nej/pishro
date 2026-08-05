"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Bitcoin,
  BookOpen,
  CheckCircle2,
  Contact,
  FileText,
  GraduationCap,
  Handshake,
  Keyboard,
  LayoutDashboard,
  LayoutTemplate,
  MessageSquareQuote,
  Palette,
  PieChart,
  Rocket,
  Search,
  Shield,
  Ticket,
  TrendingUp,
  UsersRound,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ADMIN_GUIDE_CATEGORIES,
  type GuideArticle,
  type GuideCategory,
  type GuideRole,
} from "@/lib/admin/guide-content";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/lib/hooks/useAdminAuth";

const ICON_MAP = {
  rocket: Rocket,
  layoutDashboard: LayoutDashboard,
  users: UsersRound,
  contact: Contact,
  handshake: Handshake,
  ticket: Ticket,
  pieChart: PieChart,
  fileText: FileText,
  bookOpen: BookOpen,
  graduationCap: GraduationCap,
  trendingUp: TrendingUp,
  bitcoin: Bitcoin,
  layoutTemplate: LayoutTemplate,
  messageSquareQuote: MessageSquareQuote,
  barChart: BarChart3,
  scrollText: FileText,
  palette: Palette,
  shield: Shield,
  keyboard: Keyboard,
} as const;

const ROLE_LABEL: Record<Exclude<GuideRole, "ALL">, string> = {
  ADMIN: "مدیر",
  MODERATOR: "اپراتور",
  VIEWER: "بازدیدکننده",
};

function roleBadges(roles: GuideRole[]) {
  if (roles.includes("ALL")) {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-[11px] text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
      >
        همه نقش‌ها
      </Badge>
    );
  }
  return roles.map((role) => (
    <Badge
      key={role}
      variant="outline"
      className="border-slate-200 bg-slate-50 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      {ROLE_LABEL[role as Exclude<GuideRole, "ALL">] ?? role}
    </Badge>
  ));
}

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");
}

function articleMatchesQuery(article: GuideArticle, query: string) {
  if (!query) return true;
  const haystack = normalizeSearch(
    [
      article.title,
      article.summary,
      ...article.steps.map((s) => `${s.title} ${s.detail}`),
      ...(article.tips ?? []),
      ...(article.warnings ?? []),
    ].join(" ")
  );
  return haystack.includes(query);
}

function categoryMatchesQuery(category: GuideCategory, query: string) {
  if (!query) return true;
  return normalizeSearch(`${category.title} ${category.description}`).includes(
    query
  );
}

function CategoryIcon({
  icon,
  className,
}: {
  icon: GuideCategory["icon"];
  className?: string;
}) {
  const Icon = ICON_MAP[icon] ?? BookOpen;
  return <Icon className={className} />;
}

function GuideArticleCard({
  article,
  open,
  onToggle,
}: {
  article: GuideArticle;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-slate-200/80 transition-all duration-300 dark:border-slate-800",
        open && "border-primary/30 shadow-md shadow-primary/5"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-right sm:p-5"
        aria-expanded={open}
      >
        <div
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
            open
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          <CheckCircle2 className="size-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-950 dark:text-white">
              {article.title}
            </h3>
            {roleBadges(article.roles)}
          </div>
          <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
            {article.summary}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 size-5 shrink-0 text-slate-400 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-slate-100 px-4 pb-5 pt-4 dark:border-slate-800 sm:px-5">
            <ol className="space-y-3">
              {article.steps.map((step, index) => (
                <li
                  key={`${article.id}-${index}`}
                  className="flex gap-3 rounded-xl bg-slate-50/80 p-3 dark:bg-slate-900/60"
                  style={{
                    animation: open
                      ? `guide-fade-up 320ms ease ${index * 40}ms both`
                      : undefined,
                  }}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[12px] font-bold text-primary-foreground">
                    {(index + 1).toLocaleString("fa-IR")}
                  </span>
                  <div className="space-y-1 text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </p>
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {article.tips && article.tips.length > 0 && (
              <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                <div className="mb-2 flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Lightbulb className="size-4" />
                  <span className="text-sm font-semibold">نکته</span>
                </div>
                <ul className="space-y-1.5 text-sm leading-7 text-amber-900/90 dark:text-amber-100/90">
                  {article.tips.map((tip) => (
                    <li key={tip}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {article.warnings && article.warnings.length > 0 && (
              <div className="rounded-xl border border-rose-200/70 bg-rose-50/70 p-3 dark:border-rose-900/50 dark:bg-rose-950/20">
                <div className="mb-2 flex items-center gap-2 text-rose-800 dark:text-rose-200">
                  <AlertTriangle className="size-4" />
                  <span className="text-sm font-semibold">توجه</span>
                </div>
                <ul className="space-y-1.5 text-sm leading-7 text-rose-900/90 dark:text-rose-100/90">
                  {article.warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {article.href && (
              <div className="flex justify-start">
                <Button asChild size="sm" className="gap-1.5">
                  <Link href={article.href}>
                    رفتن به این بخش
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function AdminGuidePage({ user }: { user: AdminUser }) {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(
    ADMIN_GUIDE_CATEGORIES[0]?.id ?? ""
  );
  const [openArticles, setOpenArticles] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();

  const filteredCategories = useMemo(() => {
    const normalized = normalizeSearch(query);
    return ADMIN_GUIDE_CATEGORIES.map((category) => {
      const categoryHit = categoryMatchesQuery(category, normalized);
      return {
        ...category,
        articles: category.articles.filter(
          (article) =>
            categoryHit || articleMatchesQuery(article, normalized)
        ),
      };
    }).filter((category) => category.articles.length > 0);
  }, [query]);

  const totalArticles = useMemo(
    () =>
      ADMIN_GUIDE_CATEGORIES.reduce(
        (sum, category) => sum + category.articles.length,
        0
      ),
    []
  );

  useEffect(() => {
    if (
      filteredCategories.length > 0 &&
      !filteredCategories.some((c) => c.id === activeCategoryId)
    ) {
      setActiveCategoryId(filteredCategories[0].id);
    }
  }, [filteredCategories, activeCategoryId]);

  useEffect(() => {
    const styleId = "admin-guide-keyframes";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes guide-fade-up {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes guide-soft-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  function selectCategory(id: string) {
    startTransition(() => {
      setActiveCategoryId(id);
    });
    const el = document.getElementById(`guide-cat-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleArticle(id: string) {
    setOpenArticles((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <AdminPageShell
      title="آموزش پنل ادمین"
      description="راهنمای کامل و دسته‌بندی‌شده برای کار با تمام بخش‌های پنل؛ از CRM تا محتوا، CMS و ظاهر سایت."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {ADMIN_GUIDE_CATEGORIES.length.toLocaleString("fa-IR")} دسته
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {totalArticles.toLocaleString("fa-IR")} موضوع
          </Badge>
          <Badge variant="outline" className="text-xs">
            نقش شما: {ROLE_LABEL[user.role] ?? user.role}
          </Badge>
        </div>
      }
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-l from-primary/10 via-background to-emerald-50/40 p-5 dark:from-primary/15 dark:via-slate-950 dark:to-slate-900 sm:p-6">
        <div
          className="pointer-events-none absolute -left-10 top-0 size-40 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="relative grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="space-y-3 text-right">
            <p className="text-xs font-semibold tracking-wide text-primary">
              مرکز آموزش عملیات
            </p>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
              هر بخش پنل را قدم‌به‌قدم یاد بگیرید
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              دسته‌ها را از ستون کناری انتخاب کنید، موضوع را باز کنید و با دکمه
              «رفتن به این بخش» مستقیماً وارد همان صفحه شوید. جستجو روی عنوان،
              مراحل و نکات کار می‌کند.
            </p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در آموزش‌ها؛ مثلاً تیکت، دوره، پالت..."
              className="h-11 rounded-xl border-slate-200 bg-white/80 pr-10 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <Card className="p-3">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              دسته‌بندی‌ها
            </p>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:max-h-[calc(100vh-12rem)] lg:space-y-1 lg:overflow-y-auto lg:pb-0">
              {ADMIN_GUIDE_CATEGORIES.map((category) => {
                const active = activeCategoryId === category.id;
                const matchCount =
                  filteredCategories.find((c) => c.id === category.id)?.articles
                    .length ?? 0;
                const disabled = query.trim() !== "" && matchCount === 0;
                return (
                  <button
                    key={category.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectCategory(category.id)}
                    className={cn(
                      "flex min-w-[10.5rem] items-center gap-2 rounded-xl px-3 py-2.5 text-right text-sm transition-all lg:min-w-0 lg:w-full",
                      active
                        ? "bg-navActiveBg text-primary shadow-sm"
                        : "text-slate-600 hover:bg-muted dark:text-slate-300",
                      disabled && "pointer-events-none opacity-40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        active
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <CategoryIcon icon={category.icon} className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {category.title}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {category.articles.length.toLocaleString("fa-IR")} موضوع
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </aside>

        <div className="space-y-6">
          {filteredCategories.length === 0 ? (
            <Card className="flex min-h-48 flex-col items-center justify-center gap-2 p-8 text-center">
              <Search className="size-8 text-slate-300" />
              <p className="font-semibold text-slate-900 dark:text-white">
                نتیجه‌ای پیدا نشد
              </p>
              <p className="text-sm text-muted-foreground">
                عبارت دیگری امتحان کنید یا دسته‌ها را بدون فیلتر مرور کنید.
              </p>
              <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                پاک کردن جستجو
              </Button>
            </Card>
          ) : (
            filteredCategories.map((category, categoryIndex) => (
              <section
                key={category.id}
                id={`guide-cat-${category.id}`}
                className="scroll-mt-4 space-y-3"
                style={{
                  animation: `guide-soft-in 420ms ease ${categoryIndex * 40}ms both`,
                }}
              >
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CategoryIcon icon={category.icon} className="size-5" />
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                      {category.title}
                    </h2>
                    <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.articles.map((article) => (
                    <GuideArticleCard
                      key={article.id}
                      article={article}
                      open={Boolean(openArticles[article.id])}
                      onToggle={() => toggleArticle(article.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
