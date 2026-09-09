import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BUILTIN_EMOJI_PACKS,
  normalizeCustomPacks,
  searchAllEmoji,
} from '../lib/admin/animated-emoji-packs';

describe('animated emoji packs', () => {
  it('ships four builtin packs with remote webp sources', () => {
    assert.equal(BUILTIN_EMOJI_PACKS.length, 4);
    const total = BUILTIN_EMOJI_PACKS.flatMap((p) => p.items).length;
    assert.ok(total >= 40, `expected >= 40 items, got ${total}`);
    for (const item of BUILTIN_EMOJI_PACKS.flatMap((p) => p.items)) {
      assert.ok(item.src.startsWith('https://'), `remote src: ${item.id}`);
      assert.ok(item.src.endsWith('.webp'), `webp: ${item.id}`);
    }
  });

  it('searches fa + en + char across packs', () => {
    assert.ok(searchAllEmoji('قلب', BUILTIN_EMOJI_PACKS).length >= 1);
    assert.ok(searchAllEmoji('money', BUILTIN_EMOJI_PACKS).length >= 1);
    assert.ok(searchAllEmoji('🔥', BUILTIN_EMOJI_PACKS).length >= 1);
    assert.equal(
      searchAllEmoji('', BUILTIN_EMOJI_PACKS).length,
      BUILTIN_EMOJI_PACKS.flatMap((p) => p.items).length,
    );
  });

  it('rejects unsafe custom sources', () => {
    const packs = normalizeCustomPacks([
      { title: 'بد', items: [{ char: 'x', src: 'javascript:alert(1)' }] },
      { title: 'خوب', items: [{ char: '🔥', fa: 'آتش', src: '/animated-emoji/x.webp' }] },
    ]);
    assert.equal(packs.length, 1);
    assert.equal(packs[0].title, 'خوب');
  });
});
