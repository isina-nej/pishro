/**
 * Settings Service
 * Handles all site settings-related database operations
 *
 * Note: Only one settings record should exist in the database
 */

import { prisma } from "@/lib/prisma";
import { SiteSettings } from "@prisma/client";

/**
 * Type for updateable settings fields
 */
export interface UpdateSettingsInput {
  zarinpalMerchantId?: string;
  siteName?: string;
  siteDescription?: string;
  supportEmail?: string;
  supportPhone?: string;
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
        data: {},
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new Error("خطا در دریافت تنظیمات");
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
