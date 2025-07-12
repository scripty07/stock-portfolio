import { useCallback, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  fetchSelectedStock,
  fetchSelectedStockQueryKey,
} from '../../services/useFetchSlectedStock';
import type { SelectedStockDetail } from '../../services/useFetchSlectedStock/types';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { createPortfolioItem } from '../../utils/portfolio';

/**
 * Fetch the selected stock and add it to portfolio
 */
export const useListenSelectedStock = () => {
  const [loading, setLoading] = useState(false);
  const searchedStock = usePortfolioStore((state) => state.searchedStock);

  const queryClient = useQueryClient();
  const addStock = usePortfolioStore((state) => state.addStock);

  const fetchStock = useCallback(async () => {
    const queryKey = fetchSelectedStockQueryKey(searchedStock ?? '');
    const cached = queryClient.getQueryData<SelectedStockDetail>(queryKey);

    if (cached) {
      return cached;
    }

    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: () => fetchSelectedStock(searchedStock ?? ''),
    });

    return data;
  }, [searchedStock, queryClient]);

  const fetchAndStoreStock = useCallback(async () => {
    setLoading(true);

    try {
      const stockDetails = await fetchStock();
      const desiredStockDetails = createPortfolioItem(stockDetails);

      addStock(desiredStockDetails);
    } catch (e) {
      // TODO: Add tosts
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [addStock, fetchStock]);

  useEffect(() => {
    if (searchedStock) {
      fetchAndStoreStock();
    }
  }, [fetchAndStoreStock, searchedStock]);

  return { loading };
};
