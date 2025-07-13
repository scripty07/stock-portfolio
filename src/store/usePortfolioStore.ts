import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PortfolioStore } from './types';

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      // Values
      stocks: [],
      searchedStock: null,
      selectedStock: null,
      isInitialLoad: true,

      // Actions
      resetInitialLoad: () => {
        set({ isInitialLoad: false });
      },
      setSearchedStock: (searchedStock) => {
        set({ searchedStock });
      },
      setSelectedStock: (selectedStockId) => {
        set({ selectedStock: selectedStockId });
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

          let selectedStock = get().selectedStock;

          if (!!selectedStock && selectedStock.id === stock.id) {
            selectedStock = stock;
          }

          set({
            selectedStock,
            searchedStock: null,
            stocks: updatedStocks,
          });
        }
      },
      removeStock: (id) => {
        let selectedStock = get().selectedStock;

        if (selectedStock?.id === id) {
          selectedStock = null;
        }

        set({
          selectedStock,
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
