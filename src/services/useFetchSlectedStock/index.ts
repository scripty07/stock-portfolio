import { useQuery } from '@tanstack/react-query';

import type { FetchSelectedStockResponse, SelectedStockDetail } from './types';
import { TICKER_BASE_URL, TICKER_ENDPOINTS } from '../../constants/endpoints';
import { SELECTED_STOCK } from '../../constants/queryKeys';
import { getAuthHeader } from '../../utils/service';

export const fetchSelectedStockQueryKey = (stockId: string) => [
  SELECTED_STOCK,
  stockId,
];

export const fetchSelectedStock = async (
  stockId: string
): Promise<SelectedStockDetail> => {
  const res = await fetch(
    `${TICKER_BASE_URL}/${TICKER_ENDPOINTS.TICKERS}/${stockId}`,
    {
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch selected stock');
  }

  const data: FetchSelectedStockResponse = await res.json();

  return data.results;
};

export const useFetchSelectedStock = (symbol: string) => {
  return useQuery({
    queryKey: fetchSelectedStockQueryKey(symbol),
    queryFn: () => fetchSelectedStock(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5, // 5 min,
    refetchOnWindowFocus: false,
  });
};
