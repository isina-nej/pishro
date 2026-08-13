export type MarketDataSource =
  | 'coingecko'
  | 'coinpaprika'
  | 'coinlore'
  | 'coincap'
  | 'nobitex'
  | 'bitpin'
  | 'wallex';
export type PriceDataSource = 'binance' | MarketDataSource;
export type LocalPriceSource = 'nobitex-direct' | 'nobitex-usdt' | 'bitpin' | 'wallex' | null;
export type ProviderStatus = 'live' | 'fallback' | 'standby' | 'unavailable';

export interface CryptoMarketAsset {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
  rank: number;
  priceUsd: number;
  priceIrr: number | null;
  priceIrt: number | null;
  change24h: number;
  change7d: number;
  change30d: number;
  volume24h: number;
  marketCap: number;
  fullyDilutedValuation: number | null;
  high24h: number | null;
  low24h: number | null;
  athUsd: number | null;
  athChangePercentage: number | null;
  athDate: string | null;
  atlUsd: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  sparkline: number[];
  sources: {
    market: MarketDataSource;
    price: PriceDataSource;
    local: LocalPriceSource;
  };
}

export interface CryptoGlobalMarket {
  marketCap: number;
  volume24h: number;
  btcDominance: number;
  marketCapChange24h: number;
  activeCryptocurrencies: number | null;
  source: MarketDataSource;
}

export interface CryptoMarketPagination {
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CryptoMarketResponse {
  generatedAt: string;
  currency: 'USD';
  global: CryptoGlobalMarket;
  assets: CryptoMarketAsset[];
  pagination: CryptoMarketPagination;
  providers: {
    coingecko: ProviderStatus;
    binance: ProviderStatus;
    coinpaprika: ProviderStatus;
    coinlore: ProviderStatus;
    coincap: ProviderStatus;
    nobitex: ProviderStatus;
    bitpin: ProviderStatus;
    wallex: ProviderStatus;
  };
}

export interface CryptoAssetDetailResponse {
  generatedAt: string;
  asset: CryptoMarketAsset;
  global: CryptoGlobalMarket;
  providers: CryptoMarketResponse['providers'];
}
