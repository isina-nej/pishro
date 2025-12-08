// Simple script to test getCorsHeaders function output
const path = require('path');
const { getCorsHeaders } = require(path.join(__dirname, '..', 'lib', 'cors.js'));

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
  const headers = getCorsHeaders(origin);
  console.log('ORIGIN:', origin, '\n', headers, '\n');
}

console.log('Done.');
