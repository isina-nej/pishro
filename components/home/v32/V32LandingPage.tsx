"use client";

import Link from "next/link";
import "./v32-landing.css";

type V32LandingPageProps = {
  showHero?: boolean;
  showAudience?: boolean;
};

export default function V32LandingPage({
  showHero = true,
  showAudience = true,
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

      {/* ponytail: coins-sec, surface-sec, steps, help, faq removed — restore when crypto/tools sections needed */}
    </div>
  );
}
