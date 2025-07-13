import { useQuery } from '@tanstack/react-query';

import type { StockSearchResponse } from './types';
import type { Option } from '../../components/AutocompleteAsync/types';
import { TICKER_BASE_URL, TICKER_ENDPOINTS } from '../../constants/endpoints';
import { STOCK_SEARCH } from '../../constants/queryKeys';
import { getAuthHeader } from '../../utils/service';

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
