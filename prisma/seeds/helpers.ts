/**
 * Seed Helper Functions
 * Common utilities for seed scripts
 */

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

/**
 * Safe upsert replacement for standalone MongoDB
 * Uses findFirst + create pattern instead of upsert
 */
export async function safeCreate<T>(
  model: any,
  whereClause: any,
  createData: any
): Promise<T> {
  // Find existing record
  const existing = await model.findFirst({
    where: whereClause,
  });

  if (existing) {
    return existing as T;
  }

  // Create new record
  return await model.create({
    data: createData,
  });
}

/**
 * Batch safe create
 */
export async function batchCreate<T>(
  model: any,
  items: Array<{
    where: any;
    data: any;
  }>
): Promise<T[]> {
  const results: T[] = [];
  for (const item of items) {
    const result = await safeCreate(model, item.where, item.data);
    results.push(result);
  }
  return results;
}
