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
  resolvePaletteId,
  resolveThemeMode,
  type SiteThemeMode,
} from "@/lib/theme/landing-palettes";

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
}

export type PublicSiteTheme = {
  paletteId: string;
  themeMode: SiteThemeMode;
};

const FALLBACK_THEME: PublicSiteTheme = {
  paletteId: DEFAULT_PALETTE_ID,
  themeMode: DEFAULT_THEME_MODE,
};

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
 */
export async function getPublicSiteTheme(): Promise<PublicSiteTheme> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: { paletteId: true, themeMode: true },
    });
    if (!settings) return FALLBACK_THEME;
    return {
      paletteId: resolvePaletteId(settings.paletteId),
      themeMode: resolveThemeMode(settings.themeMode),
    };
  } catch (error) {
    console.error("Error fetching public site theme:", error);
    return FALLBACK_THEME;
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

    // Update the settings
    const updated = await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
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
    console.error("Error getting Zarinpal merchant ID:", error);
    // Fallback to environment variable
    return process.env.ZARINPAL_MERCHANT_ID;
  }
}
