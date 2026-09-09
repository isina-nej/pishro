/**
 * Guest live-chat support topics.
 * Titles are admin-managed (CRUD in /admin/live-chat); the widget reads them
 * from the public API. Conversations store the topic as free text, so deleting
 * a topic never breaks old chats — it just stops being offered.
 */

export type ChatTopic = {
  id: string;
  title: string;
};

export type ChatTopicRow = ChatTopic & {
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const MAX_CHAT_TOPICS = 30;
export const MAX_TOPIC_TITLE = 60;

/** Shown when the DB table is empty / unreachable — never throws. */
export const DEFAULT_CHAT_TOPICS: ChatTopic[] = [
  { id: "topic-courses", title: "دوره‌های آموزشی" },
  { id: "topic-funds", title: "سبدهای سرمایه‌گذاری" },
];

export function normalizeTopicTitle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const title = value.trim().replace(/\s+/g, " ");
  if (!title || title.length > MAX_TOPIC_TITLE) return null;
  return title;
}

export function validateTopicIdsInput(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  if (value.length === 0 || value.length > MAX_CHAT_TOPICS) return null;
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item !== "string") return null;
    const id = item.trim();
    if (!id || id.length > 191 || seen.has(id)) return null;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}
