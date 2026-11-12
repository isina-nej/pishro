import Image from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGO_URL, DEFAULT_SITE_NAME } from "@/lib/site/branding";

type SiteLoadingScreenProps = {
  /** A full viewport overlay is reserved for cold boot, not routine navigation. */
  fullscreen?: boolean;
  className?: string;
  logoUrl?: string;
  siteName?: string;
};

/**
 * Consistent, lightweight loading surface for App Router suspense boundaries.
 * Real progress is unknown; the bar is indeterminate rather than a fake percentage.
 */
export default function SiteLoadingScreen({
  fullscreen = false,
  className,
  logoUrl = DEFAULT_LOGO_URL,
  siteName = DEFAULT_SITE_NAME,
}: SiteLoadingScreenProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="در حال آماده‌سازی صفحه"
      className={cn("site-loading-screen", fullscreen && "site-loading-fullscreen", className)}
    >
      <div className="site-loading-content">
        <span className="site-loading-overline" aria-hidden="true">
          تجربه‌ای روان‌تر، لحظه‌ای دیگر
        </span>
        <div className="site-loading-mark" aria-hidden="true">
          <span className="site-loading-mark-outline" />
          <div className="site-loading-mark-inner">
            <Image
              src={logoUrl}
              alt=""
              width={70}
              height={70}
              className="site-loading-logo"
              unoptimized={logoUrl.startsWith("/api/") || logoUrl.startsWith("http")}
            />
          </div>
        </div>
        <div className="site-loading-name">{siteName}</div>
        <p className="site-loading-message">در حال آماده‌سازی صفحه</p>
        <div className="site-loading-track" aria-hidden="true">
          <span className="site-loading-indicator" />
        </div>
      </div>
    </section>
  );
}
