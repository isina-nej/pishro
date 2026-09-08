"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contactInfo } from "@/lib/constants/contact";
import { usePublicCopy } from "@/components/site/PublicContentProvider";
import { DynamicIcon } from "@/components/site/DynamicIcon";
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
  const copy = usePublicCopy("home-v32");
  const phoneAmount = useAnimatedNumber(200_000_000);

  const heroCtaHref = copy("hero.ctaLink", "") || `tel:${phoneTel}`;
  const splitCtaHref = copy("split.ctaLink", "") || `tel:${phoneTel}`;

  return (
    <div className="home-shell v32-landing w-full transition-colors">
      {showHero && (
        <section className="v32-hero">
          <div className="v32-wrap v32-hero-grid">
            <div>
              <h1>
                {copy("hero.title", "پیشرو سرمایه")}
              </h1>
              <p>
                {copy("hero.subtitle", "پیشرو در آموزش و سرمایه‌گذاری")}
              </p>
              <a href={heroCtaHref} className="v32-btn-white">
                {copy("hero.cta", "شروع کنید")}
              </a>
              <div className="v32-chips">
                <span>{copy("hero.chip1", "آموزش ترید")}</span>
                <span>{copy("hero.chip2", "سبدهای تضمینی")}</span>
                <span>{copy("hero.chip3", "مشاوره")}</span>
                <span>{copy("hero.chip4", "پشتیبانی ۲۴ ساعته")}</span>
              </div>
            </div>
            <div className="v32-phone-wrap">
              <div className="v32-glass v32-g1">
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {copy("phone.card1Label", "سرمایه‌گذاری")}
                </div>
                <div style={{ fontWeight: 800, marginTop: 4 }}>
                  {copy("phone.card1Value", "تضمینی")}
                </div>
              </div>
              <div className="v32-glass v32-g2">
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {copy("phone.card2Label", "سرمایه‌گذاری خودکار")}
                </div>
                <div style={{ fontWeight: 800, marginTop: 4 }}>
                  {copy("phone.card2Value", "ماهانه")}
                </div>
              </div>
              <div className="v32-glass v32-g3">
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {copy("phone.portfolioLabel", "ارزش سبد")}
                </div>
                <div style={{ fontWeight: 800, marginTop: 4, fontSize: 20 }}>
                  {copy("phone.portfolioValue", "۲۲۳٬۱۵۸٬۷۰۰")}
                </div>
                <div
                  style={{
                    color: "var(--v32-success)",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {copy("phone.portfolioChange", "+۴٫۲٪")}
                </div>
              </div>
              <div className="v32-phone">
                <div className="v32-phone-bar">
                  <span />
                </div>
                <h3>{copy("phone.title", "سرمایه‌گذاری")}</h3>
                <div ref={phoneAmount.ref} className="v32-amt">
                  {formatFa(phoneAmount.value)}
                </div>
                <div style={{ fontSize: 12, color: "#9aa3ae", marginTop: 4 }}>
                  {copy("phone.currency", "تومان")}
                </div>
                <div className="v32-pad">
                  {["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", ".", "۰", "⌫"].map(
                    (k) => (
                      <b key={k}>{k}</b>
                    )
                  )}
                </div>
                <div className="v32-buy">{copy("phone.confirm", "تأیید سرمایه‌گذاری")}</div>
              </div>
            </div>
          </div>
          <div className="v32-wrap v32-trust">
            <article className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                <DynamicIcon name={copy("trust.1Icon", "GraduationCap")} className="size-4" />
              </div>
              <div>
                <b>{copy("trust.1Title", "دوره‌های پیشرفته")}</b>
                <span>{copy("trust.1Text", "آموزش حرفه‌ای ترید")}</span>
              </div>
            </article>
            <article className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                <DynamicIcon name={copy("trust.2Icon", "Headphones")} className="size-4" />
              </div>
              <div>
                <b>{copy("trust.2Title", "پشتیبانی")}</b>
                <span>{copy("trust.2Text", "دسترسی به مشاوران مجموعه")}</span>
              </div>
            </article>
            <article className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                <DynamicIcon name={copy("trust.3Icon", "Sparkles")} className="size-4" />
              </div>
              <div>
                <b>{copy("trust.3Title", "متناسب با نیاز شما")}</b>
                <span>{copy("trust.3Text", "از آموزش تا سرمایه‌گذاری زیر نظر متخصصان")}</span>
              </div>
            </article>
            <article className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                <DynamicIcon name={copy("trust.4Icon", "Award")} className="size-4" />
              </div>
              <div>
                <b>{copy("trust.4Title", "+۶ سال")}</b>
                <span>{copy("trust.4Text", "سابقه درخشان فعالیت حرفه‌ای")}</span>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="v32-wrap v32-split" id="org">
        <div className="v32-shot">
          <div className="v32-shot-ui">
            <div style={{ fontSize: 12, color: "#9aa3ae" }}>
              {copy("split.balanceLabel", "موجودی سبد")}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 12px" }}>
              {copy("split.balanceValue", "۵۲۶٬۸۲۵٬۰۰۰")}
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
              <span>{copy("split.row1Label", "سبد ثابت")}</span>
              <span>{copy("split.row1Value", "+۲٫۱٪")}</span>
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
              <span>{copy("split.row2Label", "سبد ترکیبی")}</span>
              <span>{copy("split.row2Value", "+۱٫۴٪")}</span>
            </div>
          </div>
        </div>
        <div>
          <h2>
            {copy("split.title", "متناسب با نیاز شما")}
          </h2>
          <p>
            {copy(
              "split.description",
              "از آموزش تا سرمایه‌گذاری، همه زیر نظر متخصصان مجموعه و متناسب با نیاز شما طراحی شده است."
            )}
          </p>
          <a href={splitCtaHref} className="v32-btn-accent">
            {copy("split.cta", "شروع کنید")}
          </a>
        </div>
      </section>

      {showAudience && (
        <section className="v32-wrap v32-aud" id="personal">
          <div className="v32-aud-head">
            <div>
              <h2>{copy("audience.title", "مسیر مناسب خود را پیدا کنید")}</h2>
              <p style={{ margin: 0, color: "var(--v32-muted)" }}>
                {copy(
                  "audience.subtitle",
                  "هدف هر نفر متفاوت است. ما برای هر مسیر راهکاری داریم."
                )}
              </p>
            </div>
          </div>
          <div className="v32-aud-row">
            <Link
              href={copy("audience.card1Link", "/courses")}
              className="v32-aud-card flex items-center justify-between"
              style={{
                background:
                  "linear-gradient(180deg,#3a5a8a,#152033)",
              }}
            >
              <span className="flex items-center gap-2">
                <DynamicIcon name={copy("audience.card1Icon", "GraduationCap")} className="size-4 opacity-80" />
                {copy("audience.card1", "مبتدی")}
              </span>
            </Link>
            <Link
              href={copy("audience.card2Link", "/investment-plans")}
              className="v32-aud-card flex items-center justify-between"
              style={{
                background:
                  "linear-gradient(180deg,#1e3a32,#0d1814)",
              }}
            >
              <span className="flex items-center gap-2">
                <DynamicIcon name={copy("audience.card2Icon", "TrendingUp")} className="size-4 opacity-80" />
                {copy("audience.card2", "معامله‌گر")}
              </span>
            </Link>
            <Link
              href={copy("audience.card3Link", "/investment-plans")}
              className="v32-aud-card flex items-center justify-between"
              style={{
                background:
                  "linear-gradient(180deg,#4a3a28,#1a140e)",
              }}
            >
              <span className="flex items-center gap-2">
                <DynamicIcon name={copy("audience.card3Icon", "PieChart")} className="size-4 opacity-80" />
                {copy("audience.card3", "سبد و نهاد")}
              </span>
            </Link>
            <Link
              href={copy("audience.card4Link", "/business-consulting")}
              className="v32-aud-card flex items-center justify-between"
              style={{
                background:
                  "linear-gradient(180deg,#2a3550,#10141c)",
              }}
            >
              <span className="flex items-center gap-2">
                <DynamicIcon name={copy("audience.card4Icon", "Briefcase")} className="size-4 opacity-80" />
                {copy("audience.card4", "مشاوره")}
              </span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
