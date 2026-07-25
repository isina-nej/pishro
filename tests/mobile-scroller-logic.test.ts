import assert from 'node:assert/strict';
import test from 'node:test';

function stepIndex(scrollTop: number, scrollRange: number, stepCount: number) {
  const progress = Math.min(0.999999, Math.max(0, scrollTop) / Math.max(1, scrollRange));
  return Math.min(stepCount - 1, Math.floor(progress * stepCount));
}

test('desktop scroll divides the section into three stable step ranges', () => {
  assert.equal(stepIndex(0, 2100, 3), 0);
  assert.equal(stepIndex(699, 2100, 3), 0);
  assert.equal(stepIndex(700, 2100, 3), 1);
  assert.equal(stepIndex(1399, 2100, 3), 1);
  assert.equal(stepIndex(1400, 2100, 3), 2);
  assert.equal(stepIndex(2100, 2100, 3), 2);
});
