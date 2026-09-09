import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CHAT_TOPICS,
  MAX_TOPIC_TITLE,
  normalizeTopicTitle,
  validateTopicIdsInput,
} from "@/lib/site/chat-topics";

describe("chat topic validation", () => {
  it("defaults to the two requested topics", () => {
    assert.equal(DEFAULT_CHAT_TOPICS.length, 2);
    assert.equal(DEFAULT_CHAT_TOPICS[0].title, "دوره‌های آموزشی");
    assert.equal(DEFAULT_CHAT_TOPICS[1].title, "سبدهای سرمایه‌گذاری");
  });

  it("normalizes titles and rejects empty/oversized ones", () => {
    assert.equal(normalizeTopicTitle("  دوره‌های   آموزشی  "), "دوره‌های آموزشی");
    assert.equal(normalizeTopicTitle(""), null);
    assert.equal(normalizeTopicTitle("   "), null);
    assert.equal(normalizeTopicTitle(42), null);
    assert.equal(normalizeTopicTitle("x".repeat(MAX_TOPIC_TITLE + 1)), null);
    assert.ok(normalizeTopicTitle("x".repeat(MAX_TOPIC_TITLE)));
  });

  it("validates reorder id lists", () => {
    assert.deepEqual(validateTopicIdsInput(["a", "b"]), ["a", "b"]);
    assert.equal(validateTopicIdsInput([]), null);
    assert.equal(validateTopicIdsInput(["a", "a"]), null);
    assert.equal(validateTopicIdsInput("nope"), null);
    assert.equal(validateTopicIdsInput([1]), null);
  });
});

describe("chat topic service (DB round-trip)", () => {
  it("creates, lists, reorders and deletes topics", async () => {
    let offline = false;
    let svc: typeof import("@/lib/services/chat-topic-service");
    try {
      svc = await import("@/lib/services/chat-topic-service");
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      offline = true;
    }
    if (offline) {
      console.log("SKIP: Database offline in test environment");
      return;
    }
    const service = svc!;

    const before = await service.getAllChatTopics();
    const beforeIds = new Set(before.map((t) => t.id));

    const a = await service.createChatTopic("تاپیک تست یک · CHAT_TOPICS_TEST");
    const b = await service.createChatTopic("تاپیک تست دو · CHAT_TOPICS_TEST");
    try {
      const list = await service.getAllChatTopics();
      assert.ok(list.some((t) => t.id === a.id));
      assert.ok(list.some((t) => t.id === b.id));

      const published = await service.getPublishedChatTopics();
      assert.ok(published.some((t) => t.id === a.id));

      const renamed = await service.updateChatTopic(a.id, {
        title: "تاپیک تست یک (ویرایش‌شده)",
      });
      assert.equal(renamed?.title, "تاپیک تست یک (ویرایش‌شده)");

      const hidden = await service.updateChatTopic(a.id, { published: false });
      assert.equal(hidden?.published, false);
      const publishedAfterHide = await service.getPublishedChatTopics();
      assert.ok(!publishedAfterHide.some((t) => t.id === a.id));

      await service.reorderChatTopics([b.id, a.id]);
      const reordered = await service.getAllChatTopics();
      const ia = reordered.findIndex((t) => t.id === a.id);
      const ib = reordered.findIndex((t) => t.id === b.id);
      assert.ok(ib >= 0 && ia >= 0 && ib < ia);

      assert.equal(await service.deleteChatTopic(a.id), true);
      assert.equal(await service.deleteChatTopic(a.id), false);
      assert.equal(await service.updateChatTopic(a.id, { title: "x" }), null);
    } finally {
      await service.deleteChatTopic(a.id).catch(() => false);
      await service.deleteChatTopic(b.id).catch(() => false);
    }

    const after = await service.getAllChatTopics();
    for (const t of after) {
      if (!beforeIds.has(t.id)) {
        assert.fail(`leaked test topic: ${t.id}`);
      }
    }

    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$disconnect();
    } catch {
      // ignore disconnect errors
    }
  });
});
