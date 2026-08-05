import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_MARKET_LIMIT,
  getCryptoMarketData,
  parseCryptoMarketQuery,
} from '@/lib/services/crypto-market-service';

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

test('an absent ?limit falls back to the full market limit, not one asset', () => {
  // Absent limit remains the full catalogue default for API clients that do
  // not paginate; the crypto UI always sends an explicit limit + page.
  assert.equal(parseCryptoMarketQuery(new URLSearchParams()).limit, DEFAULT_MARKET_LIMIT);
  assert.equal(parseCryptoMarketQuery(new URLSearchParams('limit=')).limit, DEFAULT_MARKET_LIMIT);
});

test('an explicit ?limit is honoured, clamped, and validated', () => {
  const limitOf = (qs: string) => parseCryptoMarketQuery(new URLSearchParams(qs)).limit;
  assert.equal(limitOf('limit=25'), 25);
  assert.equal(limitOf('limit=1'), 1);
  assert.equal(limitOf(`limit=${DEFAULT_MARKET_LIMIT + 500}`), DEFAULT_MARKET_LIMIT);
  assert.equal(limitOf('limit=0'), DEFAULT_MARKET_LIMIT);
  assert.equal(limitOf('limit=-5'), DEFAULT_MARKET_LIMIT);
  assert.equal(limitOf('limit=abc'), DEFAULT_MARKET_LIMIT);
  assert.equal(limitOf('limit=1.5'), DEFAULT_MARKET_LIMIT);
});

test('?page defaults to 1 and rejects invalid values', () => {
  const pageOf = (qs: string) => parseCryptoMarketQuery(new URLSearchParams(qs)).page;
  assert.equal(parseCryptoMarketQuery(new URLSearchParams()).page, 1);
  assert.equal(pageOf('page=2'), 2);
  assert.equal(pageOf('page=0'), 1);
  assert.equal(pageOf('page=-3'), 1);
  assert.equal(pageOf('page=abc'), 1);
});

test('paginated market responses expose hasMore metadata', async () => {
  process.env.COINGECKO_API_URL = 'https://cg-page.test';
  process.env.COINOBRIKA_API_URL = 'https://cp-page.test';
  process.env.BINANCE_API_URL = 'https://binance-page.test';
  process.env.NOBITEX_API_URL = 'https://nobitex-page.test';

  const catalogue = Array.from({ length: 5 }, (_, index) => ({
    id: `coin-${index + 1}`,
    symbol: `c${index + 1}`,
    name: `Coin ${index + 1}`,
    market_cap_rank: index + 1,
    current_price: 10 - index,
  }));

  global.fetch = async (input) => {
    const url = String(input);
    if (url.includes('cg-page.test/coins/markets')) {
      const page = Number(new URL(url).searchParams.get('page') || '1');
      const perPage = Number(new URL(url).searchParams.get('per_page') || '2');
      const start = (page - 1) * perPage;
      return json(catalogue.slice(start, start + perPage));
    }
    if (url.includes('cg-page.test/global')) {
      return json({ data: { total_market_cap: { usd: 1 }, total_volume: { usd: 1 }, market_cap_percentage: { btc: 50 } } });
    }
    if (url.includes('binance-page.test') || url.includes('nobitex-page.test')) return json(url.includes('nobitex') ? { stats: {} } : []);
    throw new Error(`Unexpected URL ${url}`);
  };

  const page1 = await getCryptoMarketData({ limit: 2, page: 1, forceRefresh: true });
  assert.equal(page1.assets.length, 2);
  assert.equal(page1.pagination.page, 1);
  assert.equal(page1.pagination.limit, 2);
  assert.equal(page1.pagination.hasMore, true);

  const page2 = await getCryptoMarketData({ limit: 2, page: 2, forceRefresh: true });
  assert.equal(page2.assets.length, 2);
  assert.equal(page2.pagination.page, 2);
  assert.notEqual(page1.assets[0].id, page2.assets[0].id);
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

test('an asset-detail request does not poison the market-list cache', async () => {
  process.env.COINGECKO_API_URL = 'https://cg2.test';
  process.env.COINPAPRIKA_API_URL = 'https://cp2.test';
  process.env.BINANCE_API_URL = 'https://binance2.test';
  process.env.NOBITEX_API_URL = 'https://nobitex2.test';

  const catalogue = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', market_cap_rank: 1, current_price: 100 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', market_cap_rank: 2, current_price: 50 },
    { id: 'solana', symbol: 'sol', name: 'Solana', market_cap_rank: 3, current_price: 20 },
  ];

  global.fetch = async (input) => {
    const url = String(input);
    if (url.includes('cg2.test/coins/markets')) {
      // Mirror CoinGecko: ?ids= narrows the result set, per_page caps it.
      const requested = new URL(url).searchParams.get('ids');
      const rows = requested ? catalogue.filter((row) => requested.split(',').includes(row.id)) : catalogue;
      return json(rows);
    }
    if (url.includes('cg2.test/global')) return json({ data: { total_market_cap: { usd: 1 }, total_volume: { usd: 1 }, market_cap_percentage: { btc: 50 } } });
    if (url.includes('binance2.test')) return json([]);
    if (url.includes('nobitex2.test')) return json({ stats: {} });
    throw new Error(`Unexpected URL ${url}`);
  };

  // What /crypto-prices/[id] does, via crypto-asset-detail-service.
  const detail = await getCryptoMarketData({ ids: ['bitcoin'], limit: 1 });
  assert.equal(detail.assets.length, 1);

  // What /crypto-prices does immediately afterwards, inside the 30s TTL.
  const market = await getCryptoMarketData({ limit: DEFAULT_MARKET_LIMIT });
  assert.equal(market.assets.length, catalogue.length);
  assert.deepEqual(market.assets.map((asset) => asset.symbol), ['BTC', 'ETH', 'SOL']);
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

test('falls back to Nobitex when CoinGecko and CoinPaprika are unavailable', async () => {
  process.env.COINGECKO_API_URL = 'https://cg-down.test';
  process.env.COINOBRIKA_API_URL = 'https://cp-down.test';
  process.env.BINANCE_API_URL = 'https://binance-down.test';
  process.env.NOBITEX_API_URL = 'https://nobitex-only.test';
  global.fetch = async (input) => {
    const url = String(input);
    if (url.includes('cg-down') || url.includes('cp-down') || url.includes('binance-down')) {
      return new Response('failed', { status: 503 });
    }
    if (url.includes('nobitex-only.test')) {
      return json({
        stats: {
          'usdt-irt': { latest: '60000' },
          'btc-irt': { latest: '6000000', dayChange: '1.5', volumeSrc: '10' },
          'eth-irt': { latest: '200000', dayChange: '-0.5', volumeSrc: '5' },
        },
      });
    }
    throw new Error(`Unexpected URL ${url}`);
  };

  const result = await getCryptoMarketData({ forceRefresh: true });
  assert.ok(result.assets.length >= 2);
  const btc = result.assets.find((asset) => asset.symbol === 'BTC');
  assert.ok(btc);
  assert.equal(btc!.priceUsd, 100);
  assert.equal(btc!.priceIrt, 6_000_000);
  assert.equal(btc!.sources.market, 'nobitex');
  assert.equal(result.providers.nobitex, 'live');
  assert.equal(result.providers.coingecko, 'unavailable');
  assert.equal(result.providers.coinpaprika, 'unavailable');
  assert.equal(result.global.source, 'nobitex');
});

test('returns an empty success payload when every provider is down', async () => {
  process.env.COINGECKO_API_URL = 'https://cg-all-down.test';
  process.env.COINOBRIKA_API_URL = 'https://cp-all-down.test';
  process.env.BINANCE_API_URL = 'https://binance-all-down.test';
  process.env.NOBITEX_API_URL = 'https://nobitex-all-down.test';
  global.fetch = async () => new Response('failed', { status: 503 });

  const result = await getCryptoMarketData({ forceRefresh: true });
  assert.deepEqual(result.assets, []);
  assert.equal(result.providers.coingecko, 'unavailable');
  assert.equal(result.providers.coinpaprika, 'unavailable');
  assert.equal(result.providers.nobitex, 'unavailable');
  assert.equal(result.currency, 'USD');
});
