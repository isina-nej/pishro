import type {
  CryptoGlobalMarket,
  CryptoMarketAsset,
  CryptoMarketResponse,
  MarketDataSource,
  ProviderStatus,
} from '@/types/crypto-market';

const DEFAULT_ASSET_IDS: string[] = [];
const DEFAULT_SYMBOLS: string[] = [];
const DEFAULT_MARKET_LIMIT = 150;
const CATALOGUE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 10_000;
const ENRICHMENT_TIMEOUT_MS = 4_000;
/** Snapshot freshness — UI reads from this; foreign APIs are not hit per page. */
const CACHE_TTL_MS = 60_000;
const STALE_CACHE_TTL_MS = 30 * 60_000;
const WARMER_INTERVAL_MS = 55_000;

type JsonRecord = Record<string, unknown>;

interface ProviderState {
  coingecko: ProviderStatus;
  binance: ProviderStatus;
  coinpaprika: ProviderStatus;
  coinlore: ProviderStatus;
  coincap: ProviderStatus;
  nobitex: ProviderStatus;
}

interface MarketSnapshot {
  assets: CryptoMarketAsset[];
  global: CryptoGlobalMarket;
  providers: ProviderState;
}

interface CacheEntry {
  expiresAt: number;
  staleUntil: number;
  value: MarketSnapshot;
}

/** Canonical CoinGecko-style ids so UI favorites/links stay stable across providers. */
const CANONICAL_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  BNB: 'binancecoin',
  SOL: 'solana',
  XRP: 'ripple',
  USDC: 'usd-coin',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  TRX: 'tron',
  TON: 'toncoin',
  AVAX: 'avalanche-2',
  DOT: 'polkadot',
  LINK: 'chainlink',
  MATIC: 'matic-network',
  POL: 'polygon-ecosystem-token',
  SHIB: 'shiba-inu',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  XLM: 'stellar',
  NEAR: 'near',
  FIL: 'filecoin',
  APT: 'aptos',
  ARB: 'arbitrum',
  OP: 'optimism',
  SUI: 'sui',
  PEPE: 'pepe',
  WIF: 'dogwifcoin',
};

const NOBITEX_FALLBACK_ASSETS: Array<{ id: string; symbol: string; name: string; rank: number }> = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', rank: 1 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', rank: 2 },
  { id: 'tether', symbol: 'USDT', name: 'Tether', rank: 3 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', rank: 4 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', rank: 5 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', rank: 6 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', rank: 7 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', rank: 8 },
  { id: 'tron', symbol: 'TRX', name: 'TRON', rank: 9 },
  { id: 'toncoin', symbol: 'TON', name: 'Toncoin', rank: 10 },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', rank: 11 },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', rank: 12 },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', rank: 13 },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', rank: 14 },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', rank: 15 },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', rank: 16 },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', rank: 17 },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', rank: 18 },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', rank: 19 },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', rank: 20 },
];

/** One full-market snapshot shared by all page/detail slices. */
let catalogueCache: CacheEntry | null = null;
let catalogueInflight: Promise<MarketSnapshot> | null = null;
let warmerStarted = false;

function numberOrNull(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberOrZero(value: unknown): number {
  return numberOrNull(value) ?? 0;
}

function toQueryList(value: string | null, fallback: string[], max = 150): string[] {
  if (!value) return fallback;
  const values = value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, max);
  return values.length ? values : fallback;
}

function toLimit(value: string | null): number {
  if (!value) return DEFAULT_MARKET_LIMIT;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_MARKET_LIMIT;
  return Math.min(parsed, DEFAULT_MARKET_LIMIT);
}

function toPage(value: string | null): number {
  if (!value) return 1;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return Math.min(parsed, Math.ceil(DEFAULT_MARKET_LIMIT));
}

function assetRequestOptions(options?: { ids?: string[]; symbols?: string[]; limit?: number; page?: number }) {
  const ids = options?.ids || [];
  const symbols = options?.symbols || [];
  const page = options?.page && Number.isInteger(options.page) && options.page > 0 ? options.page : 1;
  return {
    ids,
    symbols,
    limit: options?.limit || DEFAULT_MARKET_LIMIT,
    page,
  };
}

function canonicalId(symbol: string, fallbackId: string): string {
  const upper = symbol.toUpperCase();
  if (CANONICAL_IDS[upper]) return CANONICAL_IDS[upper];
  const cleaned = fallbackId.toLowerCase().replace(/[^a-z0-9-]/g, '');
  // CoinPaprika style bitcoin-btc → bitcoin when possible
  if (cleaned.endsWith(`-${upper.toLowerCase()}`)) {
    return cleaned.slice(0, -(upper.length + 1)) || cleaned;
  }
  return cleaned || upper.toLowerCase();
}

function parseJson(text: string): unknown {
  return JSON.parse(text) as unknown;
}

async function fetchJson<T>(url: string, init?: RequestInit, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: 'no-store',
      headers: { Accept: 'application/json', ...(init?.headers || {}) },
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 200)}`);
    return parseJson(text) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function coingeckoBaseUrl() {
  return process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
}

function coinpaprikaBaseUrl() {
  return process.env.COINOBRIKA_API_URL || 'https://api.coinpaprika.com/v1';
}

function coinloreBaseUrl() {
  return process.env.COINLORE_API_URL || 'https://api.coinlore.net/api';
}

function coincapBaseUrl() {
  return process.env.COINCAP_API_URL || 'https://api.coincap.io/v2';
}

function binanceBaseUrl() {
  return process.env.BINANCE_API_URL || 'https://api.binance.com/api/v3';
}

function nobitexBaseUrl() {
  return process.env.NOBITEX_API_URL || 'https://apiv2.nobitex.ir';
}

function providerHeaders(apiKey?: string) {
  return apiKey ? { 'x-cg-demo-api-key': apiKey } : undefined;
}

function emptyProviders(): ProviderState {
  return {
    coingecko: 'unavailable',
    binance: 'unavailable',
    coinpaprika: 'unavailable',
    coinlore: 'unavailable',
    coincap: 'unavailable',
    nobitex: 'unavailable',
  };
}

function emptyMarketSnapshot(): MarketSnapshot {
  return {
    assets: [],
    global: {
      marketCap: 0,
      volume24h: 0,
      btcDominance: 0,
      marketCapChange24h: 0,
      activeCryptocurrencies: null,
      source: 'nobitex',
    },
    providers: emptyProviders(),
  };
}

function scoreAsset(asset: CryptoMarketAsset): number {
  let score = 0;
  if (asset.sparkline.length > 5) score += 40;
  if (asset.imageUrl) score += 10;
  if (asset.marketCap > 0) score += 15;
  if (asset.change7d !== 0) score += 5;
  if (asset.priceUsd > 0) score += 10;
  if (asset.rank > 0 && asset.rank <= 50) score += 5;
  return score;
}

function preferAsset(a: CryptoMarketAsset, b: CryptoMarketAsset): CryptoMarketAsset {
  const scoreA = scoreAsset(a);
  const scoreB = scoreAsset(b);
  if (scoreA !== scoreB) return scoreA > scoreB ? a : b;
  // Prefer richer sparkline / lower rank
  if (a.sparkline.length !== b.sparkline.length) {
    return a.sparkline.length > b.sparkline.length ? a : b;
  }
  if (a.rank && b.rank && a.rank !== b.rank) return a.rank < b.rank ? a : b;
  return a.marketCap >= b.marketCap ? a : b;
}

function mergeBySymbol(lists: CryptoMarketAsset[][]): CryptoMarketAsset[] {
  const bySymbol = new Map<string, CryptoMarketAsset>();
  for (const list of lists) {
    for (const asset of list) {
      const key = asset.symbol.toUpperCase();
      if (!key || key.length > 12) continue;
      const existing = bySymbol.get(key);
      if (!existing) {
        bySymbol.set(key, { ...asset, id: canonicalId(key, asset.id), symbol: key });
      } else {
        const winner = preferAsset(existing, {
          ...asset,
          id: canonicalId(key, asset.id),
          symbol: key,
        });
        // Keep best local prices if either side has them
        bySymbol.set(key, {
          ...winner,
          priceIrr: winner.priceIrr ?? existing.priceIrr ?? asset.priceIrr,
          priceIrt: winner.priceIrt ?? existing.priceIrt ?? asset.priceIrt,
          sparkline:
            winner.sparkline.length >= existing.sparkline.length
              ? winner.sparkline
              : existing.sparkline,
          imageUrl: winner.imageUrl || existing.imageUrl || asset.imageUrl,
          sources: {
            market: winner.sources.market,
            price: winner.sources.price,
            local: winner.sources.local ?? existing.sources.local ?? asset.sources.local,
          },
        });
      }
    }
  }
  return Array.from(bySymbol.values()).sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    return b.marketCap - a.marketCap;
  });
}

function filterAssets(
  assets: CryptoMarketAsset[],
  ids: string[],
  symbols: string[]
): CryptoMarketAsset[] {
  if (!ids.length && !symbols.length) return assets;
  const idSet = new Set(ids.map((id) => id.toLowerCase()));
  const symbolSet = new Set(symbols.map((symbol) => symbol.toUpperCase()));
  return assets.filter(
    (asset) => idSet.has(asset.id.toLowerCase()) || symbolSet.has(asset.symbol.toUpperCase())
  );
}

function takePage<T>(assets: T[], limit: number, page: number): T[] {
  const start = (Math.max(1, page) - 1) * limit;
  return assets.slice(start, start + limit);
}

function buildPagination(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    hasMore: page * limit < Math.min(total, DEFAULT_MARKET_LIMIT),
  };
}

async function loadCoinGecko(): Promise<{
  assets: CryptoMarketAsset[];
  global: CryptoGlobalMarket;
} | null> {
  const headers = providerHeaders(process.env.COINGECKO_API_KEY);
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: String(CATALOGUE_SIZE),
    page: '1',
    sparkline: 'true',
    price_change_percentage: '24h,7d,30d',
  });

  try {
    const [markets, global] = await Promise.all([
      fetchJson<
        Array<{
          id: string;
          symbol: string;
          name: string;
          image?: string | null;
          market_cap_rank?: number | null;
          current_price?: number | null;
          market_cap?: number | null;
          fully_diluted_valuation?: number | null;
          total_volume?: number | null;
          price_change_percentage_24h?: number | null;
          price_change_percentage_7d_in_currency?: number | null;
          price_change_percentage_30d_in_currency?: number | null;
          high_24h?: number | null;
          low_24h?: number | null;
          ath?: number | null;
          ath_change_percentage?: number | null;
          ath_date?: string | null;
          atl?: number | null;
          circulating_supply?: number | null;
          total_supply?: number | null;
          max_supply?: number | null;
          sparkline_in_7d?: { price?: number[] };
        }>
      >(`${coingeckoBaseUrl()}/coins/markets?${params}`, { headers }),
      fetchJson<JsonRecord>(`${coingeckoBaseUrl()}/global`, { headers }),
    ]);

    const assets = markets
      .filter((item) => item?.id && item?.symbol)
      .map((item): CryptoMarketAsset => ({
        id: canonicalId(item.symbol, item.id),
        name: item.name,
        symbol: item.symbol.toUpperCase(),
        imageUrl: item.image || null,
        rank: numberOrZero(item.market_cap_rank),
        priceUsd: numberOrZero(item.current_price),
        priceIrr: null,
        priceIrt: null,
        change24h: numberOrZero(item.price_change_percentage_24h),
        change7d: numberOrZero(item.price_change_percentage_7d_in_currency),
        change30d: numberOrZero(item.price_change_percentage_30d_in_currency),
        volume24h: numberOrZero(item.total_volume),
        marketCap: numberOrZero(item.market_cap),
        fullyDilutedValuation: numberOrNull(item.fully_diluted_valuation),
        high24h: numberOrNull(item.high_24h),
        low24h: numberOrNull(item.low_24h),
        athUsd: numberOrNull(item.ath),
        athChangePercentage: numberOrNull(item.ath_change_percentage),
        athDate: item.ath_date || null,
        atlUsd: numberOrNull(item.atl),
        circulatingSupply: numberOrNull(item.circulating_supply),
        totalSupply: numberOrNull(item.total_supply),
        maxSupply: numberOrNull(item.max_supply),
        sparkline: Array.isArray(item.sparkline_in_7d?.price)
          ? item.sparkline_in_7d.price.filter((value) => Number.isFinite(value))
          : [],
        sources: { market: 'coingecko', price: 'coingecko', local: null },
      }));

    const globalData = (global.data || {}) as JsonRecord;
    const marketCapPercentage = (globalData.market_cap_percentage || {}) as JsonRecord;
    return {
      assets,
      global: {
        marketCap: numberOrZero((globalData.total_market_cap as JsonRecord)?.usd),
        volume24h: numberOrZero((globalData.total_volume as JsonRecord)?.usd),
        btcDominance: numberOrZero(marketCapPercentage.btc),
        marketCapChange24h: numberOrZero(globalData.market_cap_change_percentage_24h_usd),
        activeCryptocurrencies: numberOrNull(globalData.active_cryptocurrencies),
        source: 'coingecko',
      },
    };
  } catch (error) {
    console.warn('[crypto] CoinGecko unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function loadCoinPaprika(): Promise<{
  assets: CryptoMarketAsset[];
  global: CryptoGlobalMarket;
} | null> {
  try {
    const [global, tickers] = await Promise.all([
      fetchJson<JsonRecord>(`${coinpaprikaBaseUrl()}/global`),
      fetchJson<
        Array<{
          id: string;
          symbol: string;
          name: string;
          rank?: number;
          quotes?: {
            USD?: {
              price?: number;
              market_cap?: number;
              volume_24h?: number;
              percent_change_24h?: number;
              percent_change_7d?: number;
            };
          };
        }>
      >(`${coinpaprikaBaseUrl()}/tickers?quotes=USD`),
    ]);

    const assets = tickers.slice(0, CATALOGUE_SIZE).map((item): CryptoMarketAsset => {
      const quote = item.quotes?.USD || {};
      return {
        id: canonicalId(item.symbol, item.id),
        name: item.name,
        symbol: item.symbol.toUpperCase(),
        imageUrl: null,
        rank: numberOrZero(item.rank),
        priceUsd: numberOrZero(quote.price),
        priceIrr: null,
        priceIrt: null,
        change24h: numberOrZero(quote.percent_change_24h),
        change7d: numberOrZero(quote.percent_change_7d),
        change30d: 0,
        volume24h: numberOrZero(quote.volume_24h),
        marketCap: numberOrZero(quote.market_cap),
        fullyDilutedValuation: null,
        high24h: null,
        low24h: null,
        athUsd: null,
        athChangePercentage: null,
        athDate: null,
        atlUsd: null,
        circulatingSupply: null,
        totalSupply: null,
        maxSupply: null,
        sparkline: [],
        sources: { market: 'coinpaprika', price: 'coinpaprika', local: null },
      };
    });

    return {
      assets,
      global: {
        marketCap: numberOrZero(global.market_cap_usd),
        volume24h: numberOrZero(global.volume_24h_usd),
        btcDominance: numberOrZero(global.bitcoin_dominance_percentage),
        marketCapChange24h: 0,
        activeCryptocurrencies: numberOrNull(global.cryptocurrencies_number),
        source: 'coinpaprika',
      },
    };
  } catch (error) {
    console.warn('[crypto] CoinPaprika unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function loadCoinLore(): Promise<{
  assets: CryptoMarketAsset[];
  global: CryptoGlobalMarket;
} | null> {
  try {
    const payload = await fetchJson<{
      data?: Array<{
        id: string;
        symbol: string;
        name: string;
        rank: number | string;
        price_usd: string | number;
        percent_change_24h: string | number;
        percent_change_7d: string | number;
        market_cap_usd: string | number;
        volume24: string | number;
        csupply?: string | number;
      }>;
    }>(`${coinloreBaseUrl()}/tickers/?start=0&limit=${CATALOGUE_SIZE}`);

    const rows = payload.data || [];
    if (!rows.length) return null;

    const assets = rows.map((item): CryptoMarketAsset => ({
      id: canonicalId(item.symbol, item.name),
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      imageUrl: null,
      rank: numberOrZero(item.rank),
      priceUsd: numberOrZero(item.price_usd),
      priceIrr: null,
      priceIrt: null,
      change24h: numberOrZero(item.percent_change_24h),
      change7d: numberOrZero(item.percent_change_7d),
      change30d: 0,
      volume24h: numberOrZero(item.volume24),
      marketCap: numberOrZero(item.market_cap_usd),
      fullyDilutedValuation: null,
      high24h: null,
      low24h: null,
      athUsd: null,
      athChangePercentage: null,
      athDate: null,
      atlUsd: null,
      circulatingSupply: numberOrNull(item.csupply),
      totalSupply: null,
      maxSupply: null,
      sparkline: [],
      sources: { market: 'coinlore', price: 'coinlore', local: null },
    }));

    const marketCap = assets.reduce((sum, asset) => sum + asset.marketCap, 0);
    const volume24h = assets.reduce((sum, asset) => sum + asset.volume24h, 0);
    const btc = assets.find((asset) => asset.symbol === 'BTC');
    return {
      assets,
      global: {
        marketCap,
        volume24h,
        btcDominance: btc && marketCap ? (btc.marketCap / marketCap) * 100 : 0,
        marketCapChange24h: btc?.change24h ?? 0,
        activeCryptocurrencies: assets.length,
        source: 'coinlore',
      },
    };
  } catch (error) {
    console.warn('[crypto] CoinLore unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function loadCoinCap(): Promise<{
  assets: CryptoMarketAsset[];
  global: CryptoGlobalMarket;
} | null> {
  try {
    const payload = await fetchJson<{
      data?: Array<{
        id: string;
        symbol: string;
        name: string;
        rank: string | number;
        priceUsd: string | number;
        changePercent24Hr: string | number;
        marketCapUsd: string | number;
        volumeUsd24Hr: string | number;
        supply?: string | number;
        maxSupply?: string | number;
      }>;
    }>(`${coincapBaseUrl()}/assets?limit=${CATALOGUE_SIZE}`);

    const rows = payload.data || [];
    if (!rows.length) return null;

    const assets = rows.map((item): CryptoMarketAsset => ({
      id: canonicalId(item.symbol, item.id),
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      imageUrl: null,
      rank: numberOrZero(item.rank),
      priceUsd: numberOrZero(item.priceUsd),
      priceIrr: null,
      priceIrt: null,
      change24h: numberOrZero(item.changePercent24Hr),
      change7d: 0,
      change30d: 0,
      volume24h: numberOrZero(item.volumeUsd24Hr),
      marketCap: numberOrZero(item.marketCapUsd),
      fullyDilutedValuation: null,
      high24h: null,
      low24h: null,
      athUsd: null,
      athChangePercentage: null,
      athDate: null,
      atlUsd: null,
      circulatingSupply: numberOrNull(item.supply),
      totalSupply: null,
      maxSupply: numberOrNull(item.maxSupply),
      sparkline: [],
      sources: { market: 'coincap', price: 'coincap', local: null },
    }));

    const marketCap = assets.reduce((sum, asset) => sum + asset.marketCap, 0);
    const volume24h = assets.reduce((sum, asset) => sum + asset.volume24h, 0);
    const btc = assets.find((asset) => asset.symbol === 'BTC');
    return {
      assets,
      global: {
        marketCap,
        volume24h,
        btcDominance: btc && marketCap ? (btc.marketCap / marketCap) * 100 : 0,
        marketCapChange24h: btc?.change24h ?? 0,
        activeCryptocurrencies: assets.length,
        source: 'coincap',
      },
    };
  } catch (error) {
    console.warn('[crypto] CoinCap unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

interface NobitexStats {
  [symbol: string]: {
    latest?: string | number;
    dayChange?: string | number;
    dayLow?: string | number;
    dayHigh?: string | number;
    volumeSrc?: string | number;
  };
}

async function loadNobitexStats(symbols: string[]): Promise<{
  stats: NobitexStats;
  usdtIrr: number | null;
} | null> {
  try {
    const requested = symbols.map((symbol) => symbol.toLowerCase());
    const stats = await fetchJson<{ stats?: NobitexStats }>(
      `${nobitexBaseUrl()}/market/stats`,
      undefined,
      ENRICHMENT_TIMEOUT_MS
    );
    const allStats = stats.stats || {};
    const selectedStats = Object.fromEntries(
      Object.entries(allStats).filter(([pair]) => {
        const [src, dst] = pair.split('-');
        return requested.includes(src) && ['irt', 'rls'].includes(dst);
      })
    ) as NobitexStats;
    const usdtStats = allStats['usdt-irt'] || allStats['usdt-rls'];
    return { stats: selectedStats, usdtIrr: numberOrNull(usdtStats?.latest) };
  } catch (error) {
    console.warn('[crypto] Nobitex unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function loadBinancePrices(symbols: string[]): Promise<Map<string, number>> {
  try {
    const data = await fetchJson<Array<{ symbol: string; price: string }>>(
      `${binanceBaseUrl()}/ticker/price`,
      undefined,
      ENRICHMENT_TIMEOUT_MS
    );
    const wanted = new Set(symbols.map((symbol) => `${symbol.toUpperCase()}USDT`));
    return new Map(
      data
        .filter((item) => wanted.has(item.symbol))
        .map((item) => [item.symbol.replace(/USDT$/, ''), numberOrZero(item.price)])
    );
  } catch (error) {
    console.warn('[crypto] Binance unavailable:', error instanceof Error ? error.message : error);
    return new Map();
  }
}

function applyNobitexPrices(
  asset: CryptoMarketAsset,
  nobitex: { stats: NobitexStats; usdtIrr: number | null }
): CryptoMarketAsset {
  const symbol = asset.symbol.toLowerCase();
  const directPair = nobitex.stats[`${symbol}-irt`]
    ? `${symbol}-irt`
    : nobitex.stats[`${symbol}-rls`]
      ? `${symbol}-rls`
      : null;
  const stats = directPair ? nobitex.stats[directPair] : undefined;
  const directLocalPrice = numberOrNull(stats?.latest);
  const directIrr =
    directLocalPrice === null
      ? null
      : directPair?.endsWith('-irt')
        ? directLocalPrice * 10
        : directLocalPrice;
  const usdtIrr = nobitex.usdtIrr;
  const priceIrr =
    directIrr ?? (usdtIrr && asset.priceUsd ? asset.priceUsd * usdtIrr : null);
  return {
    ...asset,
    priceIrr,
    priceIrt: priceIrr === null ? null : priceIrr / 10,
    sources: {
      ...asset.sources,
      local:
        directIrr !== null ? 'nobitex-direct' : priceIrr !== null ? 'nobitex-usdt' : null,
    },
  };
}

function applyBinancePrices(
  asset: CryptoMarketAsset,
  prices: Map<string, number>
): CryptoMarketAsset {
  const fastPrice = prices.get(asset.symbol);
  if (!fastPrice) return asset;
  return {
    ...asset,
    priceUsd: fastPrice,
    sources: { ...asset.sources, price: 'binance' },
  };
}

function nobitexPairPrice(stats: NobitexStats, symbol: string) {
  const key = symbol.toLowerCase();
  const irtPair = stats[`${key}-irt`];
  const rlsPair = stats[`${key}-rls`];
  const pair = irtPair || rlsPair;
  if (!pair) {
    return {
      priceIrt: null as number | null,
      priceIrr: null as number | null,
      change24h: 0,
      volumeSrc: null as number | null,
      dayLow: null as number | null,
      dayHigh: null as number | null,
    };
  }
  const latest = numberOrNull(pair.latest);
  const isIrt = Boolean(irtPair);
  const priceIrt = latest === null ? null : isIrt ? latest : latest / 10;
  const priceIrr = priceIrt === null ? null : priceIrt * 10;
  const dayLowRaw = numberOrNull(pair.dayLow);
  const dayHighRaw = numberOrNull(pair.dayHigh);
  return {
    priceIrt,
    priceIrr,
    change24h: numberOrZero(pair.dayChange),
    volumeSrc: numberOrNull(pair.volumeSrc),
    dayLow: dayLowRaw === null ? null : isIrt ? dayLowRaw : dayLowRaw / 10,
    dayHigh: dayHighRaw === null ? null : isIrt ? dayHighRaw : dayHighRaw / 10,
  };
}

async function loadNobitexMarket(): Promise<MarketSnapshot | null> {
  const catalogueSymbols = NOBITEX_FALLBACK_ASSETS.map((asset) => asset.symbol);
  const nobitex = await loadNobitexStats(catalogueSymbols);
  if (!nobitex) return null;

  const usdtIrt = nobitex.usdtIrr;
  const built = NOBITEX_FALLBACK_ASSETS.map((meta) => {
    const local = nobitexPairPrice(nobitex.stats, meta.symbol);
    const priceUsd =
      meta.symbol === 'USDT'
        ? 1
        : local.priceIrt !== null && usdtIrt
          ? local.priceIrt / usdtIrt
          : 0;
    if (meta.symbol !== 'USDT' && (!local.priceIrt || !usdtIrt)) return null;
    const asset: CryptoMarketAsset = {
      id: meta.id,
      name: meta.name,
      symbol: meta.symbol,
      imageUrl: null,
      rank: meta.rank,
      priceUsd,
      priceIrr: local.priceIrr,
      priceIrt: local.priceIrt,
      change24h: local.change24h,
      change7d: 0,
      change30d: 0,
      volume24h: local.volumeSrc ?? 0,
      marketCap: 0,
      fullyDilutedValuation: null,
      high24h: local.dayHigh !== null && usdtIrt ? local.dayHigh / usdtIrt : null,
      low24h: local.dayLow !== null && usdtIrt ? local.dayLow / usdtIrt : null,
      athUsd: null,
      athChangePercentage: null,
      athDate: null,
      atlUsd: null,
      circulatingSupply: null,
      totalSupply: null,
      maxSupply: null,
      sparkline: [],
      sources: {
        market: 'nobitex',
        price: 'nobitex',
        local: local.priceIrr !== null ? 'nobitex-direct' : null,
      },
    };
    return asset;
  }).filter((asset): asset is CryptoMarketAsset => asset !== null);

  if (!built.length) return null;

  const btc = built.find((asset) => asset.symbol === 'BTC');
  return {
    assets: built,
    global: {
      marketCap: 0,
      volume24h: built.reduce((sum, asset) => sum + asset.volume24h, 0),
      btcDominance: 0,
      marketCapChange24h: btc?.change24h ?? 0,
      activeCryptocurrencies: built.length,
      source: 'nobitex',
    },
    providers: {
      ...emptyProviders(),
      nobitex: 'live',
    },
  };
}

function pickGlobal(
  sources: Array<{ global: CryptoGlobalMarket } | null>
): CryptoGlobalMarket {
  for (const source of sources) {
    if (source?.global && source.global.marketCap > 0) return source.global;
  }
  for (const source of sources) {
    if (source?.global) return source.global;
  }
  return emptyMarketSnapshot().global;
}

async function buildCatalogueSnapshot(): Promise<MarketSnapshot> {
  // Hit free providers in parallel — whichever answers on an IR host wins.
  const [coinGecko, coinPaprika, coinLore, coinCap] = await Promise.all([
    loadCoinGecko(),
    loadCoinPaprika(),
    loadCoinLore(),
    loadCoinCap(),
  ]);

  const merged = mergeBySymbol([
    coinGecko?.assets || [],
    coinCap?.assets || [],
    coinPaprika?.assets || [],
    coinLore?.assets || [],
  ]);

  const providers = emptyProviders();
  providers.coingecko = coinGecko ? 'live' : 'unavailable';
  providers.coinpaprika = coinPaprika ? 'live' : 'unavailable';
  providers.coinlore = coinLore ? 'live' : 'unavailable';
  providers.coincap = coinCap ? 'live' : 'unavailable';

  if (!merged.length) {
    const nobitexOnly = await loadNobitexMarket();
    if (nobitexOnly) {
      console.warn('[crypto] Serving Nobitex-only snapshot; all USD market APIs failed');
      return nobitexOnly;
    }
    console.warn('[crypto] All market providers unavailable');
    return emptyMarketSnapshot();
  }

  const symbols = merged.map((asset) => asset.symbol);
  const [binancePrices, nobitex] = await Promise.all([
    loadBinancePrices(symbols),
    loadNobitexStats(symbols),
  ]);

  providers.binance = binancePrices.size ? 'live' : 'standby';
  providers.nobitex = nobitex ? 'live' : 'unavailable';

  const assets = merged.map((asset) => {
    const withPrice = applyBinancePrices(asset, binancePrices);
    return nobitex ? applyNobitexPrices(withPrice, nobitex) : withPrice;
  });

  const primarySource: MarketDataSource = coinGecko
    ? 'coingecko'
    : coinCap
      ? 'coincap'
      : coinPaprika
        ? 'coinpaprika'
        : coinLore
          ? 'coinlore'
          : 'nobitex';

  return {
    assets,
    global: {
      ...pickGlobal([coinGecko, coinCap, coinPaprika, coinLore]),
      source: primarySource,
    },
    providers,
  };
}

async function refreshCatalogue(force = false): Promise<MarketSnapshot> {
  const now = Date.now();
  if (!force && catalogueCache && catalogueCache.expiresAt > now) {
    return catalogueCache.value;
  }

  if (!catalogueInflight) {
    catalogueInflight = buildCatalogueSnapshot()
      .then((snapshot) => {
        const stamped = Date.now();
        catalogueCache = {
          expiresAt: stamped + CACHE_TTL_MS,
          staleUntil: stamped + STALE_CACHE_TTL_MS,
          value: snapshot,
        };
        return snapshot;
      })
      .catch((error) => {
        if (catalogueCache && catalogueCache.staleUntil > Date.now()) {
          console.warn('[crypto] Serving stale catalogue after refresh failure');
          return catalogueCache.value;
        }
        throw error;
      })
      .finally(() => {
        catalogueInflight = null;
      });
  }

  try {
    return await catalogueInflight;
  } catch (error) {
    console.warn(
      '[crypto] Catalogue refresh failed:',
      error instanceof Error ? error.message : error
    );
    return emptyMarketSnapshot();
  }
}

/** Keep the snapshot warm on long-lived Node processes (pm2 / VPS). */
export function ensureCryptoMarketWarmer() {
  if (warmerStarted || typeof setInterval === 'undefined') return;
  if (process.env.NODE_ENV === 'test') return;
  warmerStarted = true;
  void refreshCatalogue(true).catch(() => undefined);
  const timer = setInterval(() => {
    void refreshCatalogue(true).catch(() => undefined);
  }, WARMER_INTERVAL_MS);
  // Don't keep the Node process alive just for the warmer (tests / one-shot scripts).
  if (typeof timer.unref === 'function') timer.unref();
}

export async function getCryptoMarketData(options?: {
  ids?: string[];
  symbols?: string[];
  limit?: number;
  page?: number;
  forceRefresh?: boolean;
}): Promise<CryptoMarketResponse> {
  ensureCryptoMarketWarmer();
  const { ids, symbols, limit, page } = assetRequestOptions(options);
  const snapshot = await refreshCatalogue(Boolean(options?.forceRefresh));
  const filtered = filterAssets(snapshot.assets, ids, symbols);
  const pageAssets = takePage(filtered, limit, page);

  return {
    generatedAt: new Date().toISOString(),
    currency: 'USD',
    assets: pageAssets,
    global: snapshot.global,
    providers: snapshot.providers,
    pagination: buildPagination(page, limit, filtered.length),
  };
}

export function parseCryptoMarketQuery(searchParams: URLSearchParams) {
  return {
    ids: toQueryList(searchParams.get('ids'), DEFAULT_ASSET_IDS),
    symbols: toQueryList(searchParams.get('symbols'), DEFAULT_SYMBOLS),
    limit: toLimit(searchParams.get('limit')),
    page: toPage(searchParams.get('page')),
    forceRefresh: searchParams.get('refresh') === '1',
  };
}

export { DEFAULT_ASSET_IDS, DEFAULT_SYMBOLS, DEFAULT_MARKET_LIMIT, CATALOGUE_SIZE };
