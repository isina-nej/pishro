import type {
  CryptoGlobalMarket,
  CryptoMarketAsset,
  CryptoMarketResponse,
  ProviderStatus,
} from '@/types/crypto-market';

const DEFAULT_ASSET_IDS: string[] = [];
const DEFAULT_SYMBOLS: string[] = [];
const DEFAULT_MARKET_LIMIT = 150;
const REQUEST_TIMEOUT_MS = 12_000;
const CACHE_TTL_MS = 30_000;
const STALE_CACHE_TTL_MS = 10 * 60_000;

type JsonRecord = Record<string, unknown>;

interface CoinGeckoMarketRow {
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
}

interface CoinPaprikaTickerRow {
  id: string;
  symbol: string;
  name: string;
  rank?: number;
  quotes?: { USD?: { price?: number; market_cap?: number; volume_24h?: number; percent_change_24h?: number } };
}

interface NobitexStats {
  [symbol: string]: {
    latest?: string | number;
    bestSell?: string | number;
    bestBuy?: string | number;
    dayChange?: string | number;
    dayLow?: string | number;
    dayHigh?: string | number;
    volumeSrc?: string | number;
  };
}

interface ProviderState {
  coingecko: ProviderStatus;
  binance: ProviderStatus;
  coinpaprika: ProviderStatus;
  nobitex: ProviderStatus;
}

interface MarketSnapshot {
  assets: CryptoMarketAsset[];
  global: CryptoGlobalMarket;
  providers: ProviderState;
}

let cachedSnapshot: { expiresAt: number; staleUntil: number; value: CryptoMarketResponse } | null = null;
let marketRequest: Promise<CryptoMarketResponse> | null = null;

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
  // An absent ?limit must fall through to the default. Testing Number.isInteger
  // first cannot do that: a missing param is null, Number(null) is 0, and
  // Number.isInteger(0) is true — so the default branch was unreachable and
  // Math.max(0, 1) clamped every default request down to a single asset.
  if (!value) return DEFAULT_MARKET_LIMIT;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_MARKET_LIMIT;
  return Math.min(parsed, DEFAULT_MARKET_LIMIT);
}

function coingeckoMarketUrl(limit: number, ids: string[] = []): string {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: String(limit),
    page: '1',
    sparkline: 'true',
    price_change_percentage: '24h,7d,30d',
  });
  if (ids.length) params.set('ids', ids.join(','));
  return `${coingeckoBaseUrl()}/coins/markets?${params}`;
}

function normalizeIdSet(ids: string[]): Set<string> {
  return new Set(ids.map((id) => id.toLowerCase()));
}

function normalizeSymbolSet(symbols: string[]): Set<string> {
  return new Set(symbols.map((symbol) => symbol.toUpperCase()));
}

function selectAssets<T extends { id: string; symbol: string }>(assets: T[], ids: string[], symbols: string[], limit: number): T[] {
  if (!ids.length && !symbols.length) return assets.slice(0, limit);
  const idSet = normalizeIdSet(ids);
  const symbolSet = normalizeSymbolSet(symbols);
  const matched = assets.filter((asset) => idSet.has(asset.id.toLowerCase()) || symbolSet.has(asset.symbol.toUpperCase()));
  // If the requester explicitly asked for an empty list, don't fallback to the limit cut.
  return matched.length ? matched.slice(0, limit) : matched;
}

function imageForAsset(item: { image?: string | null }): string | null {
  return item.image || null;
}

function assetRequestOptions(options?: { ids?: string[]; symbols?: string[]; limit?: number }) {
  const ids = options?.ids || [];
  const symbols = options?.symbols || [];
  return {
    ids,
    symbols,
    limit: options?.limit || DEFAULT_MARKET_LIMIT,
  };
}

function parseJson(text: string): unknown {
  return JSON.parse(text) as unknown;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
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
  return process.env.COINPAPRIKA_API_URL || 'https://api.coinpaprika.com/v1';
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

async function loadCoinGecko(ids: string[], symbols: string[], limit: number): Promise<{ assets: CoinGeckoMarketRow[]; global: CryptoGlobalMarket } | null> {
  const headers = providerHeaders(process.env.COINGECKO_API_KEY);

  try {
    const [markets, global] = await Promise.all([
      fetchJson<CoinGeckoMarketRow[]>(coingeckoMarketUrl(limit, ids), { headers }),
      fetchJson<JsonRecord>(`${coingeckoBaseUrl()}/global`, { headers }),
    ]);
    const data = selectAssets(markets.filter((item) => item?.id), ids, symbols, limit);
    const globalData = (global.data || {}) as JsonRecord;
    const marketCapPercentage = (globalData.market_cap_percentage || {}) as JsonRecord;
    return {
      assets: data,
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

async function loadCoinPaprika(ids: string[], symbols: string[], limit: number): Promise<{ assets: CoinPaprikaTickerRow[]; global: CryptoGlobalMarket } | null> {
  try {
    const [global, tickers] = await Promise.all([
      fetchJson<JsonRecord>(`${coinpaprikaBaseUrl()}/global`),
      fetchJson<CoinPaprikaTickerRow[]>(`${coinpaprikaBaseUrl()}/tickers?quotes=USD`),
    ]);
    const assets = selectAssets(tickers, ids, symbols, limit);
    const globalData = (global as JsonRecord);
    return {
      assets,
      global: {
        marketCap: numberOrZero(globalData.market_cap_usd),
        volume24h: numberOrZero(globalData.volume_24h_usd),
        btcDominance: numberOrZero(globalData.bitcoin_dominance_percentage),
        marketCapChange24h: 0,
        activeCryptocurrencies: numberOrNull(globalData.cryptocurrencies_number),
        source: 'coinpaprika',
      },
    };
  } catch (error) {
    console.warn('[crypto] CoinPaprika unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function loadBinancePrices(symbols: string[]): Promise<Map<string, number>> {
  try {
    const data = await fetchJson<Array<{ symbol: string; price: string }>>(`${binanceBaseUrl()}/ticker/price`);
    const wanted = new Set(symbols.map((symbol) => `${symbol.toUpperCase()}USDT`));
    return new Map(
      data.filter((item) => wanted.has(item.symbol)).map((item) => [item.symbol.replace(/USDT$/, ''), numberOrZero(item.price)])
    );
  } catch (error) {
    console.warn('[crypto] Binance unavailable:', error instanceof Error ? error.message : error);
    return new Map();
  }
}

function normalizeNobitexSymbol(symbol: string): string {
  return symbol.toLowerCase() === 'usdt' ? 'usdt' : symbol.toLowerCase();
}

async function loadNobitexStats(symbols: string[]): Promise<{ stats: NobitexStats; usdtIrr: number | null } | null> {
  try {
    const requested = symbols.map(normalizeNobitexSymbol);
    const stats = await fetchJson<{ stats?: NobitexStats }>(`${nobitexBaseUrl()}/market/stats`);
    const allStats = stats.stats || {};
    const selectedStats = Object.fromEntries(
      Object.entries(allStats).filter(([pair]) => {
        const [src, dst] = pair.split('-');
        return requested.includes(src) && ['irt', 'rls'].includes(dst);
      })
    ) as NobitexStats;
    const usdtStats = allStats['usdt-irt'] || allStats['usdt-rls'];
    const usdtIrr = numberOrNull(usdtStats?.latest);
    return { stats: selectedStats, usdtIrr };
  } catch (error) {
    console.warn('[crypto] Nobitex unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

function coinpaprikaToAsset(item: CoinPaprikaTickerRow): CryptoMarketAsset {
  const quote = item.quotes?.USD || {};
  return {
    id: item.id,
    name: item.name,
    symbol: item.symbol.toUpperCase(),
    imageUrl: null,
    rank: numberOrZero(item.rank),
    priceUsd: numberOrZero(quote.price),
    priceIrr: null,
    priceIrt: null,
    change24h: numberOrZero(quote.percent_change_24h),
    change7d: 0,
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
}

function coingeckoToAsset(item: CoinGeckoMarketRow): CryptoMarketAsset {
  return {
    id: item.id,
    name: item.name,
    symbol: item.symbol.toUpperCase(),
    imageUrl: imageForAsset(item),
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
    sparkline: Array.isArray(item.sparkline_in_7d?.price) ? item.sparkline_in_7d.price.filter((value) => Number.isFinite(value)) : [],
    sources: { market: 'coingecko', price: 'coingecko', local: null },
  };
}

function applyNobitexPrices(asset: CryptoMarketAsset, nobitex: { stats: NobitexStats; usdtIrr: number | null }): CryptoMarketAsset {
  const symbol = asset.symbol.toLowerCase();
  const directPair = nobitex.stats[`${symbol}-irt`] ? `${symbol}-irt` : nobitex.stats[`${symbol}-rls`] ? `${symbol}-rls` : null;
  const stats = directPair ? nobitex.stats[directPair] : undefined;
  const directLocalPrice = numberOrNull(stats?.latest);
  const directIrr = directLocalPrice === null ? null : directPair?.endsWith('-irt') ? directLocalPrice * 10 : directLocalPrice;
  const usdtIrr = nobitex.usdtIrr;
  const priceIrr = directIrr ?? (usdtIrr && asset.priceUsd ? asset.priceUsd * usdtIrr : null);
  return {
    ...asset,
    priceIrr,
    priceIrt: priceIrr === null ? null : priceIrr / 10,
    sources: { ...asset.sources, local: directIrr !== null ? 'nobitex-direct' : priceIrr !== null ? 'nobitex-usdt' : null },
  };
}

function applyBinancePrices(asset: CryptoMarketAsset, prices: Map<string, number>): CryptoMarketAsset {
  const fastPrice = prices.get(asset.symbol);
  if (!fastPrice) return asset;
  return { ...asset, priceUsd: fastPrice, sources: { ...asset.sources, price: 'binance' } };
}

async function loadSnapshot(ids: string[], symbols: string[], limit: number): Promise<MarketSnapshot> {
  const coinGecko = await loadCoinGecko(ids, symbols, limit);
  const coinPaprika = coinGecko ? null : await loadCoinPaprika(ids, symbols, limit);
  const market = coinGecko || coinPaprika;
  if (!market) throw new Error('No crypto market provider is available');

  const baseAssets = coinGecko
    ? coinGecko.assets.map(coingeckoToAsset)
    : (coinPaprika?.assets || []).map(coinpaprikaToAsset);
  const requestedSymbols = baseAssets.map((asset) => asset.symbol);
  const [binancePrices, nobitex] = await Promise.all([
    loadBinancePrices(requestedSymbols),
    loadNobitexStats(requestedSymbols),
  ]);
  const assets = baseAssets.map((asset) => {
    const withFastPrice = applyBinancePrices(asset, binancePrices);
    return nobitex ? applyNobitexPrices(withFastPrice, nobitex) : withFastPrice;
  });

  return {
    assets,
    global: market.global,
    providers: {
      coingecko: coinGecko ? 'live' : 'unavailable',
      binance: binancePrices.size ? 'live' : 'standby',
      coinpaprika: coinGecko ? 'standby' : 'live',
      nobitex: nobitex ? 'live' : 'unavailable',
    },
  };
}

async function refreshCryptoMarketData(options?: { ids?: string[]; symbols?: string[]; limit?: number }): Promise<CryptoMarketResponse> {
  const { ids, symbols, limit } = assetRequestOptions(options);
  const snapshot = await loadSnapshot(ids, symbols, limit);
  const value: CryptoMarketResponse = { generatedAt: new Date().toISOString(), currency: 'USD', ...snapshot };
  const now = Date.now();
  cachedSnapshot = { expiresAt: now + CACHE_TTL_MS, staleUntil: now + STALE_CACHE_TTL_MS, value };
  return value;
}

export async function getCryptoMarketData(options?: { ids?: string[]; symbols?: string[]; limit?: number; forceRefresh?: boolean }): Promise<CryptoMarketResponse> {
  const now = Date.now();
  if (!options?.forceRefresh && cachedSnapshot && cachedSnapshot.expiresAt > now) return cachedSnapshot.value;

  // Coalesce the two initial client fetches and periodic refreshes into one upstream request.
  if (!marketRequest) {
    marketRequest = refreshCryptoMarketData(options).finally(() => {
      marketRequest = null;
    });
  }

  try {
    return await marketRequest;
  } catch (error) {
    if (cachedSnapshot && cachedSnapshot.staleUntil > now) {
      console.warn('[crypto] Serving stale market cache after provider failure');
      return cachedSnapshot.value;
    }
    throw error;
  }
}

export function parseCryptoMarketQuery(searchParams: URLSearchParams) {
  return {
    ids: toQueryList(searchParams.get('ids'), DEFAULT_ASSET_IDS),
    symbols: toQueryList(searchParams.get('symbols'), DEFAULT_SYMBOLS),
    limit: toLimit(searchParams.get('limit')),
    forceRefresh: searchParams.get('refresh') === '1',
  };
}

export { DEFAULT_ASSET_IDS, DEFAULT_SYMBOLS, DEFAULT_MARKET_LIMIT };
