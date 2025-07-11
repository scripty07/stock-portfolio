import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  AutocompleteAsync,
  type Option,
} from '../../components/AutocompleteAsync';
import {
  fetchStocksBySearch,
  fetchStockSearchQueryKey,
} from '../../services/useStockSearch';
import { useStockStore } from '../../store/stockStore';

export const StockSearch = () => {
  const queryClient = useQueryClient();
  const setSearchedStock = useStockStore((state) => state.setSearchedStock);

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
