'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownLeft, ArrowRight, ArrowUpLeft, BarChart3, CircleDollarSign, Clock3, Coins, Gauge, Loader2, RefreshCw, Scale, ShieldAlert, TrendingUp, WalletCards } from 'lucide-react';
import type { CryptoAssetDetailResponse } from '@/types/crypto-market';

interface ApiResponse { status: 'success' | 'error'; data?: CryptoAssetDetailResponse; message?: string }
const fa = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 });
const faMoney = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('fa-IR', { notation: 'compact', maximumFractionDigits: 2 });

function formatUsd(value: number | null) {
  if (value === null) return '—';
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: value < 1 ? 6 : 2 })}`;
}
function formatCompact(value: number | null) { return value === null ? '—' : `${compact.format(value)} $`; }
function path(values: number[]) {
  const source = values.length > 1 ? values : [0, 1];
  const sampled = source.filter((_, index) => index % Math.max(1, Math.floor(source.length / 80)) === 0).slice(-90);
  const min = Math.min(...sampled); const max = Math.max(...sampled); const range = max - min || 1;
  return sampled.map((value, index) => `${index ? 'L' : 'M'}${((index / Math.max(1, sampled.length - 1)) * 980 + 10).toFixed(1)} ${(240 - ((value - min) / range) * 210).toFixed(1)}`).join(' ');
}
function Change({ value }: { value: number }) {
  const positive = value >= 0;
  return <span dir="ltr" className={`inline-flex items-center gap-1 font-bold ${positive ? 'text-primary' : 'text-destructive'}`}>{positive ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}{positive ? '+' : ''}{fa.format(value)}%</span>;
}
function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note?: string; icon: typeof Coins }) {
  return <div className="rounded-3xl border border-border/10 bg-card/[0.055] p-5 backdrop-blur-xl"><div className="mb-4 flex items-center justify-between"><Icon className="h-5 w-5 text-primary" /><span className="text-[10px] text-muted-foreground">داده بازار</span></div><p className="text-xs text-muted-foreground">{label}</p><p dir="ltr" className="mt-2 text-lg font-black text-primary-foreground">{value}</p>{note && <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>}</div>;
}

export default function CryptoAssetAnalysisPage({ id }: { id: string }) {
  const [data, setData] = useState<CryptoAssetDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/public/crypto-market/${encodeURIComponent(id)}`, { cache: 'no-store' });
      const payload = await response.json() as ApiResponse;
      if (!response.ok || payload.status !== 'success' || !payload.data) throw new Error(payload.message || 'تحلیل ارز در دسترس نیست');
      setData(payload.data); setError(null);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'تحلیل ارز در دسترس نیست'); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { load(); }, [load]);
  const asset = data?.asset;
  const rangePosition = useMemo(() => asset?.high24h && asset.low24h && asset.high24h > asset.low24h ? Math.min(100, Math.max(0, ((asset.priceUsd - asset.low24h) / (asset.high24h - asset.low24h)) * 100)) : 50, [asset]);

  return <main className="relative min-h-screen overflow-hidden bg-[#07111f] pb-14 pt-20 text-foreground md:pt-28" dir="rtl">
    <div className="pointer-events-none absolute inset-0"><div className="absolute -right-48 -top-20 h-[34rem] w-[34rem] rounded-full bg-primary/12 blur-3xl" /><div className="absolute -left-44 top-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" /></div>
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <Link href="/crypto-prices" className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/10 bg-card/[0.05] px-4 py-2 text-xs text-muted-foreground transition hover:bg-card/10 hover:text-primary-foreground"><ArrowRight className="h-4 w-4" />بازگشت به بازار</Link>
      {loading && !data ? <div className="flex min-h-[500px] items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-primary" /></div> : error && !data ? <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-12 text-center"><p className="text-destructive">{error}</p><button onClick={load} className="mt-5 rounded-xl bg-card px-4 py-2 text-sm font-bold text-foreground">تلاش دوباره</button></div> : asset && data ? <>
        <section className="mb-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/10 bg-gradient-to-br from-[#132b43]/95 via-[#0e2036]/95 to-[#15132d]/95 p-6 shadow-2xl sm:p-9"><div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-center gap-4">{asset.imageUrl ? <Image src={asset.imageUrl} alt={asset.name} width={64} height={64} unoptimized className="h-16 w-16 rounded-2xl bg-card/10 p-1" /> : <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-black text-foreground">{asset.symbol[0]}</span>}<div><div className="flex items-center gap-2"><h1 className="text-3xl font-black sm:text-4xl">{asset.name}</h1><span className="rounded-full bg-card/10 px-2 py-1 text-xs text-muted-foreground">#{asset.rank}</span></div><p dir="ltr" className="mt-2 text-sm text-muted-foreground">{asset.symbol} / USD</p></div></div><button onClick={load} className="flex items-center gap-2 self-start rounded-full border border-border/10 px-3 py-2 text-xs text-muted-foreground hover:bg-card/10"><RefreshCw className="h-3.5 w-3.5" />به‌روزرسانی</button></div><div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs text-muted-foreground">قیمت لحظه‌ای</p><p dir="ltr" className="mt-2 text-4xl font-black sm:text-5xl">{formatUsd(asset.priceUsd)}</p><p className="mt-3 text-sm text-muted-foreground">{asset.priceIrt ? `${faMoney.format(asset.priceIrt)} تومان` : 'قیمت تومانی در دسترس نیست'}</p></div><div className="rounded-2xl border border-border/10 bg-background/15 px-4 py-3"><p className="mb-2 text-[10px] text-muted-foreground">تغییر ۲۴ ساعت</p><Change value={asset.change24h} /></div></div></div>
          <div className="rounded-[2rem] border border-border/10 bg-card/[0.055] p-6 backdrop-blur-2xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs text-muted-foreground">مومنتوم بازار</p><h2 className="mt-1 text-xl font-black">نمای تغییرات</h2></div><TrendingUp className="h-6 w-6 text-primary" /></div><div className="grid grid-cols-3 gap-3">{[{ label: '۲۴ ساعت', value: asset.change24h }, { label: '۷ روز', value: asset.change7d }, { label: '۳۰ روز', value: asset.change30d }].map((item) => <div key={item.label} className="rounded-2xl bg-card/[0.05] p-3 text-center"><p className="mb-2 text-[10px] text-muted-foreground">{item.label}</p><Change value={item.value} /></div>)}</div><div className="mt-7"><div className="mb-3 flex justify-between text-[11px] text-muted-foreground"><span>کف ۲۴ ساعت {formatUsd(asset.low24h)}</span><span>سقف {formatUsd(asset.high24h)}</span></div><div className="relative h-2 rounded-full bg-card/10"><div className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-primary to-accent" style={{ width: `${rangePosition}%` }} /><span className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#07111f] bg-card" style={{ right: `calc(${rangePosition}% - 8px)` }} /></div></div></div>
        </section>
        <section className="mb-5 rounded-[2rem] border border-border/10 bg-card/[0.045] p-4 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black">نمودار هفت‌روزه</h2><p className="mt-1 text-xs text-muted-foreground">روند قیمت بر پایه داده‌های بازار</p></div><BarChart3 className="h-5 w-5 text-primary" /></div><div className="h-72 w-full overflow-hidden rounded-2xl bg-background/10 p-3"><svg viewBox="0 0 1000 260" preserveAspectRatio="none" className="h-full w-full"><defs><linearGradient id="detail-line" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#53e4ff" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs><path d={path(asset.sparkline)} fill="none" stroke="url(#detail-line)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg></div></section>
        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="ارزش بازار" value={formatCompact(asset.marketCap)} icon={CircleDollarSign} /><Metric label="حجم معاملات ۲۴ ساعت" value={formatCompact(asset.volume24h)} icon={BarChart3} /><Metric label="ارزش کاملاً رقیق‌شده" value={formatCompact(asset.fullyDilutedValuation)} icon={Scale} /><Metric label="عرضه در گردش" value={asset.circulatingSupply === null ? '—' : compact.format(asset.circulatingSupply)} note={asset.maxSupply ? `حداکثر ${compact.format(asset.maxSupply)}` : 'حداکثر عرضه نامحدود/نامشخص'} icon={Coins} /></section>
        <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-[2rem] border border-border/10 bg-card/[0.05] p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black">محدوده‌های تاریخی</h2><Gauge className="h-5 w-5 text-primary" /></div><div className="space-y-4 text-sm">{[['بالاترین قیمت تاریخی', formatUsd(asset.athUsd)], ['فاصله از سقف', asset.athChangePercentage === null ? '—' : `${fa.format(asset.athChangePercentage)}٪`], ['پایین‌ترین قیمت تاریخی', formatUsd(asset.atlUsd)], ['تاریخ سقف', asset.athDate ? new Date(asset.athDate).toLocaleDateString('fa-IR') : '—']].map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-border/10 pb-3"><span className="text-muted-foreground">{label}</span><strong dir="ltr">{value}</strong></div>)}</div></div><div className="rounded-[2rem] border border-premium/15 bg-premium/[0.06] p-6"><div className="mb-5 flex items-center gap-3"><ShieldAlert className="h-5 w-5 text-premium" /><h2 className="text-lg font-black">برداشت تحلیلی سریع</h2></div><p className="text-sm leading-7 text-muted-foreground">این نما برای مقایسه روند، نقدشوندگی، جایگاه بازار و فاصله قیمت از محدوده‌های تاریخی ساخته شده است. رشد کوتاه‌مدت به‌تنهایی سیگنال خرید نیست؛ حجم، عرضه، ارزش بازار و تحمل ریسک را هم‌زمان بررسی کنید.</p><div className="mt-5 flex flex-wrap gap-2 text-[10px] text-muted-foreground"><span className="rounded-full border border-border/10 px-3 py-1.5">Market: {asset.sources.market}</span><span className="rounded-full border border-border/10 px-3 py-1.5">Price: {asset.sources.price}</span><span className="rounded-full border border-border/10 px-3 py-1.5">Local: {asset.sources.local || 'unavailable'}</span></div></div></section>
        <div className="mt-5 flex flex-col justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row"><p className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />آخرین بروزرسانی: {new Date(data.generatedAt).toLocaleTimeString('fa-IR')}</p><p className="flex items-center gap-1.5"><WalletCards className="h-3.5 w-3.5" />این تحلیل توصیه سرمایه‌گذاری نیست.</p></div>
      </> : null}
    </div>
  </main>;
}
