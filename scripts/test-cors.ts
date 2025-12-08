import path from 'path';
// Import our CORS helpers from source (TypeScript) — use ts-node or similar to run this file
// We're going to import compiled JS version from lib folder if available, otherwise fallback to TS helper
let getCorsHeaders: any;
let debugCorsOrigin: any;
try {
  ({ getCorsHeaders, debugCorsOrigin } = require('../lib/cors'));
} catch (err) {
  ({ getCorsHeaders, debugCorsOrigin } = require('../lib/cors.ts'));
}

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
  debugCorsOrigin(origin);
  const headers = getCorsHeaders(origin as unknown as string | null);
  console.log('ORIGIN:', origin, '\n', headers, '\n');
}

console.log('Done.');
