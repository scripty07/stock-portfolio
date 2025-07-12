import { useCallback, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  fetchSelectedStock,
  fetchSelectedStockQueryKey,
} from '../../services/useFetchSlectedStock';
import type { SelectedStockDetail } from '../../services/useFetchSlectedStock/types';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import type { PortfolioItem } from '../../typings/portfolio';
import { createPortfolioItem } from '../../utils/portfolio';

/**
 * Refetch localstorage stocks and update in store
 */
export const useRefreshPortfolio = () => {
  const stocks = usePortfolioStore((state) => state.stocks);
  const isInitialLoad = usePortfolioStore((state) => state.isInitialLoad);
  const resetInitialLoad = usePortfolioStore((state) => state.resetInitialLoad);
  const updateStock = usePortfolioStore((state) => state.updateStock);

  const queryClient = useQueryClient();

  const refreshStock = useCallback(
    async (stock: PortfolioItem) => {
      try {
        let stockData;
        const queryKey = fetchSelectedStockQueryKey(stock.id);
        const cached = queryClient.getQueryData<SelectedStockDetail>(queryKey);

        if (cached) {
          stockData = cached;
        } else {
          const data = await queryClient.fetchQuery({
            queryKey,
            queryFn: () => fetchSelectedStock(stock.id),
          });

          stockData = data;
        }

        const portfolioItem = createPortfolioItem(stockData);
        portfolioItem.allocation = stock.allocation;

        updateStock(portfolioItem);
      } catch (error) {
        console.warn(error);
      } finally {
      }
    },
    [queryClient, updateStock]
  );

  const refreshPortfolio = useCallback(() => {
    stocks.forEach((stock) => {
      refreshStock(stock);
    });
  }, [refreshStock, stocks]);

  useEffect(() => {
    if (isInitialLoad) {
      resetInitialLoad();
      refreshPortfolio();
    }
  }, [isInitialLoad, refreshPortfolio, resetInitialLoad]);
};
