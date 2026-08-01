// @/lib/services/customer-segment-service.ts
// Read-time evaluation of CustomerSegment.rules (JSON) into matching User
// rows. There is deliberately no materialized membership table — see the
// comment on CustomerSegment.rules in prisma/schema.prisma — so every read
// of a segment's members re-runs this evaluation against current data.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SegmentRulesInput } from "@/lib/schemas/crm-segment-schema";

const memberSelect = {
  id: true,
  phone: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  phoneVerified: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type SegmentMember = Prisma.UserGetPayload<{ select: typeof memberSelect }>;

// Bound on how many non-spend-filtered candidates we pull into memory to
// apply the minSpend post-filter. Fine for an admin CRM tool at this scale;
// flagged as a known tradeoff rather than a materialized/precomputed segment.
const MAX_SPEND_CANDIDATES = 2000;

function buildBaseWhere(rules: SegmentRulesInput): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (rules.phoneVerified !== undefined && rules.phoneVerified !== null) {
    where.phoneVerified = rules.phoneVerified;
  }

  if (rules.role) {
    where.role = rules.role;
  }

  if (rules.tagIds && rules.tagIds.length > 0) {
    where.tagAssignments = { some: { tagId: { in: rules.tagIds } } };
  }

  if (rules.joinedAfter || rules.joinedBefore) {
    where.createdAt = {
      ...(rules.joinedAfter ? { gte: new Date(rules.joinedAfter) } : {}),
      ...(rules.joinedBefore ? { lte: new Date(rules.joinedBefore) } : {}),
    };
  }

  return where;
}

/**
 * Evaluates a segment's rule-set and returns a page of matching customers
 * plus the total match count. minSpend (sum of SUCCESS transactions) can't
 * be expressed as a single Prisma where-clause on User, so it's applied as
 * an in-memory post-filter over a bounded candidate set.
 */
export async function evaluateSegmentMembers(
  rules: SegmentRulesInput,
  options: { page?: number; limit?: number } = {}
): Promise<{ items: SegmentMember[]; total: number }> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, options.limit ?? 20);
  const where = buildBaseWhere(rules);
  const hasSpendRule = typeof rules.minSpend === "number" && rules.minSpend > 0;

  if (!hasSpendRule) {
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: memberSelect,
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total };
  }

  const candidates = await prisma.user.findMany({
    where,
    take: MAX_SPEND_CANDIDATES,
    orderBy: { createdAt: "desc" },
    select: memberSelect,
  });

  if (candidates.length === 0) {
    return { items: [], total: 0 };
  }

  const spendSums = await prisma.transaction.groupBy({
    by: ["userId"],
    where: { userId: { in: candidates.map((c) => c.id) }, status: "SUCCESS" },
    _sum: { amount: true },
  });
  const spendByUser = new Map(spendSums.map((s) => [s.userId, s._sum.amount ?? 0]));

  const minSpend = rules.minSpend as number;
  const matched = candidates.filter((c) => (spendByUser.get(c.id) ?? 0) >= minSpend);

  const start = (page - 1) * limit;
  return { items: matched.slice(start, start + limit), total: matched.length };
}
