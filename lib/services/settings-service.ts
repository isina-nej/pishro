/**
 * Settings Service
 * Handles all site settings-related database operations
 *
 * Note: Only one settings record should exist in the database
 */

import { prisma } from "@/lib/prisma";
import { SiteSettings } from "@prisma/client";
import {
  DEFAULT_PALETTE_ID,
  DEFAULT_THEME_MODE,
  DEFAULT_USER_PANEL_PALETTE_ID,
  resolveThemeMode,
  type PaletteTokens,
  type SiteThemeMode,
} from "@/lib/theme/landing-palettes";
import { resolveSitePalette } from "@/lib/services/custom-palette-service";
import {
  DEFAULT_FAVICON_URL,
  DEFAULT_LOGO_URL,
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_NAME,
  resolveAssetUrl,
} from "@/lib/site/branding";
import { parseHiddenPages } from "@/lib/site/hidable-pages";
import {
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_NAVBAR_ITEMS,
  parseFooterContent,
  parseNavbarItems,
  type FooterContent,
  type NavbarItem,
} from "@/lib/site/chrome-content";
import { isPathHidden } from "@/lib/site/hidable-pages";
import {
  parsePublicContent,
  resolvePublicContent,
  type PublicContentOverrides,
} from "@/lib/site/public-content";
import { Prisma } from "@prisma/client";
import {
  DEFAULT_HOME_LAYOUT,
  parseHomeLayout,
  type HomeLayout,
} from "@/lib/site/home-layout";

/**
 * Type for updateable settings fields
 */
export interface UpdateSettingsInput {
  zarinpalMerchantId?: string | null;
  siteName?: string | null;
  siteDescription?: string | null;
  supportEmail?: string | null;
  supportPhone?: string | null;
  paletteId?: string;
  themeMode?: SiteThemeMode;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  ogImageUrl?: string | null;
  hiddenPages?: string[];
  userPanelPaletteId?: string;
  navbarItems?: NavbarItem[];
  footerContent?: FooterContent;
  homeLayout?: HomeLayout;
  publicContent?: PublicContentOverrides;
}

export type PublicSiteTheme = {
  paletteId: string;
  themeMode: SiteThemeMode;
  light: PaletteTokens;
  dark: PaletteTokens;
  nameFa: string;
};

export type PublicSiteChrome = {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
  hiddenPages: string[];
  navbarItems: NavbarItem[];
  footerContent: FooterContent;
};

export type PublicUserPanelTheme = {
  paletteId: string;
  light: PaletteTokens;
  dark: PaletteTokens;
  nameFa: string;
};

/**
 * Drop footer links that resolve to hidden pages; fall back to always-visible
 * routes (contact/courses) so the footer never renders dead links.
 * ponytail: keep fallback list in sync with chrome-content legalLinks defaults.
 */
function sanitizeFooterLinks(footer: FooterContent, hiddenPages: string[]): FooterContent {
  if (!hiddenPages.length) return footer;
  const isDead = (link: string) => isPathHidden(link.replace(/#.*$/, ""), hiddenPages);
  if (!footer.legalLinks.some((item) => isDead(item.link))) return footer;
  const fallbacks = [
    { label: "قوانین و مقررات", link: "/contact" },
    { label: "تماس با ما", link: "/contact" },
    { label: "دوره‌های آموزشی", link: "/courses" },
  ].filter((item) => !isDead(item.link));
  return {
    ...footer,
    // ponytail: sanitize only; shape comes from parseFooterContent so socials survives
    legalLinks: fallbacks.length ? fallbacks : footer.legalLinks,
  };
}

/**
 * Get site settings (creates default if not exists)
 * @returns Site settings record
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    // Try to find existing settings
    let settings = await prisma.siteSettings.findFirst();

    // If no settings exist, create default record
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          paletteId: DEFAULT_PALETTE_ID,
          themeMode: DEFAULT_THEME_MODE,
          userPanelPaletteId: DEFAULT_USER_PANEL_PALETTE_ID,
          hiddenPages: [],
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new Error("خطا در دریافت تنظیمات");
  }
}

/**
 * Public theme for the live site — never throws; falls back to defaults.
 * Includes resolved light/dark tokens (builtin or custom).
 */
export async function getPublicSiteTheme(): Promise<PublicSiteTheme> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: { paletteId: true, themeMode: true },
    });
    const paletteId = settings?.paletteId ?? DEFAULT_PALETTE_ID;
    const themeMode = resolveThemeMode(settings?.themeMode);
    const resolved = await resolveSitePalette(paletteId);
    return {
      paletteId: resolved.id,
      themeMode,
      light: resolved.light,
      dark: resolved.dark,
      nameFa: resolved.nameFa,
    };
  } catch (error) {
    console.error("Error fetching public site theme:", error);
    const resolved = await resolveSitePalette(DEFAULT_PALETTE_ID);
    return {
      paletteId: resolved.id,
      themeMode: DEFAULT_THEME_MODE,
      light: resolved.light,
      dark: resolved.dark,
      nameFa: resolved.nameFa,
    };
  }
}

/**
 * Branding + visibility for chrome (nav/footer/metadata). Never throws.
 */
export async function getPublicSiteChrome(): Promise<PublicSiteChrome> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: {
        siteName: true,
        siteDescription: true,
        logoUrl: true,
        faviconUrl: true,
        ogImageUrl: true,
        hiddenPages: true,
        navbarItems: true,
        footerContent: true,
      },
    });
    return {
      siteName: settings?.siteName?.trim() || DEFAULT_SITE_NAME,
      siteDescription:
        settings?.siteDescription?.trim() || DEFAULT_SITE_DESCRIPTION,
      logoUrl: resolveAssetUrl(settings?.logoUrl, DEFAULT_LOGO_URL),
      faviconUrl: resolveAssetUrl(
        settings?.faviconUrl || settings?.logoUrl,
        DEFAULT_FAVICON_URL
      ),
      ogImageUrl: resolveAssetUrl(
        settings?.ogImageUrl || settings?.logoUrl,
        DEFAULT_OG_IMAGE_URL
      ),
      hiddenPages: parseHiddenPages(settings?.hiddenPages),
      navbarItems: parseNavbarItems(settings?.navbarItems),
      footerContent: sanitizeFooterLinks(
        parseFooterContent(settings?.footerContent),
        parseHiddenPages(settings?.hiddenPages)
      ),
    };
  } catch (error) {
    console.error("Error fetching public site chrome:", error);
    return {
      siteName: DEFAULT_SITE_NAME,
      siteDescription: DEFAULT_SITE_DESCRIPTION,
      logoUrl: DEFAULT_LOGO_URL,
      faviconUrl: DEFAULT_FAVICON_URL,
      ogImageUrl: DEFAULT_OG_IMAGE_URL,
      hiddenPages: [],
      navbarItems: DEFAULT_NAVBAR_ITEMS.map((item) => ({ ...item })),
      footerContent: structuredClone(DEFAULT_FOOTER_CONTENT),
    };
  }
}

export async function getHiddenPages(): Promise<string[]> {
  const chrome = await getPublicSiteChrome();
  return chrome.hiddenPages;
}

/** Editable public-page copy (defaults merged with admin overrides). Never throws. */
export async function getPublicContent(): Promise<PublicContentOverrides> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: { publicContent: true },
    });
    return resolvePublicContent(settings?.publicContent);
  } catch (error) {
    console.error("Error fetching public content:", error);
    return resolvePublicContent(null);
  }
}

/** Raw overrides stored in DB without defaults merged. Never throws. */
export async function getRawPublicContent(): Promise<PublicContentOverrides> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: { publicContent: true },
    });
    return parsePublicContent(settings?.publicContent);
  } catch (error) {
    console.error("Error fetching raw public content:", error);
    return {};
  }
}

/** Update the entire public content dictionary. Returns resolved content. */
export async function updatePublicContent(
  content: PublicContentOverrides
): Promise<PublicContentOverrides> {
  const parsed = parsePublicContent(content);
  const existingSettings = await getSettings();

  await prisma.siteSettings.update({
    where: { id: existingSettings.id },
    data: {
      publicContent: parsed as Prisma.InputJsonValue,
      updatedAt: new Date(),
    },
  });

  return resolvePublicContent(parsed);
}

/** Update overrides for a single page. Returns resolved content. */
export async function updatePublicContentPage(
  pageId: string,
  pageValues: Record<string, string>
): Promise<PublicContentOverrides> {
  const currentOverrides = await getRawPublicContent();
  currentOverrides[pageId] = { ...(currentOverrides[pageId] || {}), ...pageValues };
  return updatePublicContent(currentOverrides);
}

/** Reset one page or all pages back to factory defaults. */
export async function resetPublicContent(
  pageId?: string
): Promise<PublicContentOverrides> {
  const existingSettings = await getSettings();

  if (pageId && pageId !== "all") {
    const currentOverrides = await getRawPublicContent();
    delete currentOverrides[pageId];
    await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: {
        publicContent: currentOverrides as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
    });
    return resolvePublicContent(currentOverrides);
  }

  // Reset all
  await prisma.siteSettings.update({
    where: { id: existingSettings.id },
    data: {
      publicContent: Prisma.JsonNull,
      updatedAt: new Date(),
    },
  });

  return resolvePublicContent(null);
}

/** Active homepage layout variant. Never throws. */
export async function getHomeLayout(): Promise<HomeLayout> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: { homeLayout: true },
    });
    return parseHomeLayout(settings?.homeLayout);
  } catch (error) {
    console.error("Error fetching home layout:", error);
    return DEFAULT_HOME_LAYOUT;
  }
}

/**
 * Palette for the customer profile panel (`/profile`). Never throws.
 */
export async function getPublicUserPanelTheme(): Promise<PublicUserPanelTheme> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: { userPanelPaletteId: true },
    });
    const paletteId =
      settings?.userPanelPaletteId ?? DEFAULT_USER_PANEL_PALETTE_ID;
    const resolved = await resolveSitePalette(paletteId);
    return {
      paletteId: resolved.id,
      light: resolved.light,
      dark: resolved.dark,
      nameFa: resolved.nameFa,
    };
  } catch (error) {
    console.error("Error fetching user panel theme:", error);
    const resolved = await resolveSitePalette(DEFAULT_USER_PANEL_PALETTE_ID);
    return {
      paletteId: resolved.id,
      light: resolved.light,
      dark: resolved.dark,
      nameFa: resolved.nameFa,
    };
  }
}

/**
 * Update site settings
 * @param data - Partial settings data to update
 * @returns Updated settings record
 */
export async function updateSettings(
  data: UpdateSettingsInput
): Promise<SiteSettings> {
  try {
    // Get or create settings first
    const existingSettings = await getSettings();

    const {
      navbarItems,
      footerContent,
      hiddenPages,
      publicContent,
      ...rest
    } = data;

    const prismaData: Prisma.SiteSettingsUpdateInput = {
      ...rest,
      updatedAt: new Date(),
    };

    if (hiddenPages !== undefined) {
      prismaData.hiddenPages = hiddenPages;
    }
    if (navbarItems !== undefined) {
      prismaData.navbarItems = navbarItems as Prisma.InputJsonValue;
    }
    if (footerContent !== undefined) {
      prismaData.footerContent = footerContent as Prisma.InputJsonValue;
    }
    if (publicContent !== undefined) {
      prismaData.publicContent = parsePublicContent(publicContent) as Prisma.InputJsonValue;
    }

    const updated = await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: prismaData,
    });

    return updated;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error("خطا در به‌روزرسانی تنظیمات");
  }
}

/**
 * Get Zarinpal Merchant ID from settings or fallback to environment variable
 * @returns Merchant ID string or undefined
 */
export async function getZarinpalMerchantId(): Promise<string | undefined> {
  try {
    const settings = await getSettings();

    // Return from DB if exists, otherwise fallback to env
    return settings.zarinpalMerchantId || process.env.ZARINPAL_MERCHANT_ID;
  } catch (error) {
    console.error("Error getting Zarinpal Merchant ID:", error);
    // Fallback to environment variable
    return process.env.ZARINPAL_MERCHANT_ID;
  }
}
