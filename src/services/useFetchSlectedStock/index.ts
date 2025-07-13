import { useQuery } from '@tanstack/react-query';

import type { FetchSelectedStockResponse, SelectedStockDetail } from './types';
import { TICKER_BASE_URL, TICKER_ENDPOINTS } from '../../constants/endpoints';
import { SELECTED_STOCK } from '../../constants/queryKeys';
import { getAuthHeader } from '../../utils/service';

export const fetchSelectedStockQueryKey = (
  stockId: string,
  selectedDate?: Date
) => [SELECTED_STOCK, stockId, selectedDate?.toDateString()];

export const fetchSelectedStock = async (
  stockId: string,
  selectedDate?: Date
): Promise<SelectedStockDetail> => {
  const formattedDate = selectedDate?.toISOString().split('T')[0]; // YYYY-MM-DD
  const date = !!formattedDate ? `?date=${formattedDate}` : '';

  const res = await fetch(
    `${TICKER_BASE_URL}/${TICKER_ENDPOINTS.TICKERS}/${stockId}${date}`,
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

export const useFetchSelectedStock = (symbol: string, selectedDate?: Date) => {
  return useQuery({
    queryKey: fetchSelectedStockQueryKey(symbol, selectedDate),
    queryFn: () => fetchSelectedStock(symbol, selectedDate),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5, // 5 min,
    refetchOnWindowFocus: false,
  });
};
