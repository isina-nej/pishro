'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
import type { CryptoMarketAsset, CryptoMarketResponse } from '@/types/crypto-market';

interface ApiResponse {
  status: 'success' | 'error';
  data?: CryptoMarketResponse;
  message?: string;
}

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

const assetTones: Record<string, string> = {
  BTC: 'from-premium to-premium', ETH: 'from-primary to-accent',
  SOL: 'from-primary to-accent', USDT: 'from-primary to-primary',
  BNB: 'from-premium to-premium', XRP: 'from-muted to-primary',
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
  const source = values.length > 1 ? values : [0, 1];
  const sampled = source.filter((_, index) => index % Math.max(1, Math.floor(source.length / 28)) === 0).slice(-30);
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;
  return sampled.map((value, index) => {
    const x = (index / Math.max(1, sampled.length - 1)) * 116 + 2;
    const y = 40 - ((value - min) / range) * 34;
    return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const color = positive ? '#56e39f' : '#ff718b';
  return (
    <svg viewBox="0 0 120 44" className="h-11 w-28 overflow-visible" role="img" aria-label="نمودار تغییرات قیمت">
      <path d="M2 40 H118" stroke="rgba(255,255,255,.11)" strokeWidth="1" />
      <path d={sparklinePath(values)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AssetIcon({ asset, large = false }: { asset: CryptoMarketAsset; large?: boolean }) {
  const tone = assetTones[asset.symbol] || 'from-primary to-primary';
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-foreground shadow-lg shadow-indigo-500/15 ${large ? 'h-14 w-14' : 'h-10 w-10'}`}>
      {asset.symbol === 'BTC' ? <Bitcoin className={large ? 'h-7 w-7' : 'h-5 w-5'} /> : <span className={`font-black tracking-tighter ${large ? 'text-lg' : 'text-sm'}`}>{asset.symbol.slice(0, 1)}</span>}
    </span>
  );
}

function LoadingState() {
  return <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="text-sm">در حال دریافت داده‌های بازار...</p></div>;
}

export default function CryptoPricesPage({ admin = false }: { admin?: boolean }) {
  const [market, setMarket] = useState<CryptoMarketResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['bitcoin', 'ethereum']);
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'rank', direction: 'asc' });

  const loadMarket = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await fetch(`/api/public/crypto-market${force ? '?refresh=1' : ''}`, { cache: 'no-store' });
      const payload = await response.json() as ApiResponse;
      if (!response.ok || payload.status !== 'success' || !payload.data) throw new Error(payload.message || 'خطا در دریافت اطلاعات بازار');
      setMarket(payload.data);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'خطا در دریافت اطلاعات بازار');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMarket();
    const interval = window.setInterval(() => loadMarket(), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const visibleAssets = useMemo(() => {
    const assets = market?.assets || [];
    const query = normalizeSearch(search);
    const filtered = assets.filter((asset) => {
      const matchesQuery = !query || getAssetSearchText(asset).includes(query);
      const matchesFilter = activeFilter === 'all' || (activeFilter === 'favorites' && favorites.includes(asset.id)) || (activeFilter === 'gainers' && asset.change24h > 0) || (activeFilter === 'losers' && asset.change24h < 0);
      return matchesQuery && matchesFilter;
    });
    return filtered.sort((a, b) => compareAssets(a, b, sort.key) * (sort.direction === 'asc' ? 1 : -1));
  }, [activeFilter, favorites, market, search, sort]);

  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleSort = (key: SortKey) => setSort((current) => current.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: key === 'rank' || key === 'name' ? 'asc' : 'desc' });
  const assets = market?.assets || [];
  const bitcoin = assets.find((asset) => asset.symbol === 'BTC') || assets[0];
  const marketUp = assets.filter((asset) => asset.change24h > 0).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-primary-foreground" dir="rtl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-36 -top-28 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -left-44 top-[38%] h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      </div>

      <div className={`relative mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-10 ${admin ? 'pt-5 lg:pt-8' : 'pt-20 md:pt-28'}`}>
        <div className="mb-7 flex items-center justify-between gap-4 rounded-3xl border border-border/10 bg-card/[0.055] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-5">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary shadow-lg shadow-cyan-500/20"><CandlestickChart className="h-5 w-5 text-foreground" /></div><div><p className="text-sm font-black tracking-tight text-primary-foreground">پیشرو / بازارها</p><p className="hidden text-[10px] text-muted-foreground sm:block">داده زنده بازار دارایی‌های دیجیتال</p></div></div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><button type="button" onClick={() => loadMarket(true)} disabled={refreshing} className="flex items-center gap-1.5 rounded-full border border-border/10 bg-card/[0.06] px-3 py-1.5 transition hover:bg-card/10 disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />به‌روزرسانی</button><span className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 sm:flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{error ? 'آخرین داده موجود' : 'بازار فعال'}</span></div>
        </div>

        {loading && !market ? <LoadingState /> : !market ? <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-10 text-center"><p className="text-destructive">{error || 'اطلاعات بازار در دسترس نیست.'}</p><button type="button" onClick={() => loadMarket(true)} className="mt-5 rounded-xl bg-card px-4 py-2 text-sm font-bold text-foreground">تلاش دوباره</button></div> : <>
          {error && <div className="mb-5 rounded-2xl border border-premium/20 bg-premium/10 px-4 py-3 text-xs text-premium">به‌روزرسانی جدید ناموفق بود؛ آخرین داده دریافت‌شده نمایش داده می‌شود.</div>}
          <section className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            <div className="relative min-h-[290px] overflow-hidden rounded-[2rem] border border-border/10 bg-gradient-to-br from-[#12253b]/95 via-[#10223a]/80 to-[#10152d]/90 p-6 shadow-2xl shadow-cyan-950/25 sm:p-9">
              <div className="relative z-10 max-w-xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary"><Zap className="h-3.5 w-3.5 text-primary" />نبض زنده بازار</div><h1 className="max-w-lg text-3xl font-black leading-[1.35] tracking-tight text-primary-foreground sm:text-5xl">تصمیم‌های بهتر، با یک نگاه به <span className="bg-gradient-to-l from-primary via-primary to-success bg-clip-text text-transparent">بازار</span></h1><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">قیمت جهانی، نمودار هفت‌روزه و ارزش ریالی رمزارزهای مهم را یکجا دنبال کنید.</p></div>
              <div className="absolute bottom-0 left-0 right-0 h-32 opacity-70 sm:h-40" aria-hidden="true"><svg viewBox="0 0 900 160" preserveAspectRatio="none" className="h-full w-full"><defs><linearGradient id="market-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#38d8ff" stopOpacity="0" /><stop offset=".35" stopColor="#38d8ff" /><stop offset="1" stopColor="#8f8cff" /></linearGradient></defs><path d="M0 130 C 85 140, 110 75, 190 91 S 260 150, 337 89 S 439 116, 510 78 S 620 120, 702 55 S 802 83, 900 18" fill="none" stroke="url(#market-line)" strokeWidth="2.5" /></svg></div>
            </div>

            {bitcoin && <div className="relative overflow-hidden rounded-[2rem] border border-border/10 bg-card/[0.065] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7"><div className="mb-7 flex items-start justify-between gap-3"><div className="flex items-center gap-3"><AssetIcon asset={bitcoin} large /><div><p className="font-bold">بیت‌کوین</p><p className="text-xs text-muted-foreground">BTC / USDT</p></div></div><span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] text-primary">{bitcoin.sources.price}</span></div><p className="mb-1 text-xs text-muted-foreground">قیمت لحظه‌ای</p><div className="flex items-end justify-between gap-3"><p dir="ltr" className="text-3xl font-black tracking-tight">{formatUsd(bitcoin.priceUsd)}</p><span dir="ltr" className={`mb-1 flex items-center gap-1 text-sm font-bold ${bitcoin.change24h >= 0 ? 'text-primary' : 'text-destructive'}`}>{bitcoin.change24h >= 0 ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}{bitcoin.change24h >= 0 ? '+' : ''}{faNumber.format(bitcoin.change24h)}%</span></div><p className="mt-3 text-xs text-muted-foreground">{bitcoin.priceIrt ? `${faMoney.format(bitcoin.priceIrt)} تومان` : 'قیمت تومانی در دسترس نیست'}</p><div className="mt-5 flex items-end justify-between border-t border-border/10 pt-4"><div className="text-xs text-muted-foreground"><p>ارزش بازار</p><strong className="mt-1 block text-sm text-muted-foreground">{formatCompactUsd(bitcoin.marketCap)}</strong></div><Sparkline values={bitcoin.sparkline} positive={bitcoin.change24h >= 0} /></div></div>}
          </section>

          <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[{ label: 'ارزش کل بازار', value: formatCompactUsd(market.global.marketCap), note: `${market.global.marketCapChange24h >= 0 ? '+' : ''}${faNumber.format(market.global.marketCapChange24h)}٪ امروز`, icon: Globe2 }, { label: 'حجم معاملات ۲۴ ساعت', value: formatCompactUsd(market.global.volume24h), note: `${faNumber.format(market.global.activeCryptocurrencies || 0)} ارز فعال`, icon: BarChart3 }, { label: 'دامیننس بیت‌کوین', value: `${faNumber.format(market.global.btcDominance)}٪`, note: market.global.source, icon: Bitcoin }, { label: 'ارزهای صعودی', value: `${faNumber.format(marketUp)} از ${faNumber.format(assets.length)}`, note: 'در فهرست منتخب', icon: TrendingUp }].map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="rounded-3xl border border-border/10 bg-card/[0.05] p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-card/[0.08]"><div className="mb-4 flex items-center justify-between"><span className="rounded-xl bg-card/[0.08] p-2 text-primary"><Icon className="h-4 w-4" /></span><span className="text-[10px] text-muted-foreground">زنده</span></div><p className="text-xs text-muted-foreground">{stat.label}</p><p dir="ltr" className="mt-1 text-lg font-bold text-primary-foreground">{stat.value}</p><p className="mt-2 text-[11px] font-semibold text-primary">{stat.note}</p></div>; })}
          </section>

          <section className="rounded-[2rem] border border-border/10 bg-card/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><div className="rounded-2xl bg-gradient-to-br from-accent to-primary p-2.5 text-foreground"><LayoutGrid className="h-5 w-5" /></div><div><h2 className="text-lg font-black">۱۵۰ ارز برتر بازار</h2><p className="mt-1 text-xs text-muted-foreground">جستجو در نام و نماد؛ برای تحلیل روی هر ارز بزنید</p></div></div><div className="relative w-full max-w-xs"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجوی هر ارز، نام یا نماد" className="h-10 w-full rounded-2xl border border-border/10 bg-background/15 pr-10 pl-3 text-sm text-primary-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50" /></div></div>
            <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">{filters.map((filter) => <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${activeFilter === filter.id ? 'bg-card text-foreground' : 'border border-border/10 bg-card/[0.04] text-muted-foreground hover:text-primary-foreground'}`}>{filter.label}</button>)}<span className="mr-auto whitespace-nowrap text-[11px] text-muted-foreground">{faNumber.format(visibleAssets.length)} نتیجه · مرتب‌سازی: {sortLabels[sort.key]}</span></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[1040px] border-separate border-spacing-y-2 text-right"><thead><tr className="text-[11px] text-muted-foreground"><th className="px-4 pb-2 font-medium"><SortButton label="دارایی" active={sort.key === 'name' || sort.key === 'rank'} direction={sort.direction} onClick={() => toggleSort(sort.key === 'name' ? 'rank' : 'name')} /></th><th className="px-4 pb-2 font-medium"><SortButton label="قیمت جهانی" active={sort.key === 'priceUsd'} direction={sort.direction} onClick={() => toggleSort('priceUsd')} /></th><th className="px-4 pb-2 font-medium"><SortButton label="قیمت تومان" active={sort.key === 'priceIrt'} direction={sort.direction} onClick={() => toggleSort('priceIrt')} /></th><th className="px-4 pb-2 font-medium"><SortButton label="تغییر ۲۴ ساعت" active={sort.key === 'change24h'} direction={sort.direction} onClick={() => toggleSort('change24h')} /></th><th className="px-4 pb-2 font-medium"><SortButton label="تغییر ۷ روز" active={sort.key === 'change7d'} direction={sort.direction} onClick={() => toggleSort('change7d')} /></th><th className="px-4 pb-2 font-medium">نمودار ۷ روز</th><th className="px-4 pb-2 font-medium"><SortButton label="حجم معاملات" active={sort.key === 'volume24h'} direction={sort.direction} onClick={() => toggleSort('volume24h')} /></th><th className="px-4 pb-2 font-medium"><SortButton label="ارزش بازار" active={sort.key === 'marketCap'} direction={sort.direction} onClick={() => toggleSort('marketCap')} /></th></tr></thead><tbody>{visibleAssets.map((asset) => { const positive = asset.change24h >= 0; const favorite = favorites.includes(asset.id); return <tr key={asset.id} className="group bg-card/[0.035] text-sm transition hover:bg-card/[0.09]"><td className="rounded-r-2xl px-4 py-3"><div className="flex items-center gap-3"><button type="button" onClick={(event) => { event.preventDefault(); toggleFavorite(asset.id); }} className="text-muted-foreground hover:text-premium" aria-label={favorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}><Star className={`h-4 w-4 ${favorite ? 'fill-amber-300 text-premium' : ''}`} /></button><Link href={`/crypto-prices/${encodeURIComponent(asset.id)}`} className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><AssetIcon asset={asset} /><div><p className="font-bold text-primary-foreground transition group-hover:text-primary">{assetDisplayName(asset)}</p><p dir="ltr" className="mt-0.5 text-[11px] text-muted-foreground">{asset.symbol} · #{asset.rank}</p></div></Link></div></td><td dir="ltr" className="px-4 py-3 font-bold text-primary-foreground">{formatUsd(asset.priceUsd)}<span className="mt-1 block text-[9px] font-normal text-muted-foreground">{asset.sources.price}</span></td><td className="px-4 py-3 font-bold text-muted-foreground">{asset.priceIrt ? faMoney.format(asset.priceIrt) : '—'}<span className="mt-1 block text-[9px] font-normal text-muted-foreground">{asset.priceIrt ? 'تومان' : 'نوبیتکس'}</span></td><td dir="ltr" className={`px-4 py-3 font-semibold ${positive ? 'text-primary' : 'text-destructive'}`}>{positive ? '+' : ''}{faNumber.format(asset.change24h)}%</td><td dir="ltr" className={`px-4 py-3 font-semibold ${asset.change7d >= 0 ? 'text-primary' : 'text-destructive'}`}>{asset.change7d >= 0 ? '+' : ''}{faNumber.format(asset.change7d)}%</td><td className="px-4 py-3"><Sparkline values={asset.sparkline} positive={asset.change7d >= 0} /></td><td className="px-4 py-3 text-xs text-muted-foreground">{formatCompactUsd(asset.volume24h)}</td><td className="rounded-l-2xl px-4 py-3 text-xs text-muted-foreground"><Link href={`/crypto-prices/${encodeURIComponent(asset.id)}`} className="transition hover:text-primary">{formatCompactUsd(asset.marketCap)}</Link></td></tr>; })}</tbody></table>{visibleAssets.length === 0 && <div className="rounded-2xl border border-dashed border-border/10 py-12 text-center text-sm text-muted-foreground">ارزی با این نام یا نماد در ۱۵۰ ارز برتر پیدا نشد.</div>}</div>
          </section>

          <div className="mt-5 flex flex-col items-center justify-between gap-3 text-[11px] text-muted-foreground sm:flex-row"><p className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />آخرین به‌روزرسانی: {new Date(market.generatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</p><p className="flex items-center gap-1.5"><WalletCards className="h-3.5 w-3.5" />این صفحه توصیه سرمایه‌گذاری نیست.</p></div>
        </>}
      </div>
    </main>
  );
}
