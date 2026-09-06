"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contactInfo } from "@/lib/constants/contact";
import "./v32-landing.css";

/* ── animated typing counter ── */
function useAnimatedNumber(target: number, durationMs = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let running = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || running) return;
        running = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1);
          // ease-out quad
          const eased = 1 - (1 - t) * (1 - t);
          setValue(Math.round(eased * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, durationMs]);

  return { value, ref };
}

function formatFa(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n);
}

type V32LandingPageProps = {
  showHero?: boolean;
  showAudience?: boolean;
  phoneTel?: string;
};

export default function V32LandingPage({
  showHero = true,
  showAudience = true,
  phoneTel = contactInfo.phoneTel,
}: V32LandingPageProps) {
  const phoneAmount = useAnimatedNumber(200_000_000);

  return (
    <div className="home-shell v32-landing w-full transition-colors">
      {showHero && (
        <section className="v32-hero">
          <div className="v32-wrap v32-hero-grid">
            <div>
              <h1>
                پیشرو سرمایه
              </h1>
              <p>
                پیشرو در آموزش و سرمایه‌گذاری
              </p>
              <a href={`tel:${phoneTel}`} className="v32-btn-white">
                شروع کنید
              </a>
              <div className="v32-chips">
                <span>آموزش ترید</span>
                <span>سبدهای تضمینی</span>
                <span>مشاوره</span>
                <span>پشتیبانی ۲۴ ساعته</span>
              </div>
            </div>
            <div className="v32-phone-wrap">
              <div className="v32-glass v32-g1">
                <div style={{ fontSize: 12, opacity: 0.7 }}>سرمایه‌گذاری</div>
                <div style={{ fontWeight: 800, marginTop: 4 }}>تضمینی</div>
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
                <h3>سرمایه‌گذاری</h3>
                <div ref={phoneAmount.ref} className="v32-amt">
                  {formatFa(phoneAmount.value)}
                </div>
                <div style={{ fontSize: 12, color: "#9aa3ae", marginTop: 4 }}>
                  تومان
                </div>
                <div className="v32-pad">
                  {["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", ".", "۰", "⌫"].map(
                    (k) => (
                      <b key={k}>{k}</b>
                    )
                  )}
                </div>
                <div className="v32-buy">تأیید سرمایه‌گذاری</div>
              </div>
            </div>
          </div>
          <div className="v32-wrap v32-trust">
            <article>
              <b>دوره‌های پیشرفته</b>
              <span>آموزش حرفه‌ای ترید</span>
            </article>
            <article>
              <b>پشتیبانی</b>
              <span>دسترسی به مشاوران مجموعه</span>
            </article>
            <article>
              <b>متناسب با نیاز شما</b>
              <span>از آموزش تا سرمایه‌گذاری زیر نظر متخصصان</span>
            </article>
            <article>
              <b>+۶ سال</b>
              <span>سابقه درخشان فعالیت حرفه‌ای</span>
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
              <span>سبد ثابت</span>
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
              <span>سبد ترکیبی</span>
              <span>+۱٫۴٪</span>
            </div>
          </div>
        </div>
        <div>
          <h2>
            متناسب با نیاز شما
          </h2>
          <p>
            از آموزش تا سرمایه‌گذاری، همه زیر نظر متخصصان مجموعه و متناسب
            با نیاز شما طراحی شده است.
          </p>
          <a href={`tel:${phoneTel}`} className="v32-btn-accent">
            شروع کنید
          </a>
        </div>
      </section>

      {showAudience && (
        <section className="v32-wrap v32-aud" id="personal">
          <div className="v32-aud-head">
            <div>
              <h2>مسیر مناسب خود را پیدا کنید</h2>
              <p style={{ margin: 0, color: "var(--v32-muted)" }}>
                هدف هر نفر متفاوت است. ما برای هر مسیر راهکاری داریم.
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
    </div>
  );
}
