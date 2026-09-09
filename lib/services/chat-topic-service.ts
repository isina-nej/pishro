/**
 * Chat topic persistence — admin CRUD + public published list.
 * All readers fall back to DEFAULT_CHAT_TOPICS and never throw,
 * so the widget keeps working even if the DB/table is unavailable.
 *
 * NOTE: `prisma.guestChatTopic` is cast via `topicsDb` because the local
 * generated client predates the GuestChatTopic model; deploy-time
 * `prisma generate` (postinstall) picks the model up from schema.prisma.
 */

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_CHAT_TOPICS,
  type ChatTopic,
  type ChatTopicRow,
} from "@/lib/site/chat-topics";

type Row = {
  id: string;
  title: string;
  order: number;
  published: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type TopicsDb = {
  guestChatTopic: {
    findMany: (args?: unknown) => Promise<Row[]>;
    aggregate: (
      args?: unknown
    ) => Promise<{ _max: { order: number | null } }>;
    create: (args: unknown) => Promise<Row>;
    findUnique: (args: unknown) => Promise<Row | null>;
    update: (args: unknown) => Promise<Row>;
    updateMany: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<Row>;
  };
};

// ponytail: drop the cast once the local node_modules client is regenerated
// (deploy already regenerates via postinstall `prisma generate`).
const topicsDb = prisma as unknown as TopicsDb;

function toRow(r: Row): ChatTopicRow {
  return {
    id: r.id,
    title: r.title,
    order: r.order,
    published: r.published,
    createdAt: r.createdAt ? r.createdAt.toISOString() : undefined,
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
  };
}

/** All topics for the admin manager, ordered. */
export async function getAllChatTopics(): Promise<ChatTopicRow[]> {
  try {
    const rows = await topicsDb.guestChatTopic.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(toRow);
  } catch (error) {
    console.error("Error fetching chat topics:", error);
    return DEFAULT_CHAT_TOPICS.map((t, i) => ({
      ...t,
      order: i,
      published: true,
    }));
  }
}

/** Published titles for the public widget, in order. Never throws. */
export async function getPublishedChatTopics(): Promise<ChatTopic[]> {
  try {
    const rows = (await topicsDb.guestChatTopic.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true },
    })) as unknown as Pick<Row, "id" | "title">[];
    const list = rows
      .map((r) => ({ id: r.id, title: (r.title || "").trim() }))
      .filter((t) => t.title.length > 0);
    return list.length ? list : [...DEFAULT_CHAT_TOPICS];
  } catch (error) {
    console.error("Error fetching published chat topics:", error);
    return [...DEFAULT_CHAT_TOPICS];
  }
}

export async function createChatTopic(title: string): Promise<ChatTopicRow> {
  const max = await topicsDb.guestChatTopic.aggregate({
    _max: { order: true },
  });
  const created = await topicsDb.guestChatTopic.create({
    data: { title, order: (max._max.order ?? -1) + 1, published: true },
  });
  return toRow(created);
}

export async function updateChatTopic(
  id: string,
  patch: { title?: string; published?: boolean }
): Promise<ChatTopicRow | null> {
  const existing = await topicsDb.guestChatTopic.findUnique({ where: { id } });
  if (!existing) return null;
  const updated = await topicsDb.guestChatTopic.update({
    where: { id },
    data: {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.published !== undefined ? { published: patch.published } : {}),
    },
  });
  return toRow(updated);
}

export async function deleteChatTopic(id: string): Promise<boolean> {
  const existing = await topicsDb.guestChatTopic.findUnique({ where: { id } });
  if (!existing) return false;
  await topicsDb.guestChatTopic.delete({ where: { id } });
  return true;
}

/** Persist admin drag-and-drop order. Unknown ids are ignored. */
export async function reorderChatTopics(ids: string[]): Promise<ChatTopicRow[]> {
  for (const [order, id] of ids.entries()) {
    await topicsDb.guestChatTopic.updateMany({ where: { id }, data: { order } });
  }
  return getAllChatTopics();
}
