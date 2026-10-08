"use client";

import Script from "next/script";

interface ZibalTrustBadgeProps {
  theme?: "light" | "dark";
  variant?: "script" | "image";
  siteDomain?: string;
  className?: string;
}

/**
 * کامپوننت نشان اعتماد زیبال (Zibal Trust Badge)
 * طبق مستندات رسمی درگاه پرداخت زیبال
 */
export default function ZibalTrustBadge({
  theme = "light",
  variant = "script",
  siteDomain = "pishrosarmaye.com",
  className = "",
}: ZibalTrustBadgeProps) {
  if (variant === "image") {
    const cleanDomain = siteDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <a
          href={`https://gateway.zibal.ir/trustMe/${cleanDomain}`}
          target="_blank"
          rel="noopener noreferrer"
          title="پرداخت آنلاین زیبال"
          className="inline-block transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://zibal.ir/trust/assets/2.png"
            alt="پرداخت آنلاین زیبال"
            style={{ maxWidth: "110px", height: "auto" }}
          />
        </a>
      </div>
    );
  }

  const scriptSrc =
    theme === "dark"
      ? "https://zibal.ir/trust/scripts/zibal-trust-v4.js?theme=dark"
      : "https://zibal.ir/trust/scripts/zibal-trust-v4.js";

  return (
    <div id="zibal" className={`inline-flex items-center justify-center ${className}`}>
      <Script src={scriptSrc} strategy="lazyOnload" />
    </div>
  );
}
