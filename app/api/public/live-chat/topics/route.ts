/**
 * GET /api/public/live-chat/topics — published support topics for the widget.
 * Public, cached briefly at the edge; never throws (falls back to defaults).
 */

import { successResponse } from "@/lib/api-response";
import { getPublishedChatTopics } from "@/lib/services/chat-topic-service";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const topics = await getPublishedChatTopics();
  return successResponse({ topics }, "موضوعات گفتگو");
}
