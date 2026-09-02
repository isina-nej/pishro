"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useInvestmentFunds } from "@/lib/hooks/useInvestmentFunds";
import { contactInfo } from "@/lib/constants/contact";
import "./v32-landing.css";

const FAQ_ITEMS = [
  {
    q: "آیا اصل سرمایه در سبد ثابت حفظ می‌شود؟",
    a: "مسیر ثابت با نرخ مشخص ماهانه و حفظ اصل طراحی شده؛ جزئیات در قرارداد هر سبد آمده است.",
  },
  {
    q: "حداقل مبلغ ورود چقدر است؟",
    a: "از ماشین‌حساب بالا می‌توانید مبالغ مختلف را آزمایش کنید؛ ورود نهایی پس از مشاوره قطعی می‌شود.",
  },
  {
    q: "گزارش عملکرد چگونه است؟",
    a: "گزارش شفاف دوره‌ای برای اعضای باشگاه و دارندگان سبد ارسال می‌شود.",
  },
] as const;

function formatFa(n: number) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(n));
}

function V32CoinReel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("autoplay", "");

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();

    const onPause = () => {
      if (v.ended || document.hidden) return;
      tryPlay();
    };
    const onVisibility = () => {
      if (!document.hidden) tryPlay();
    };

    v.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) tryPlay();
          else v.pause();
        },
        { threshold: 0.15 }
      );
      io.observe(v);
    }

    return () => {
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, []);

  return (
    <div className="v32-coin-reel">
      <video
        ref={videoRef}
        src="/videos/v32-coins.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
    </div>
  );
}

function V32InlineCalculator() {
  const { data: funds } = useInvestmentFunds();
  const [fundKey, setFundKey] = useState<string>("fixed");
  const [amount, setAmount] = useState(200_000_000);
  const [months, setMonths] = useState(12);

  const rates = useMemo(() => {
    const map: Record<string, number> = { fixed: 0.02, mixed: 0.025, hold: 0.031 };
    if (funds?.length) {
      for (const f of funds) {
        map[f.key] = f.monthlyRate / 100;
      }
    }
    return map;
  }, [funds]);

  const rate = rates[fundKey] ?? 0.02;
  const profit = amount * Math.pow(1 + rate, months) - amount;

  const fundOptions = funds?.length
    ? funds.map((f) => ({ key: f.key, label: f.name }))
    : [
        { key: "fixed", label: "ثابت" },
        { key: "mixed", label: "ترکیبی" },
        { key: "hold", label: "هولد" },
      ];

  return (
    <div className="v32-calc-card" id="calc">
      <label htmlFor="v32-amount">مبلغ — {formatFa(amount)} تومان</label>
      <input
        id="v32-amount"
        type="range"
        min={10_000_000}
        max={2_000_000_000}
        step={10_000_000}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <label htmlFor="v32-months">مدت — {months} ماه</label>
      <input
        id="v32-months"
        type="range"
        min={3}
        max={36}
        step={1}
        value={months}
        onChange={(e) => setMonths(Number(e.target.value))}
      />
      <div className="v32-fund-tabs">
        {fundOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`v32-fund-tab${fundKey === opt.key ? " on" : ""}`}
            onClick={() => setFundKey(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="v32-profit-label">سود تخمینی</div>
      <div className="v32-profit-value">{formatFa(profit)}</div>
    </div>
  );
}

function V32Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="v32-wrap v32-faq" id="faq">
      <h2>پرسش‌های پرتکرار</h2>
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={item.q}
          className={`v32-faq-item${openIndex === i ? " open" : ""}`}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          >
            {item.q}
            <span aria-hidden>{openIndex === i ? "−" : "+"}</span>
          </button>
          <p>{item.a}</p>
        </div>
      ))}
    </section>
  );
}

type V32LandingPageProps = {
  showHero?: boolean;
  showAudience?: boolean;
  showCalculator?: boolean;
  showHelp?: boolean;
};

export default function V32LandingPage({
  showHero = true,
  showAudience = true,
  showCalculator = true,
  showHelp = true,
}: V32LandingPageProps) {
  return (
    <div className="home-shell v32-landing w-full transition-colors">
      {showHero && (
        <section className="v32-hero">
          <div className="v32-wrap v32-hero-grid">
            <div>
              <h1>
                سرمایه
                <br />
                ساده شد.
              </h1>
              <p>
                به جمع کسانی بپیوندید که آموزش، سبد تضمینی و مشاوره را از یک مسیر
                شفاف می‌گیرند.
              </p>
              <Link href="/investment-plans" className="v32-btn-white">
                شروع کنید
              </Link>
              <div className="v32-chips">
                <span>آموزش بورس</span>
                <span>سبد تضمینی</span>
                <span>مشاوره</span>
                <span>باشگاه</span>
              </div>
            </div>
            <div className="v32-phone-wrap">
              <div className="v32-glass v32-g1">
                <div style={{ fontSize: 12, opacity: 0.7 }}>خرید سریع</div>
                <div style={{ fontWeight: 800, marginTop: 4 }}>امامی</div>
              </div>
              <div className="v32-glass v32-g2">
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  سرمایه‌گذاری خودکار
                </div>
                <div style={{ fontWeight: 800, marginTop: 4 }}>ماهانه</div>
              </div>
              <div className="v32-glass v32-g3">
                <div style={{ fontSize: 12, opacity: 0.7 }}>ارزش سبد</div>
                <div style={{ fontWeight: 800, marginTop: 4, fontSize: 20 }}>
                  ۲۲۳٬۱۵۸٬۷۰۰
                </div>
                <div
                  style={{
                    color: "var(--v32-success)",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  +۴٫۲٪
                </div>
              </div>
              <div className="v32-phone">
                <div className="v32-phone-bar">
                  <span />
                </div>
                <h3>خرید / فروش</h3>
                <div className="v32-amt">۱۲٬۵۰۰٬۰۰۰</div>
                <div style={{ fontSize: 12, color: "#9aa3ae", marginTop: 4 }}>
                  تومان · سکه امامی
                </div>
                <div className="v32-pad">
                  {["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", ".", "۰", "⌫"].map(
                    (k) => (
                      <b key={k}>{k}</b>
                    )
                  )}
                </div>
                <div className="v32-buy">تأیید خرید</div>
              </div>
            </div>
          </div>
          <div className="v32-wrap v32-trust">
            <article>
              <b>شفاف</b>
              <span>گزارش ماهانه سبد</span>
            </article>
            <article>
              <b>ایرانی</b>
              <span>مالکیت و پشتیبانی محلی</span>
            </article>
            <article>
              <b>۳ مسیر</b>
              <span>ثابت · ترکیبی · هولد</span>
            </article>
            <article>
              <b>۴٫۷/۵</b>
              <span>رضایت باشگاه</span>
            </article>
          </div>
        </section>
      )}

      <section className="v32-wrap v32-split" id="org">
        <div className="v32-shot">
          <div className="v32-shot-ui">
            <div style={{ fontSize: 12, color: "#9aa3ae" }}>موجودی سبد</div>
            <div style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 12px" }}>
              ۵۲۶٬۸۲۵٬۰۰۰
            </div>
            <svg viewBox="0 0 280 80" width="100%" height="80" aria-hidden>
              <path
                d="M0,60 C40,55 60,30 90,38 C120,46 140,18 180,22 C220,26 240,10 280,16"
                fill="none"
                stroke="var(--v32-success)"
                strokeWidth="3"
              />
            </svg>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                marginTop: 10,
                color: "#c8d0d8",
              }}
            >
              <span>امامی</span>
              <span>+۲٫۱٪</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                marginTop: 8,
                color: "#c8d0d8",
              }}
            >
              <span>بهار آزادی</span>
              <span>+۱٫۴٪</span>
            </div>
          </div>
        </div>
        <div>
          <h2>
            قدرت نهادی
            <br />
            در دسترس همه
          </h2>
          <p>
            همان انضباطی که برای سبدهای بزرگ لازم است — گزارش شفاف، پشتیبانی و
            مسیر مشخص — برای سرمایه‌گذار شخصی هم در دسترس است.
          </p>
          <Link href="/investment-plans" className="v32-btn-accent">
            شروع کنید
          </Link>
        </div>
      </section>

      {showAudience && (
        <section className="v32-wrap v32-aud" id="personal">
          <div className="v32-aud-head">
            <div>
              <h2>اقتصاد دیجیتال را باز کنید</h2>
              <p style={{ margin: 0, color: "var(--v32-muted)" }}>
                هدف هر نفر متفاوت است. مسیر مناسب خود را پیدا کنید.
              </p>
            </div>
          </div>
          <div className="v32-aud-row">
            <Link
              href="/courses"
              className="v32-aud-card"
              style={{
                background:
                  "linear-gradient(180deg,#3a5a8a,#152033)",
              }}
            >
              <span>مبتدی</span>
            </Link>
            <Link
              href="/investment-plans"
              className="v32-aud-card"
              style={{
                background:
                  "linear-gradient(180deg,#1e3a32,#0d1814)",
              }}
            >
              <span>معامله‌گر</span>
            </Link>
            <Link
              href="/investment-plans"
              className="v32-aud-card"
              style={{
                background:
                  "linear-gradient(180deg,#4a3a28,#1a140e)",
              }}
            >
              <span>سبد و نهاد</span>
            </Link>
            <Link
              href="/business-consulting"
              className="v32-aud-card"
              style={{
                background:
                  "linear-gradient(180deg,#2a3550,#10141c)",
              }}
            >
              <span>مشاوره</span>
            </Link>
          </div>
        </section>
      )}

      <section className="v32-coins-sec" id="assets">
        <div className="v32-wrap">
          <h2>۴۱۰+ دارایی دیجیتال</h2>
          <p>
            خرید، فروش و تبدیل بیت‌کوین، آلت‌کوین‌های محبوب و فهرست‌های جدید.
          </p>
          <Link href="/investment-plans" className="v32-btn-white">
            شروع کنید
          </Link>
        </div>
        <V32CoinReel />
      </section>

      <section className="v32-surface-sec" id="learn">
        <div className="v32-wrap">
          <h2>ابزارهای هوشمند، ساده</h2>
          <p className="v32-lead">
            ابزارهایی که با تجربه، سرمایه و استراتژی ریسک شما هم‌راستا می‌شوند.
          </p>
          <div className="v32-feat-grid">
            <article className="v32-feat">
              <h3>سرمایه‌گذاری خودکار</h3>
              <p>
                خرید دوره‌ای برای میانگین‌گیری هزینه در چند نقطه ورود.
              </p>
            </article>
            <article className="v32-feat">
              <h3>سبد ترکیبی</h3>
              <p>چند دارایی در یک معامله — تنوع بدون پیچیدگی اضافه.</p>
            </article>
            <article className="v32-feat">
              <h3>افق هولد</h3>
              <p>
                برای کسانی که رشد بلندمدت می‌خواهند، با گزارش شفاف.
              </p>
            </article>
            <article className="v32-feat">
              <h3>محاسبه پیش از ورود</h3>
              <p>
                سود تخمینی را قبل از تصمیم بسنجید — بدون وعده اغراق‌آمیز.
              </p>
            </article>
          </div>
        </div>
      </section>

      {showCalculator && (
        <section className="v32-wrap v32-steps">
          <h2>مسیر را در سه گام شروع کنید</h2>
          <p className="v32-lead">ساده، شفاف، قابل پیگیری</p>
          <div className="v32-step-grid">
            <article className="v32-step">
              <h3>۱. حساب رایگان</h3>
              <p>ثبت‌نام کنید و مسیر مناسب خود را انتخاب کنید.</p>
            </article>
            <article className="v32-step">
              <h3>۲. مبلغ و مدت</h3>
              <p>با ماشین‌حساب، سود تخمینی سبد را ببینید.</p>
            </article>
            <article className="v32-step">
              <h3>۳. ورود به مسیر</h3>
              <p>ثابت، ترکیبی یا هولد — با گزارش منظم.</p>
            </article>
          </div>
          <V32InlineCalculator />
        </section>
      )}

      {showHelp && (
        <section className="v32-wrap v32-help" id="club">
          <h2>کمک، درست وقتی لازم دارید</h2>
          <div className="v32-help-grid">
            <article>
              <h3>آموزش پیشرو</h3>
              <p>منابع آموزشی و تحلیل بازار.</p>
            </article>
            <article>
              <h3>باشگاه</h3>
              <p>وبینار، اولویت مشاوره و دسترسی به دوره‌ها.</p>
            </article>
            <article>
              <h3>پشتیبانی محلی</h3>
              <p>
                <a href={`tel:${contactInfo.phoneTel}`}>{contactInfo.phone}</a>
              </p>
            </article>
          </div>
        </section>
      )}

      <V32Faq />
    </div>
  );
}
