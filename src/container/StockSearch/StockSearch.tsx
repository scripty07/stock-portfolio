import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { AutocompleteAsync } from '../../components/AutocompleteAsync';
import type { Option } from '../../components/AutocompleteAsync/types';
import {
  fetchStocksBySearch,
  fetchStockSearchQueryKey,
} from '../../services/useStockSearch';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export const StockSearch = () => {
  const queryClient = useQueryClient();
  const setSearchedStock = usePortfolioStore((state) => state.setSearchedStock);

  const fetchSuggestions = useCallback(
    async (query: string): Promise<Option[]> => {
      const queryKey = fetchStockSearchQueryKey(query);

      const cached = queryClient.getQueryData<Option[]>(queryKey);

      if (cached) {
        return cached;
      }

      const data = await queryClient.fetchQuery({
        queryKey,
        queryFn: () => fetchStocksBySearch(query), // direct call since we're inside a wrapper
      });

      return data ?? [];
    },
    [queryClient]
  );

  const handleSelect = (option: Option) => {
    setSearchedStock(option.id);
  };

  return (
    <div className="w-[40vw]">
      <AutocompleteAsync
        placeholder="Search Stocks..."
        fetchSuggestions={fetchSuggestions}
        onSelect={handleSelect}
      />
    </div>
  );
};
