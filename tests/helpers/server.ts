// tests/helpers/server.ts
// کمک‌کننده برای تست‌های یکپارچه‌ای که به اپ در حال اجرا نیاز دارند

/** Base URL the integration suites talk to. CI sets this after booting the app. */
export const TEST_BASE_URL =
  process.env.TEST_BASE_URL || process.env.API_URL || 'http://localhost:3000';

/**
 * Builds the `skip` option for a node:test suite: `false` when the app answers
 * at TEST_BASE_URL, otherwise a reason string.
 *
 * Integration suites used to fail with ECONNREFUSED on any machine that did not
 * happen to have the dev server running, which made `npm test` red by default
 * and trained everyone to ignore it. Skipping keeps a local run honest while CI
 * — which starts the app before testing — still executes them for real.
 */
export async function skipUnlessServerUp(): Promise<false | string> {
  try {
    await fetch(TEST_BASE_URL, { signal: AbortSignal.timeout(3000) });
    return false;
  } catch {
    return `no app listening at ${TEST_BASE_URL}`;
  }
}
