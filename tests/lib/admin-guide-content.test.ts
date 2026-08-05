import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ADMIN_GUIDE_CATEGORIES,
  flattenGuideArticles,
} from "@/lib/admin/guide-content";

describe("admin guide content", () => {
  it("has complete categorized coverage with unique ids", () => {
    assert.ok(ADMIN_GUIDE_CATEGORIES.length >= 10);

    const categoryIds = new Set<string>();
    const articleIds = new Set<string>();

    for (const category of ADMIN_GUIDE_CATEGORIES) {
      assert.ok(category.id);
      assert.ok(category.title);
      assert.ok(category.articles.length > 0);
      assert.equal(categoryIds.has(category.id), false);
      categoryIds.add(category.id);

      for (const article of category.articles) {
        assert.ok(article.id);
        assert.ok(article.title);
        assert.ok(article.summary);
        assert.ok(article.steps.length > 0);
        assert.ok(article.roles.length > 0);
        assert.equal(articleIds.has(article.id), false);
        articleIds.add(article.id);

        for (const step of article.steps) {
          assert.ok(step.title);
          assert.ok(step.detail.length > 10);
        }
      }
    }

    assert.equal(flattenGuideArticles().length, articleIds.size);
  });

  it("covers core admin modules", () => {
    const ids = ADMIN_GUIDE_CATEGORIES.map((c) => c.id);
    for (const required of [
      "getting-started",
      "crm-tickets",
      "news",
      "library",
      "courses",
      "landing-cms",
      "appearance",
    ]) {
      assert.ok(ids.includes(required), `missing category ${required}`);
    }
  });
});
