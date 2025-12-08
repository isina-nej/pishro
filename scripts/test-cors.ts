// Test harness for CORS header generator — ESM-friendly and imports pure util
import { getCorsHeaders, debugCorsOrigin } from '../lib/cors-utils.ts';

const originsToTest = [
  'https://admin.pishrosarmaye.com',
  'https://pishrosarmaye.com',
  'http://localhost:3001',
  'https://evil-site.com',
  undefined,
  null,
];

console.log('Testing CORS headers:');
for (const origin of originsToTest) {
  debugCorsOrigin(origin as unknown as string | null);
  const headers = getCorsHeaders(origin as unknown as string | null);
  console.log('ORIGIN:', origin, '\n', headers, '\n');
}

console.log('Done.');
