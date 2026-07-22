'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpLeft,
  BarChart3,
  Bitcoin,
  CandlestickChart,
  ChevronDown,
  Clock3,
  Globe2,
  LayoutGrid,
  Search,
  Star,
  TrendingUp,
  WalletCards,
  Zap,
} from 'lucide-react';

interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  tone: string;
  chart: string;
}

const assets: CryptoAsset[] = [
  {
    id: 'bitcoin',
    name: 'بیت‌کوین',
    symbol: 'BTC',
    price: 104832.61,
    change: 2.84,
    volume: '۳۲.۴ میلیارد',
    marketCap: '۲.۰۵ تریلیون',
    tone: 'from-orange-400 to-amber-600',
    chart: 'M2 35 C 15 29, 18 16, 31 22 S 47 29, 57 17 S 75 9, 86 15 S 105 14, 118 4',
  },
  {
    id: 'ethereum',
    name: 'اتریوم',
    symbol: 'ETH',
    price: 3421.18,
    change: 1.62,
    volume: '۱۸.۷ میلیارد',
    marketCap: '۴۱۲ میلیارد',
    tone: 'from-indigo-300 to-violet-500',
    chart: 'M2 32 C 15 40, 20 14, 34 22 S 51 15, 62 27 S 78 14, 91 20 S 108 7, 118 12',
  },
  {
    id: 'solana',
    name: 'سولانا',
    symbol: 'SOL',
    price: 187.42,
    change: -0.78,
    volume: '۴.۹ میلیارد',
    marketCap: '۸۹ میلیارد',
    tone: 'from-cyan-300 to-fuchsia-500',
    chart: 'M2 8 C 16 16, 23 13, 33 25 S 48 37, 61 22 S 78 28, 88 16 S 106 23, 118 32',
  },
  {
    id: 'tether',
    name: 'تتر',
    symbol: 'USDT',
    price: 1.0,
    change: 0.04,
    volume: '۵۷.۲ میلیارد',
    marketCap: '۱۵۹ میلیارد',
    tone: 'from-emerald-300 to-teal-600',
    chart: 'M2 22 C 19 20, 23 21, 33 22 S 48 21, 62 22 S 79 20, 92 22 S 106 21, 118 22',
  },
  {
    id: 'bnb',
    name: 'بایننس کوین',
    symbol: 'BNB',
    price: 677.53,
    change: 0.91,
    volume: '۱.۸ میلیارد',
    marketCap: '۹۹ میلیارد',
    tone: 'from-yellow-200 to-orange-500',
    chart: 'M2 36 C 18 31, 24 17, 38 21 S 51 31, 64 18 S 80 15, 94 21 S 107 12, 118 7',
  },
  {
    id: 'xrp',
    name: 'ریپل',
    symbol: 'XRP',
    price: 2.18,
    change: -1.35,
    volume: '۲.۳ میلیارد',
    marketCap: '۱۲۷ میلیارد',
    tone: 'from-slate-200 to-blue-600',
    chart: 'M2 12 C 13 16, 23 20, 35 13 S 51 17, 64 28 S 82 19, 96 25 S 109 32, 118 38',
  },
];

const filters = [
  { id: 'all', label: 'همه بازار' },
  { id: 'favorites', label: 'مورد علاقه' },
  { id: 'gainers', label: 'بیشترین رشد' },
  { id: 'losers', label: 'بیشترین افت' },
];

const numberFormatter = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 });

function formatPrice(value: number) {
  if (value < 10) return `$${value.toFixed(2)}`;
  return `$${numberFormatter.format(value)}`;
}

function Sparkline({ path, positive }: { path: string; positive: boolean }) {
  const color = positive ? '#56e39f' : '#ff718b';

  return (
    <svg viewBox="0 0 120 44" className="h-11 w-28 overflow-visible" role="img" aria-label="نمودار تغییرات قیمت">
      <path d="M2 40 H118" stroke="rgba(255,255,255,.11)" strokeWidth="1" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="118" cy={path.includes('38') ? '38' : path.includes('32') ? '32' : path.includes('7') ? '7' : '12'} r="3" fill={color} />
    </svg>
  );
}

function AssetIcon({ asset, large = false }: { asset: CryptoAsset; large?: boolean }) {
  if (asset.id === 'bitcoin') {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${asset.tone} text-slate-950 shadow-lg shadow-orange-500/20 ${large ? 'h-14 w-14' : 'h-10 w-10'}`}>
        <Bitcoin className={large ? 'h-7 w-7' : 'h-5 w-5'} />
      </span>
    );
  }

  return (
    <span className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${asset.tone} text-slate-950 shadow-lg shadow-indigo-500/15 ${large ? 'h-14 w-14' : 'h-10 w-10'}`}>
      <span className={`font-black tracking-tighter ${large ? 'text-lg' : 'text-sm'}`}>{asset.symbol.slice(0, 1)}</span>
    </span>
  );
}

export default function CryptoPricesPage({ admin = false }: { admin?: boolean }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['bitcoin', 'ethereum']);

  const visibleAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = assets.filter((asset) => {
      const matchesQuery = !query || asset.name.toLowerCase().includes(query) || asset.symbol.toLowerCase().includes(query);
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'favorites' && favorites.includes(asset.id)) ||
        (activeFilter === 'gainers' && asset.change > 0) ||
        (activeFilter === 'losers' && asset.change < 0);
      return matchesQuery && matchesFilter;
    });

    if (activeFilter === 'gainers') return [...filtered].sort((a, b) => b.change - a.change);
    if (activeFilter === 'losers') return [...filtered].sort((a, b) => a.change - b.change);
    return filtered;
  }, [activeFilter, favorites, search]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const marketUp = assets.filter((asset) => asset.change > 0).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white" dir="rtl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-36 -top-28 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -left-44 top-[38%] h-[34rem] w-[34rem] rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute bottom-[-16rem] right-[30%] h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      </div>

      <div className={`relative mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-10 ${admin ? 'pt-5 lg:pt-8' : 'pt-20 md:pt-28'}`}>
        <div className="mb-7 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.055] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 shadow-lg shadow-cyan-500/20">
              <CandlestickChart className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-white">پیشرو / بازارها</p>
              <p className="hidden text-[10px] text-slate-400 sm:block">داشبورد پایش دارایی‌های دیجیتال</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 sm:flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />بازار فعال</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">{admin ? 'نمای مدیریت' : 'نمای عمومی'}</span>
          </div>
        </div>

        <section className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <div className="relative min-h-[290px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#12253b]/95 via-[#10223a]/80 to-[#10152d]/90 p-6 shadow-2xl shadow-cyan-950/25 sm:p-9">
            <div className="absolute -left-8 -top-10 h-48 w-48 rounded-full bg-cyan-300/10 blur-2xl" />
            <div className="absolute bottom-[-100px] right-[27%] h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative z-10 max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[11px] font-semibold text-cyan-100"><Zap className="h-3.5 w-3.5 text-cyan-300" />نبض بازار امروز</div>
              <h1 className="max-w-lg text-3xl font-black leading-[1.35] tracking-tight text-white sm:text-5xl">تصمیم‌های بهتر، با یک نگاه به <span className="bg-gradient-to-l from-cyan-200 via-white to-indigo-300 bg-clip-text text-transparent">بازار</span></h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">قیمت و نوسان رمزارزهای مهم را در یک نمای آرام، شفاف و آماده برای تصمیم‌گیری دنبال کنید.</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-70 sm:h-40" aria-hidden="true">
              <svg viewBox="0 0 900 160" preserveAspectRatio="none" className="h-full w-full">
                <defs><linearGradient id="market-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#38d8ff" stopOpacity="0" /><stop offset=".35" stopColor="#38d8ff" /><stop offset="1" stopColor="#8f8cff" /></linearGradient><linearGradient id="market-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38d8ff" stopOpacity=".14" /><stop offset="1" stopColor="#38d8ff" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 130 C 85 140, 110 75, 190 91 S 260 150, 337 89 S 439 116, 510 78 S 620 120, 702 55 S 802 83, 900 18 L900 160 L0 160 Z" fill="url(#market-fill)" />
                <path d="M0 130 C 85 140, 110 75, 190 91 S 260 150, 337 89 S 439 116, 510 78 S 620 120, 702 55 S 802 83, 900 18" fill="none" stroke="url(#market-line)" strokeWidth="2.5" />
              </svg>
            </div>
            <span className="absolute bottom-6 left-6 hidden text-[10px] uppercase tracking-[.28em] text-cyan-100/60 sm:block">market pulse / 24h</span>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.065] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7">
            <div className="mb-8 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3"><AssetIcon asset={assets[0]} large /><div><p className="font-bold">بیت‌کوین</p><p className="text-xs text-slate-400">BTC / USDT</p></div></div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">پیشتاز بازار</span>
            </div>
            <p className="mb-1 text-xs text-slate-400">قیمت لحظه‌ای</p>
            <div className="flex items-end justify-between gap-3"><p dir="ltr" className="text-3xl font-black tracking-tight">{formatPrice(assets[0].price)}</p><span dir="ltr" className="mb-1 flex items-center gap-1 text-sm font-bold text-emerald-300"><ArrowUpLeft className="h-4 w-4" />+{assets[0].change}%</span></div>
            <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-5"><div className="text-xs text-slate-400"><p>ارزش بازار</p><strong className="mt-1 block text-sm text-slate-200">{assets[0].marketCap} دلار</strong></div><Sparkline path={assets[0].chart} positive /></div>
          </div>
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'ارزش کل بازار', value: '۳.۲۴ تریلیون $', note: '+۱.۸٪ امروز', icon: Globe2, positive: true },
            { label: 'حجم معاملات ۲۴ ساعت', value: '۱۰۴.۶ میلیارد $', note: '+۱۲.۴٪ امروز', icon: BarChart3, positive: true },
            { label: 'دامیننس بیت‌کوین', value: '۶۴.۸٪', note: '+۰.۲٪ امروز', icon: Bitcoin, positive: true },
            { label: 'ارزهای صعودی', value: `${numberFormatter.format(marketUp)} از ${numberFormatter.format(assets.length)}`, note: 'در فهرست منتخب', icon: TrendingUp, positive: true },
          ].map((stat) => {
            const Icon = stat.icon;
            return <div key={stat.label} className="group rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[0.08]"><div className="mb-4 flex items-center justify-between"><span className="rounded-xl bg-white/[0.08] p-2 text-cyan-200"><Icon className="h-4 w-4" /></span><span className="text-[10px] text-slate-500">۲۴ ساعت</span></div><p className="text-xs text-slate-400">{stat.label}</p><p dir="ltr" className="mt-1 text-lg font-bold text-slate-100">{stat.value}</p><p className={`mt-2 text-[11px] font-semibold ${stat.positive ? 'text-emerald-300' : 'text-rose-300'}`}>{stat.note}</p></div>;
          })}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-gradient-to-br from-violet-300 to-indigo-600 p-2.5 text-slate-950"><LayoutGrid className="h-5 w-5" /></div><div><h2 className="text-lg font-black">فهرست قیمت‌ها</h2><p className="mt-1 text-xs text-slate-400">داده‌های نمایشی برای آماده‌سازی اتصال به سرویس بازار</p></div></div>
            <div className="relative w-full max-w-xs"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجوی ارز یا نماد" className="h-10 w-full rounded-2xl border border-white/10 bg-black/15 pr-10 pl-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10" /></div>
          </div>

          <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((filter) => <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${activeFilter === filter.id ? 'bg-white text-slate-950 shadow-lg shadow-white/10' : 'border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.1] hover:text-white'}`}>{filter.label}</button>)}
            <button type="button" className="mr-auto hidden items-center gap-1 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.08] hover:text-white sm:flex"><span>بیشتر</span><ChevronDown className="h-3.5 w-3.5" /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-right">
              <thead><tr className="text-[11px] text-slate-500"><th className="px-4 pb-2 font-medium">دارایی</th><th className="px-4 pb-2 font-medium">قیمت</th><th className="px-4 pb-2 font-medium">تغییرات ۲۴ ساعت</th><th className="px-4 pb-2 font-medium">نمودار</th><th className="px-4 pb-2 font-medium">حجم معاملات</th><th className="px-4 pb-2 font-medium">ارزش بازار</th><th className="px-4 pb-2 font-medium">عملیات</th></tr></thead>
              <tbody>
                {visibleAssets.map((asset) => {
                  const positive = asset.change >= 0;
                  const favorite = favorites.includes(asset.id);
                  return <tr key={asset.id} className="group rounded-2xl bg-white/[0.035] text-sm transition hover:bg-white/[0.09]"><td className="rounded-r-2xl px-4 py-3"><div className="flex items-center gap-3"><button type="button" onClick={() => toggleFavorite(asset.id)} className="text-slate-600 transition hover:text-amber-300" aria-label={favorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}><Star className={`h-4 w-4 ${favorite ? 'fill-amber-300 text-amber-300' : ''}`} /></button><AssetIcon asset={asset} /><div><p className="font-bold text-slate-100">{asset.name}</p><p dir="ltr" className="mt-0.5 text-[11px] text-slate-500">{asset.symbol}</p></div></div></td><td dir="ltr" className="px-4 py-3 font-bold text-slate-100">{formatPrice(asset.price)}</td><td dir="ltr" className={`px-4 py-3 font-semibold ${positive ? 'text-emerald-300' : 'text-rose-300'}`}><span className="inline-flex items-center gap-1">{positive ? <ArrowUpLeft className="h-3.5 w-3.5" /> : <ArrowDownLeft className="h-3.5 w-3.5" />}{positive ? '+' : ''}{asset.change}%</span></td><td className="px-4 py-3"><Sparkline path={asset.chart} positive={positive} /></td><td className="px-4 py-3 text-xs text-slate-400">{asset.volume} $</td><td className="px-4 py-3 text-xs text-slate-400">{asset.marketCap} $</td><td className="rounded-l-2xl px-4 py-3"><button type="button" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100">جزئیات</button></td></tr>;
                })}
              </tbody>
            </table>
            {visibleAssets.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-400">ارزی با این مشخصات پیدا نشد.</div>}
          </div>
        </section>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 text-[11px] text-slate-500 sm:flex-row"><p className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />آخرین به‌روزرسانی نمایشی: همین حالا</p><p className="flex items-center gap-1.5"><WalletCards className="h-3.5 w-3.5" />این صفحه توصیه سرمایه‌گذاری نیست.</p></div>
      </div>
    </main>
  );
}
