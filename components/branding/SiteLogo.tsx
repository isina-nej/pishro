"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGO_URL, DEFAULT_SITE_NAME } from "@/lib/site/branding";

type SiteLogoProps = {
  logoUrl?: string | null;
  siteName?: string | null;
  href?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** When true, skip the link wrapper (e.g. already inside a link). */
  bare?: boolean;
};

/**
 * Site logo image used in chrome (navbar / footer). Falls back to default asset.
 */
export default function SiteLogo({
  logoUrl,
  siteName,
  href = "/",
  className,
  imgClassName,
  priority = false,
  bare = false,
}: SiteLogoProps) {
  const src = logoUrl?.trim() || DEFAULT_LOGO_URL;
  const alt = siteName?.trim() || DEFAULT_SITE_NAME;

  const image = (
    <span
      className={cn(
        "relative inline-flex h-9 w-[110px] items-center justify-start",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="110px"
        priority={priority}
        className={cn("object-contain object-right", imgClassName)}
        unoptimized={src.startsWith("/api/uploads") || src.startsWith("http")}
      />
    </span>
  );

  if (bare) return image;

  return (
    <Link href={href} className="inline-flex shrink-0" aria-label={alt}>
      {image}
    </Link>
  );
}
