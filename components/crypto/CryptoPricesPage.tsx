'use client';

import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpDown,
  BarChart3,
  Bitcoin,
  CandlestickChart,
  Clock3,
  Globe2,
  LayoutGrid,
  Loader2,
  RefreshCw,
  Search,
  Star,
  TrendingUp,
  WalletCards,
  Zap,
} from 'lucide-react';
import type { CryptoGlobalMarket, CryptoMarketAsset, CryptoMarketResponse } from '@/types/crypto-market';
import { useVisibility } from '@/components/site/VisibilityProvider';

interface ApiResponse {
  status: 'success' | 'error';
  data?: CryptoMarketResponse;
  message?: string;
}

const PAGE_SIZE = 20;
const MAX_ASSETS = 150;

const filters = [
  { id: 'all', label: 'همه بازار' },
  { id: 'favorites', label: 'مورد علاقه' },
  { id: 'gainers', label: 'بیشترین رشد' },
  { id: 'losers', label: 'بیشترین افت' },
];

type SortKey = 'rank' | 'name' | 'priceUsd' | 'priceIrt' | 'change24h' | 'change7d' | 'volume24h' | 'marketCap';
type SortDirection = 'asc' | 'desc';

const sortLabels: Record<SortKey, string> = {
  rank: 'رتبه', name: 'نام', priceUsd: 'قیمت جهانی', priceIrt: 'قیمت تومان',
  change24h: 'تغییر ۲۴ ساعت', change7d: 'تغییر ۷ روز', volume24h: 'حجم معاملات', marketCap: 'ارزش بازار',
};

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase('fa');
}

function getAssetSearchText(asset: CryptoMarketAsset) {
  return [asset.id, asset.name, asset.symbol, assetNames[asset.symbol] || ''].join(' ').toLocaleLowerCase('fa');
}

function compareAssets(a: CryptoMarketAsset, b: CryptoMarketAsset, key: SortKey) {
  if (key === 'name') return (assetNames[a.symbol] || a.name).localeCompare(assetNames[b.symbol] || b.name, 'fa');
  if (key === 'priceIrt') return (a.priceIrt ?? -Infinity) - (b.priceIrt ?? -Infinity);
  if (key === 'priceUsd') return a.priceUsd - b.priceUsd;
  if (key === 'change24h') return a.change24h - b.change24h;
  if (key === 'change7d') return a.change7d - b.change7d;
  if (key === 'volume24h') return a.volume24h - b.volume24h;
  if (key === 'marketCap') return a.marketCap - b.marketCap;
  return a.rank - b.rank;
}

function SortButton({ label, active, direction, onClick }: { label: string; active: boolean; direction: SortDirection; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`inline-flex items-center gap-1 text-right transition hover:text-primary ${active ? 'text-primary' : ''}`} aria-label={`مرتب‌سازی بر اساس ${label}`}>{label}{active ? direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}</button>;
}

function assetDisplayName(asset: CryptoMarketAsset) {
  return assetNames[asset.symbol] || asset.name;
}

const assetNames: Record<string, string> = {
  BTC: 'بیت‌کوین', ETH: 'اتریوم', SOL: 'سولانا', USDT: 'تتر', BNB: 'بایننس کوین', XRP: 'ریپل',
};

/*
 * هر ارز رنگ متمایز خودش را دارد تا در فهرست از هم تفکیک شوند. sweep رنگ‌ها
 * این تمایز را از بین برده بود و همه به یک سبز رسیده بودند.
 * از chart-1..5 استفاده شده چون دقیقاً برای تفکیک سری‌ها در پالت تعریف شده‌اند —
 * تنوع برمی‌گردد بدون آنکه رنگ تازه‌ای وارد شود.
 */
const assetTones: Record<string, string> = {
  BTC: 'from-premium to-chart-5', ETH: 'from-chart-4 to-primary',
  SOL: 'from-chart-2 to-chart-4', USDT: 'from-success to-chart-2',
  BNB: 'from-premium to-chart-3', XRP: 'from-chart-3 to-chart-4',
};

const faNumber = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 });
const faMoney = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 });
const faCompact = new Intl.NumberFormat('fa-IR', { notation: 'compact', maximumFractionDigits: 1 });

function formatUsd(value: number) {
  if (value < 10) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

function formatCompactUsd(value: number) {
  return `${faCompact.format(value)} $`;
}

function sparklinePath(values: number[]) {
  if (values.length < 2) return '';
  const sampled = values
    .filter((_, index) => index % Math.max(1, Math.floor(values.length / 28)) === 0)
    .slice(-30);
  if (sampled.length < 2) return '';
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;
  return sampled
    .map((value, index) => {
      const x = (index / Math.max(1, sampled.length - 1)) * 116 + 2;
      const y = 40 - ((value - min) / range) * 34;
      return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const path = sparklinePath(values);
  if (!path) {
    return (
      <span className="inline-flex h-11 w-28 items-center justify-center text-[11px] text-muted-foreground">
        —
      </span>
    );
  }
  const color = positive ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  return (
    <svg viewBox="0 0 120 44" className="h-11 w-28 overflow-visible" role="img" aria-label="نمودار تغییرات قیمت">
      <path d="M2 40 H118" stroke="hsl(var(--border))" strokeOpacity="0.7" strokeWidth="1" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AssetIcon({ asset, large = false }: { asset: CryptoMarketAsset; large?: boolean }) {
  const tone = assetTones[asset.symbol] || 'from-primary to-primary';
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-primary-foreground shadow-lg shadow-primary/20 ${large ? 'h-14 w-14' : 'h-10 w-10'}`}>
      {asset.symbol === 'BTC' ? <Bitcoin className={large ? 'h-7 w-7' : 'h-5 w-5'} /> : <span className={`font-black tracking-tighter ${large ? 'text-lg' : 'text-sm'}`}>{asset.symbol.slice(0, 1)}</span>}
    </span>
  );
}

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="در حال بارگذاری قیمت‌ها">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-2xl bg-card/[0.06]" />
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-3xl border border-border/10 bg-card/[0.05]" />
      ))}
    </section>
  );
}

function mergeAssets(current: CryptoMarketAsset[], incoming: CryptoMarketAsset[]) {
  // Deduplicate by symbol so different provider ids never create double rows.
  const bySymbol = new Map<string, CryptoMarketAsset>();
  for (const asset of current) {
    bySymbol.set(asset.symbol.toUpperCase(), asset);
  }
  for (const asset of incoming) {
    const key = asset.symbol.toUpperCase();
    const existing = bySymbol.get(key);
    if (!existing) {
      bySymbol.set(key, asset);
      continue;
    }
    const sparkline =
      asset.sparkline.length >= existing.sparkline.length
        ? asset.sparkline
        : existing.sparkline;
    bySymbol.set(key, {
      ...existing,
      ...asset,
      id: existing.id || asset.id,
      sparkline,
      imageUrl: asset.imageUrl || existing.imageUrl,
      priceIrt: asset.priceIrt ?? existing.priceIrt,
      priceIrr: asset.priceIrr ?? existing.priceIrr,
    });
  }
  return Array.from(bySymbol.values()).sort(
    (a, b) => a.rank - b.rank || b.marketCap - a.marketCap
  );
}

function marketUrl(page: number, force = false) {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    page: String(page),
  });
  if (force) params.set('refresh', '1');
  return `/api/public/crypto-market?${params}`;
}

export default function CryptoPricesPage({
  admin = false,
  initialData = null,
}: {
  admin?: boolean;
  initialData?: CryptoMarketResponse | null;
}) {
  const { show } = useVisibility();
  const [assets, setAssets] = useState<CryptoMarketAsset[]>(
    () => initialData?.assets ?? []
  );
  const [global, setGlobal] = useState<CryptoGlobalMarket | null>(
    () => initialData?.global ?? null
  );
  const [generatedAt, setGeneratedAt] = useState<string | null>(
    () => initialData?.generatedAt ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(!initialData?.assets?.length);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(
    () => Boolean(initialData?.pagination?.hasMore)
  );
  const [nextPage, setNextPage] = useState(
    () => (initialData?.pagination?.page ?? 0) + 1 || 1
  );
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['bitcoin', 'ethereum']);
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'rank', direction: 'asc' });

  const abortRef = useRef<AbortController | null>(null);
  const loadMoreAbortRef = useRef<AbortController | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(true);
  const nextPageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const initialLoadingRef = useRef(true);
  const assetsRef = useRef<CryptoMarketAsset[]>(initialData?.assets ?? []);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    nextPageRef.current = nextPage;
  }, [nextPage]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    initialLoadingRef.current = initialLoading;
  }, [initialLoading]);

  useEffect(() => {
    assetsRef.current = assets;
  }, [assets]);

  const applyPagePayload = useCallback((payload: CryptoMarketResponse, mode: 'replace' | 'append' | 'soft') => {
    startTransition(() => {
      setGlobal(payload.global);
      setGeneratedAt(payload.generatedAt);
      setError(null);

      if (mode === 'replace') {
        setAssets(payload.assets);
      } else if (mode === 'append') {
        setAssets((current) => mergeAssets(current, payload.assets));
      } else {
        setAssets((current) => (current.length ? mergeAssets(current, payload.assets) : payload.assets));
      }

      const page = payload.pagination?.page ?? 1;
      const more = Boolean(payload.pagination?.hasMore) && page * PAGE_SIZE < MAX_ASSETS;
      setHasMore(more);
      setNextPage(page + 1);
    });
  }, []);

  const fetchPage = useCallback(async (page: number, options?: { force?: boolean; signal?: AbortSignal }) => {
    const response = await fetch(marketUrl(page, options?.force), {
      cache: 'no-store',
      signal: options?.signal,
    });
    const payload = await response.json() as ApiResponse;
    if (!response.ok || payload.status !== 'success' || !payload.data) {
      throw new Error(payload.message || 'خطا در دریافت اطلاعات بازار');
    }
    return payload.data;
  }, []);

  const loadInitial = useCallback(async (force = false) => {
    abortRef.current?.abort();
    loadMoreAbortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (force) setRefreshing(true);
    else setInitialLoading(true);

    try {
      const data = await fetchPage(1, { force, signal: controller.signal });
      if (controller.signal.aborted) return;
      applyPagePayload(data, 'replace');
    } catch (requestError) {
      if (controller.signal.aborted || (requestError instanceof DOMException && requestError.name === 'AbortError')) return;
      setError(requestError instanceof Error ? requestError.message : 'خطا در دریافت اطلاعات بازار');
    } finally {
      if (!controller.signal.aborted) {
        setInitialLoading(false);
        setRefreshing(false);
      }
    }
  }, [applyPagePayload, fetchPage]);

  const loadMore = useCallback(async () => {
    if (initialLoadingRef.current || loadingMoreRef.current || !hasMoreRef.current) return;

    loadMoreAbortRef.current?.abort();
    const controller = new AbortController();
    loadMoreAbortRef.current = controller;
    const page = nextPageRef.current;

    setLoadingMore(true);
    try {
      const data = await fetchPage(page, { signal: controller.signal });
      if (controller.signal.aborted) return;
      applyPagePayload(data, 'append');
    } catch (requestError) {
      if (controller.signal.aborted || (requestError instanceof DOMException && requestError.name === 'AbortError')) return;
      setError(requestError instanceof Error ? requestError.message : 'خطا در دریافت اطلاعات بازار');
    } finally {
      if (!controller.signal.aborted) setLoadingMore(false);
    }
  }, [applyPagePayload, fetchPage]);

  const softRefresh = useCallback(async () => {
    if (initialLoadingRef.current) return;
    const controller = new AbortController();
    // Do not cancel in-flight scroll pages; only tag this as a soft refresh.
    try {
      const data = await fetchPage(1, { signal: controller.signal });
      if (controller.signal.aborted) return;
      applyPagePayload(data, 'soft');
    } catch {
      // Keep showing the last good snapshot during background refresh failures.
    }
  }, [applyPagePayload, fetchPage]);

  useEffect(() => {
    if (initialData?.assets?.length) {
      applyPagePayload(initialData, 'replace');
      setInitialLoading(false);
    } else {
      void loadInitial();
    }

    const softInterval = window.setInterval(() => {
      void softRefresh();
    }, 60_000);

    // If the first paint was empty (sanctions / cold cache), keep retrying briefly.
    const retryInterval = window.setInterval(() => {
      if (!initialLoadingRef.current && assetsRef.current.length === 0) {
        void loadInitial(true);
      }
    }, 15_000);

    return () => {
      window.clearInterval(softInterval);
      window.clearInterval(retryInterval);
      abortRef.current?.abort();
      loadMoreAbortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: '280px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, assets.length, initialLoading]);

  const visibleAssets = useMemo(() => {
    const query = normalizeSearch(search);
    const filtered = assets.filter((asset) => {
      const matchesQuery = !query || getAssetSearchText(asset).includes(query);
      const matchesFilter = activeFilter === 'all' || (activeFilter === 'favorites' && favorites.includes(asset.id)) || (activeFilter === 'gainers' && asset.change24h > 0) || (activeFilter === 'losers' && asset.change24h < 0);
      return matchesQuery && matchesFilter;
    });
    return filtered.sort((a, b) => compareAssets(a, b, sort.key) * (sort.direction === 'asc' ? 1 : -1));
  }, [activeFilter, assets, favorites, search, sort]);

  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleSort = (key: SortKey) => setSort((current) => current.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: key === 'rank' || key === 'name' ? 'asc' : 'desc' });
  const bitcoin = assets.find((asset) => asset.symbol === 'BTC') || assets[0];
  const marketUp = assets.filter((asset) => asset.change24h > 0).length;
  const hasMarket = Boolean(global) && assets.length > 0;
  const showEmptyError = !initialLoading && !hasMarket && Boolean(error);

  return (
    <main className="public-page-shell relative min-h-screen overflow-hidden bg-background text-foreground" dir="rtl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-36 -top-28 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -left-44 top-[38%] h-[34rem] w-[34rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      </div>

      <div className={`relative mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-10 ${admin ? 'pt-5 lg:pt-8' : 'pt-20 md:pt-28'}`}>
        {show('crypto:header') && (
        <div className="mb-7 flex items-center justify-between gap-4 rounded-3xl border border-border/60 bg-card/80 px-4 py-3 shadow-lg shadow-primary/5 backdrop-blur-2xl sm:px-5">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary shadow-lg shadow-primary/25"><CandlestickChart className="h-5 w-5 text-primary-foreground" /></div><div><p className="text-sm font-black tracking-tight text-foreground">پیشرو / بازارها</p><p className="hidden text-[10px] text-muted-foreground sm:block">داده زنده بازار دارایی‌های دیجیتال</p></div></div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><button type="button" onClick={() => void loadInitial(true)} disabled={refreshing || initialLoading} className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 transition hover:scale-105 hover:bg-background disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />به‌روزرسانی</button><span className="hidden items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-foreground sm:flex"><span className={`h-1.5 w-1.5 rounded-full bg-primary ${initialLoading || loadingMore ? 'animate-pulse' : ''}`} />{error && !hasMarket ? 'آخرین داده موجود' : initialLoading ? 'در حال بارگذاری' : 'بازار فعال'}</span></div>
        </div>
        )}

        {showEmptyError ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-10 text-center">
            <p className="text-destructive">{error || 'اطلاعات بازار در دسترس نیست.'}</p>
            <button type="button" onClick={() => void loadInitial(true)} className="mt-5 rounded-xl bg-card px-4 py-2 text-sm font-bold text-foreground">تلاش دوباره</button>
          </div>
        ) : (
          <>
            {error && hasMarket && <div className="mb-5 rounded-2xl border border-premium/20 bg-premium/10 px-4 py-3 text-xs text-premium">به‌روزرسانی جدید ناموفق بود؛ آخرین داده دریافت‌شده نمایش داده می‌شود.</div>}

            {show('crypto:hero') && (
              <section className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
                <div className="relative min-h-[290px] overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-card via-card to-muted/40 p-6 shadow-xl shadow-primary/10 sm:p-9">
                  <div className="relative z-10 max-w-xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary"><Zap className="h-3.5 w-3.5 text-primary" />نبض زنده بازار</div><h1 className="max-w-lg text-3xl font-black leading-[1.35] tracking-tight text-foreground sm:text-5xl">تصمیم‌های بهتر، با یک نگاه به <span className="bg-gradient-to-l from-primary via-primary to-success bg-clip-text text-transparent">بازار</span></h1><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">قیمت جهانی، نمودار هفت‌روزه و ارزش ریالی رمزارزهای مهم را یکجا دنبال کنید.</p></div>
                  <div className="absolute bottom-0 left-0 right-0 h-32 opacity-80 sm:h-40" aria-hidden="true"><svg viewBox="0 0 900 160" preserveAspectRatio="none" className="h-full w-full"><defs><linearGradient id="market-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0" /><stop offset=".4" stopColor="hsl(var(--primary))" /><stop offset="1" stopColor="hsl(var(--success))" /></linearGradient></defs><path d="M0 130 C 85 140, 110 75, 190 91 S 260 150, 337 89 S 439 116, 510 78 S 620 120, 702 55 S 802 83, 900 18" fill="none" stroke="url(#market-line)" strokeWidth="2.5" /></svg></div>
                </div>

                {bitcoin ? (
                  <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/90 p-6 shadow-xl shadow-primary/5 backdrop-blur-2xl sm:p-7"><div className="mb-7 flex items-start justify-between gap-3"><div className="flex items-center gap-3"><AssetIcon asset={bitcoin} large /><div><p className="font-bold text-foreground">بیت‌کوین</p><p className="text-xs text-muted-foreground">BTC / USDT</p></div></div><span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] text-primary">{bitcoin.sources.price}</span></div><p className="mb-1 text-xs text-muted-foreground">قیمت لحظه‌ای</p><div className="flex items-end justify-between gap-3"><p dir="ltr" className="text-3xl font-black tracking-tight text-foreground">{formatUsd(bitcoin.priceUsd)}</p><span dir="ltr" className={`mb-1 flex items-center gap-1 text-sm font-bold ${bitcoin.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>{bitcoin.change24h >= 0 ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}{bitcoin.change24h >= 0 ? '+' : ''}{faNumber.format(bitcoin.change24h)}%</span></div><p className="mt-3 text-xs text-muted-foreground">{bitcoin.priceIrt ? `${faMoney.format(bitcoin.priceIrt)} تومان` : 'قیمت تومانی در دسترس نیست'}</p><div className="mt-5 flex items-end justify-between border-t border-border/50 pt-4"><div className="text-xs text-muted-foreground"><p>ارزش بازار</p><strong className="mt-1 block text-sm text-foreground">{formatCompactUsd(bitcoin.marketCap)}</strong></div><Sparkline values={bitcoin.sparkline} positive={bitcoin.change24h >= 0} /></div></div>
                ) : (
                  <div className="min-h-[290px] animate-pulse rounded-[2rem] border border-border/60 bg-card/70" aria-busy="true" />
                )}
              </section>
            )}

            {show('crypto:stats') && (
              initialLoading && !global ? (
                <StatsSkeleton />
              ) : global ? (
                <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: 'ارزش کل بازار', value: formatCompactUsd(global.marketCap), note: `${global.marketCapChange24h >= 0 ? '+' : ''}${faNumber.format(global.marketCapChange24h)}٪ امروز`, icon: Globe2 },
                    { label: 'حجم معاملات ۲۴ ساعت', value: formatCompactUsd(global.volume24h), note: `${faNumber.format(global.activeCryptocurrencies || 0)} ارز فعال`, icon: BarChart3 },
                    { label: 'دامیننس بیت‌کوین', value: `${faNumber.format(global.btcDominance)}٪`, note: global.source, icon: Bitcoin },
                    { label: 'ارزهای صعودی', value: `${faNumber.format(marketUp)} از ${faNumber.format(assets.length)}`, note: 'در فهرست بارگذاری‌شده', icon: TrendingUp },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="rounded-3xl border border-border/60 bg-card/90 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="mb-4 flex items-center justify-between"><span className="rounded-xl bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></span><span className="text-[10px] font-medium text-muted-foreground">زنده</span></div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p dir="ltr" className="mt-1 text-lg font-bold text-foreground">{stat.value}</p>
                        <p className="mt-2 text-[11px] font-semibold text-primary">{stat.note}</p>
                      </div>
                    );
                  })}
                </section>
              ) : null
            )}

            {show('crypto:table') && (
              <section className="rounded-[2rem] border border-border/60 bg-card/90 p-4 shadow-xl shadow-primary/5 backdrop-blur-2xl sm:p-6">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-gradient-to-br from-primary to-success p-2.5 text-primary-foreground"><LayoutGrid className="h-5 w-5" /></div>
                    <div>
                      <h2 className="text-lg font-black text-foreground">۱۵۰ ارز برتر بازار</h2>
                      <p className="mt-1 text-xs text-muted-foreground">با اسکرول، دسته‌های بعدی بارگذاری می‌شوند</p>
                    </div>
                  </div>
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجوی هر ارز، نام یا نماد" className="h-10 w-full rounded-2xl border border-border/60 bg-background pr-10 pl-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50" />
                  </div>
                </div>

                <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {filters.map((filter) => (
                    <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-transform duration-300 hover:scale-105 ${activeFilter === filter.id ? 'bg-primary text-primary-foreground' : 'border border-border/60 bg-background/70 text-muted-foreground hover:text-foreground'}`}>{filter.label}</button>
                  ))}
                  <span className="mr-auto whitespace-nowrap text-[11px] text-muted-foreground">{faNumber.format(visibleAssets.length)} نتیجه · مرتب‌سازی: {sortLabels[sort.key]}</span>
                </div>

                {initialLoading && assets.length === 0 ? (
                  <TableSkeleton rows={10} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] border-separate border-spacing-y-2 text-right">
                      <thead>
                        <tr className="text-[11px] text-muted-foreground">
                          <th className="px-4 pb-2 font-medium"><SortButton label="دارایی" active={sort.key === 'name' || sort.key === 'rank'} direction={sort.direction} onClick={() => toggleSort(sort.key === 'name' ? 'rank' : 'name')} /></th>
                          <th className="px-4 pb-2 font-medium"><SortButton label="قیمت جهانی" active={sort.key === 'priceUsd'} direction={sort.direction} onClick={() => toggleSort('priceUsd')} /></th>
                          <th className="px-4 pb-2 font-medium"><SortButton label="قیمت تومان" active={sort.key === 'priceIrt'} direction={sort.direction} onClick={() => toggleSort('priceIrt')} /></th>
                          <th className="px-4 pb-2 font-medium"><SortButton label="تغییر ۲۴ ساعت" active={sort.key === 'change24h'} direction={sort.direction} onClick={() => toggleSort('change24h')} /></th>
                          <th className="px-4 pb-2 font-medium"><SortButton label="تغییر ۷ روز" active={sort.key === 'change7d'} direction={sort.direction} onClick={() => toggleSort('change7d')} /></th>
                          <th className="px-4 pb-2 font-medium">نمودار ۷ روز</th>
                          <th className="px-4 pb-2 font-medium"><SortButton label="حجم معاملات" active={sort.key === 'volume24h'} direction={sort.direction} onClick={() => toggleSort('volume24h')} /></th>
                          <th className="px-4 pb-2 font-medium"><SortButton label="ارزش بازار" active={sort.key === 'marketCap'} direction={sort.direction} onClick={() => toggleSort('marketCap')} /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleAssets.map((asset) => {
                          const positive = asset.change24h >= 0;
                          const favorite = favorites.includes(asset.id);
                          return (
                            <motion.tr
                              key={asset.id}
                              layout
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="group bg-muted/40 text-sm transition hover:bg-muted/70"
                            >
                              <td className="rounded-r-2xl px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <button type="button" onClick={(event) => { event.preventDefault(); toggleFavorite(asset.id); }} className="text-muted-foreground hover:text-premium" aria-label={favorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}>
                                    <Star className={`h-4 w-4 ${favorite ? 'fill-premium text-premium' : ''}`} />
                                  </button>
                                  <Link href={`/crypto-prices/${encodeURIComponent(asset.id)}`} className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                    <AssetIcon asset={asset} />
                                    <div>
                                      <p className="font-bold text-foreground transition group-hover:text-primary">{assetDisplayName(asset)}</p>
                                      <p dir="ltr" className="mt-0.5 text-[11px] text-muted-foreground">{asset.symbol} · #{asset.rank}</p>
                                    </div>
                                  </Link>
                                </div>
                              </td>
                              <td dir="ltr" className="px-4 py-3 font-bold text-foreground">{formatUsd(asset.priceUsd)}<span className="mt-1 block text-[9px] font-normal text-muted-foreground">{asset.sources.price}</span></td>
                              <td className="px-4 py-3 font-bold text-foreground">{asset.priceIrt ? faMoney.format(asset.priceIrt) : '—'}<span className="mt-1 block text-[9px] font-normal text-muted-foreground">{asset.priceIrt ? 'تومان' : 'نوبیتکس'}</span></td>
                              <td dir="ltr" className={`px-4 py-3 font-semibold ${positive ? 'text-success' : 'text-destructive'}`}>{positive ? '+' : ''}{faNumber.format(asset.change24h)}%</td>
                              <td dir="ltr" className={`px-4 py-3 font-semibold ${asset.change7d >= 0 ? 'text-success' : 'text-destructive'}`}>{asset.change7d >= 0 ? '+' : ''}{faNumber.format(asset.change7d)}%</td>
                              <td className="px-4 py-3"><Sparkline values={asset.sparkline} positive={asset.change7d >= 0} /></td>
                              <td className="px-4 py-3 text-xs text-muted-foreground">{formatCompactUsd(asset.volume24h)}</td>
                              <td className="rounded-l-2xl px-4 py-3 text-xs text-muted-foreground"><Link href={`/crypto-prices/${encodeURIComponent(asset.id)}`} className="transition hover:text-primary">{formatCompactUsd(asset.marketCap)}</Link></td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {visibleAssets.length === 0 && !initialLoading && (
                      <div className="rounded-2xl border border-dashed border-border/10 py-12 text-center text-sm text-muted-foreground">
                        ارزی با این نام یا نماد در داده‌های بارگذاری‌شده پیدا نشد.
                      </div>
                    )}
                  </div>
                )}

                <div ref={sentinelRef} className="mt-4 flex min-h-10 items-center justify-center">
                  {loadingMore ? (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      در حال دریافت دسته بعدی...
                    </p>
                  ) : hasMore && assets.length > 0 ? (
                    <p className="text-[11px] text-muted-foreground">برای دیدن ارزهای بیشتر اسکرول کنید</p>
                  ) : assets.length > 0 ? (
                    <p className="text-[11px] text-muted-foreground">همه داده‌های بارگذاری‌شده نمایش داده شد</p>
                  ) : null}
                </div>
              </section>
            )}

            <div className="mt-5 flex flex-col items-center justify-between gap-3 text-[11px] text-muted-foreground sm:flex-row">
              <p className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                آخرین به‌روزرسانی: {generatedAt ? new Date(generatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '—'}
              </p>
              <p className="flex items-center gap-1.5"><WalletCards className="h-3.5 w-3.5" />این صفحه توصیه سرمایه‌گذاری نیست.</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
