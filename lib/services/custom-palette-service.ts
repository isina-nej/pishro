/**
 * Custom site palette service — CRUD + resolve for public theme.
 */

import { prisma } from "@/lib/prisma";
import type { CustomSitePalette, Prisma } from "@prisma/client";
import {
  LANDING_PALETTES,
  DEFAULT_PALETTE_ID,
  getLandingPalette,
  type LandingPalette,
  type PaletteTokens,
  type SiteThemeMode,
} from "@/lib/theme/landing-palettes";
import {
  buildTokensFromEditable,
  customPaletteDbId,
  isCustomPaletteId,
  isValidEditableColors,
  normalizeEditableColors,
  toCustomPaletteId,
  type EditablePaletteColors,
  DEFAULT_EDITABLE_DARK,
  DEFAULT_EDITABLE_LIGHT,
} from "@/lib/theme/custom-palette";

export type CustomPaletteDTO = {
  id: string;
  paletteId: string;
  name: string;
  nameFa: string;
  description: string;
  lightColors: EditablePaletteColors;
  darkColors: EditablePaletteColors;
  light: PaletteTokens;
  dark: PaletteTokens;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CreateCustomPaletteInput = {
  name: string;
  nameFa: string;
  description?: string;
  lightColors: EditablePaletteColors;
  darkColors: EditablePaletteColors;
};

export type UpdateCustomPaletteInput = Partial<CreateCustomPaletteInput>;

function parseColors(value: unknown, fallback: EditablePaletteColors): EditablePaletteColors {
  if (isValidEditableColors(value)) {
    return normalizeEditableColors(value);
  }
  return fallback;
}

function toDTO(row: CustomSitePalette): CustomPaletteDTO {
  const lightColors = parseColors(row.lightColors, DEFAULT_EDITABLE_LIGHT);
  const darkColors = parseColors(row.darkColors, DEFAULT_EDITABLE_DARK);
  return {
    id: row.id,
    paletteId: toCustomPaletteId(row.id),
    name: row.name,
    nameFa: row.nameFa,
    description: row.description,
    lightColors,
    darkColors,
    light: buildTokensFromEditable(lightColors, "light"),
    dark: buildTokensFromEditable(darkColors, "dark"),
    createdAt: row.createdAt?.toISOString() ?? null,
    updatedAt: row.updatedAt?.toISOString() ?? null,
  };
}

export async function listCustomPalettes(): Promise<CustomPaletteDTO[]> {
  const rows = await prisma.customSitePalette.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toDTO);
}

export async function getCustomPaletteById(
  id: string
): Promise<CustomPaletteDTO | null> {
  const row = await prisma.customSitePalette.findUnique({ where: { id } });
  return row ? toDTO(row) : null;
}

export async function getCustomPaletteByPaletteId(
  paletteId: string
): Promise<CustomPaletteDTO | null> {
  const dbId = customPaletteDbId(paletteId);
  if (!dbId) return null;
  return getCustomPaletteById(dbId);
}

export async function createCustomPalette(
  input: CreateCustomPaletteInput
): Promise<CustomPaletteDTO> {
  if (!isValidEditableColors(input.lightColors) || !isValidEditableColors(input.darkColors)) {
    throw new Error("رنگ‌های پالت معتبر نیستند");
  }
  const name = input.name.trim();
  const nameFa = input.nameFa.trim();
  if (!name || !nameFa) {
    throw new Error("نام پالت الزامی است");
  }

  const row = await prisma.customSitePalette.create({
    data: {
      name,
      nameFa,
      description: (input.description ?? "").trim(),
      lightColors: normalizeEditableColors(input.lightColors) as unknown as Prisma.InputJsonValue,
      darkColors: normalizeEditableColors(input.darkColors) as unknown as Prisma.InputJsonValue,
    },
  });
  return toDTO(row);
}

export async function updateCustomPalette(
  id: string,
  input: UpdateCustomPaletteInput
): Promise<CustomPaletteDTO> {
  const existing = await prisma.customSitePalette.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("پالت پیدا نشد");
  }

  const data: Prisma.CustomSitePaletteUpdateInput = {};
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error("نام پالت الزامی است");
    data.name = name;
  }
  if (input.nameFa !== undefined) {
    const nameFa = input.nameFa.trim();
    if (!nameFa) throw new Error("نام فارسی پالت الزامی است");
    data.nameFa = nameFa;
  }
  if (input.description !== undefined) {
    data.description = input.description.trim();
  }
  if (input.lightColors !== undefined) {
    if (!isValidEditableColors(input.lightColors)) {
      throw new Error("رنگ‌های لایت معتبر نیستند");
    }
    data.lightColors = normalizeEditableColors(
      input.lightColors
    ) as unknown as Prisma.InputJsonValue;
  }
  if (input.darkColors !== undefined) {
    if (!isValidEditableColors(input.darkColors)) {
      throw new Error("رنگ‌های دارک معتبر نیستند");
    }
    data.darkColors = normalizeEditableColors(
      input.darkColors
    ) as unknown as Prisma.InputJsonValue;
  }

  const row = await prisma.customSitePalette.update({
    where: { id },
    data,
  });
  return toDTO(row);
}

export async function deleteCustomPalette(id: string): Promise<void> {
  await prisma.customSitePalette.delete({ where: { id } });
}

export async function isKnownPaletteId(paletteId: string): Promise<boolean> {
  if (LANDING_PALETTES.some((p) => p.id === paletteId)) return true;
  if (!isCustomPaletteId(paletteId)) return false;
  const dbId = customPaletteDbId(paletteId);
  if (!dbId) return false;
  const count = await prisma.customSitePalette.count({ where: { id: dbId } });
  return count > 0;
}

export type ResolvedSitePalette = {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  builtin: boolean;
  light: PaletteTokens;
  dark: PaletteTokens;
};

export async function resolveSitePalette(
  paletteId: string | null | undefined
): Promise<ResolvedSitePalette> {
  if (paletteId && !isCustomPaletteId(paletteId)) {
    const builtin = getLandingPalette(paletteId);
    if (builtin) {
      return {
        id: builtin.id,
        name: builtin.name,
        nameFa: builtin.nameFa,
        description: builtin.description,
        builtin: true,
        light: builtin.light,
        dark: builtin.dark,
      };
    }
  }

  if (paletteId && isCustomPaletteId(paletteId)) {
    const custom = await getCustomPaletteByPaletteId(paletteId);
    if (custom) {
      return {
        id: custom.paletteId,
        name: custom.name,
        nameFa: custom.nameFa,
        description: custom.description,
        builtin: false,
        light: custom.light,
        dark: custom.dark,
      };
    }
  }

  const fallback = getLandingPalette(DEFAULT_PALETTE_ID)!;
  return {
    id: fallback.id,
    name: fallback.name,
    nameFa: fallback.nameFa,
    description: fallback.description,
    builtin: true,
    light: fallback.light,
    dark: fallback.dark,
  };
}

export function customDtoToLandingShape(dto: CustomPaletteDTO): LandingPalette {
  return {
    id: dto.paletteId,
    name: dto.name,
    nameFa: dto.nameFa,
    description: dto.description,
    light: dto.light,
    dark: dto.dark,
  };
}

export type { SiteThemeMode };
