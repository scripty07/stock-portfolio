import { useQuery } from '@tanstack/react-query';

import type { Option } from '../components/AutocompleteAsync';
import { TICKER_BASE_URL, TICKER_ENDPOINTS } from '../constants/endpoints';
import { STOCK_SEARCH } from '../constants/queryKeys';
import { getAuthHeader } from '../utils/service';

export interface StockDetail {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  composite_figi: string;
  share_class_figi: string;
  last_updated_utc: string;
  cik?: string;
}

interface StockSearchResponse {
  results: StockDetail[];
  status: string;
  request_id: string;
  count: number;
  next_url: string;
}

export const fetchStockSearchQueryKey = (query: string) => [
  STOCK_SEARCH,
  query,
];

export const fetchStocksBySearch = async (
  symbol: string
): Promise<Option[]> => {
  const options = {
    sort: 'ticker',
    order: 'asc',
    limit: '10',
    market: 'stocks',
    active: 'true',
    search: symbol,
  };

  const params = new URLSearchParams(options);
  const queryString = params.toString();

  const res = await fetch(
    `${TICKER_BASE_URL}/${TICKER_ENDPOINTS.TICKERS}?${queryString}`,
    {
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch searched stock');
  }

  const data: StockSearchResponse = await res.json();

  return data.results.map((stock) => {
    return {
      id: stock.ticker,
      label: `${stock.ticker} - ${stock.name}`,
    };
  });
};

export const useStockSearch = (symbol: string) => {
  return useQuery({
    queryKey: fetchStockSearchQueryKey(symbol),
    queryFn: () => fetchStocksBySearch(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5, // 5 min,
    refetchOnWindowFocus: false,
  });
};
