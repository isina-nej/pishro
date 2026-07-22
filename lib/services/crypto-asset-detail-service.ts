import type { CryptoAssetDetailResponse, CryptoMarketAsset } from '@/types/crypto-market';
import { getCryptoMarketData } from '@/lib/services/crypto-market-service';

const REQUEST_TIMEOUT_MS = 5_000;

interface CoinGeckoDetail {
  id: string;
  symbol: string;
  name: string;
  image?: { large?: string };
  market_cap_rank?: number | null;
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    price_change_percentage_24h?: number | null;
    price_change_percentage_7d?: number | null;
    price_change_percentage_30d?: number | null;
    high_24h?: { usd?: number };
    low_24h?: { usd?: number };
    ath?: { usd?: number };
    ath_change_percentage?: { usd?: number };
    ath_date?: { usd?: string };
    atl?: { usd?: number };
    circulating_supply?: number | null;
    total_supply?: number | null;
    max_supply?: number | null;
    fully_diluted_valuation?: { usd?: number | null };
  };
}

function numberOrNull(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

function coingeckoBaseUrl() {
  return process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
}

function mergeDetail(base: CryptoMarketAsset, detail: CoinGeckoDetail): CryptoMarketAsset {
  const data = detail.market_data || {};
  return {
    ...base,
    name: detail.name || base.name,
    symbol: (detail.symbol || base.symbol).toUpperCase(),
    imageUrl: detail.image?.large || base.imageUrl,
    rank: numberOrNull(detail.market_cap_rank) ?? base.rank,
    priceUsd: numberOrNull(data.current_price?.usd) ?? base.priceUsd,
    volume24h: numberOrNull(data.total_volume?.usd) ?? base.volume24h,
    marketCap: numberOrNull(data.market_cap?.usd) ?? base.marketCap,
    fullyDilutedValuation: numberOrNull(data.fully_diluted_valuation?.usd) ?? base.fullyDilutedValuation,
    change24h: numberOrNull(data.price_change_percentage_24h) ?? base.change24h,
    change7d: numberOrNull(data.price_change_percentage_7d) ?? base.change7d,
    change30d: numberOrNull(data.price_change_percentage_30d) ?? base.change30d,
    high24h: numberOrNull(data.high_24h?.usd) ?? base.high24h,
    low24h: numberOrNull(data.low_24h?.usd) ?? base.low24h,
    athUsd: numberOrNull(data.ath?.usd) ?? base.athUsd,
    athChangePercentage: numberOrNull(data.ath_change_percentage?.usd) ?? base.athChangePercentage,
    athDate: data.ath_date?.usd || base.athDate,
    atlUsd: numberOrNull(data.atl?.usd) ?? base.atlUsd,
    circulatingSupply: numberOrNull(data.circulating_supply) ?? base.circulatingSupply,
    totalSupply: numberOrNull(data.total_supply) ?? base.totalSupply,
    maxSupply: numberOrNull(data.max_supply) ?? base.maxSupply,
  };
}

export async function getCryptoAssetDetail(id: string): Promise<CryptoAssetDetailResponse> {
  const market = await getCryptoMarketData({ ids: [id], limit: 1 });
  let asset = market.assets.find((item) => item.id === id) || market.assets[0];
  if (!asset) throw new Error('Crypto asset not found');

  try {
    const detail = await fetchJson<CoinGeckoDetail>(`${coingeckoBaseUrl()}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`);
    asset = mergeDetail(asset, detail);
  } catch (error) {
    console.warn('[crypto] CoinGecko detail unavailable:', error instanceof Error ? error.message : error);
  }

  return {
    generatedAt: new Date().toISOString(),
    asset,
    global: market.global,
    providers: market.providers,
  };
}
