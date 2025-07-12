import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PortfolioItem } from '../typings/portfolio';

interface PortfolioStore {
  isInitialLoad: boolean;
  stocks: PortfolioItem[];
  searchedStock: string | null;
  addStock: (stock: PortfolioItem) => void;
  updateStock: (stock: PortfolioItem) => void;
  removeStock: (id: string) => void;
  setSearchedStock: (stock: string) => void;
  resetInitialLoad: () => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      // Values
      stocks: [],
      searchedStock: null,
      isInitialLoad: true,

      // Actions
      resetInitialLoad: () => {
        set({ isInitialLoad: false });
      },
      setSearchedStock: (searchedStock) => {
        set({ searchedStock });
      },
      addStock: (stock) => {
        const existing = get().stocks.find((s) => s.id === stock.id);
        if (!existing) {
          set({ searchedStock: null, stocks: [...get().stocks, stock] });
        }
      },
      updateStock: (stock) => {
        const existingStockIndex = get().stocks.findIndex(
          (s) => s.id === stock.id
        );

        if (existingStockIndex !== -1) {
          const updatedStocks = [...get().stocks];
          updatedStocks[existingStockIndex] = stock;

          set({
            searchedStock: null,
            stocks: updatedStocks,
          });
        }
      },
      removeStock: (id) => {
        set({
          searchedStock: null,
          stocks: get().stocks.filter((s) => s.id !== id),
        });
      },
    }),
    {
      name: 'portfolio',
      // Only persist these values in Local Storage
      partialize: (state) => ({
        stocks: state.stocks,
      }),
    }
  )
);
