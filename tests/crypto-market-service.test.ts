import assert from 'node:assert/strict';
import test from 'node:test';
import { getCryptoMarketData } from '@/lib/services/crypto-market-service';

const originalFetch = global.fetch;
const originalEnv = {
  COINGECKO_API_URL: process.env.COINGECKO_API_URL,
  COINPAPRIKA_API_URL: process.env.COINPAPRIKA_API_URL,
  BINANCE_API_URL: process.env.BINANCE_API_URL,
  NOBITEX_API_URL: process.env.NOBITEX_API_URL,
};

function json(data: unknown) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

test.afterEach(() => {
  global.fetch = originalFetch;
  Object.assign(process.env, originalEnv);
});

test('uses CoinGecko market data, Binance price, and Nobitex toman price', async () => {
  process.env.COINGECKO_API_URL = 'https://cg.test';
  process.env.COINPAPRIKA_API_URL = 'https://cp.test';
  process.env.BINANCE_API_URL = 'https://binance.test';
  process.env.NOBITEX_API_URL = 'https://nobitex.test';
  global.fetch = async (input) => {
    const url = String(input);
    if (url.includes('cg.test/coins/markets')) return json([{ id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', market_cap_rank: 1, current_price: 100, market_cap: 1000, total_volume: 100, price_change_percentage_24h: 2, sparkline_in_7d: { price: [90, 100] } }]);
    if (url.includes('cg.test/global')) return json({ data: { total_market_cap: { usd: 1000 }, total_volume: { usd: 100 }, market_cap_percentage: { btc: 50 }, market_cap_change_percentage_24h_usd: 1, active_cryptocurrencies: 10 } });
    if (url.includes('cp.test/global')) return json({ market_cap_usd: 900, volume_24h_usd: 90, bitcoin_dominance_percentage: 49 });
    if (url.includes('cp.test/tickers')) return json([]);
    if (url.includes('binance.test')) return json([{ symbol: 'BTCUSDT', price: '101' }]);
    if (url.includes('nobitex.test')) return json({ stats: { 'usdt-irt': { latest: '60000' }, 'btc-irt': { latest: '6000000' } } });
    throw new Error(`Unexpected URL ${url}`);
  };

  const result = await getCryptoMarketData({ ids: ['bitcoin'], symbols: ['BTC'], forceRefresh: true });
  assert.equal(result.assets[0].priceUsd, 101);
  assert.equal(result.assets[0].priceIrr, 60_000_000);
  assert.equal(result.assets[0].priceIrt, 6_000_000);
  assert.equal(result.assets[0].sources.price, 'binance');
  assert.equal(result.assets[0].sources.local, 'nobitex-direct');
  assert.equal(result.global.source, 'coingecko');
});

test('falls back to CoinPaprika when CoinGecko is unavailable', async () => {
  process.env.COINGECKO_API_URL = 'https://cg-fail.test';
  process.env.COINPAPRIKA_API_URL = 'https://cp-fallback.test';
  process.env.BINANCE_API_URL = 'https://binance-fail.test';
  process.env.NOBITEX_API_URL = 'https://nobitex-fail.test';
  global.fetch = async (input) => {
    const url = String(input);
    if (url.includes('cg-fail') || url.includes('binance-fail') || url.includes('nobitex-fail')) return new Response('failed', { status: 503 });
    if (url.includes('cp-fallback.test/global')) return json({ market_cap_usd: 900, volume_24h_usd: 90, bitcoin_dominance_percentage: 49, cryptocurrencies_number: 100 });
    if (url.includes('cp-fallback.test/tickers')) return json([{ id: 'bitcoin-btc', symbol: 'BTC', name: 'Bitcoin', rank: 1, quotes: { USD: { price: 99, market_cap: 900, volume_24h: 90, percent_change_24h: -1 } } }]);
    throw new Error(`Unexpected URL ${url}`);
  };

  const result = await getCryptoMarketData({ ids: ['bitcoin-btc'], symbols: ['BTC'], forceRefresh: true });
  assert.equal(result.assets[0].priceUsd, 99);
  assert.equal(result.assets[0].sources.market, 'coinpaprika');
  assert.equal(result.providers.coingecko, 'unavailable');
  assert.equal(result.providers.coinpaprika, 'live');
});
