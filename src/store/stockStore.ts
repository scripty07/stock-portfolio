import { create } from 'zustand';

interface StockStoreState {
  searchedStock: string | null;
  setSearchedStock: (stock: string) => void;
}

export const useStockStore = create<StockStoreState>((set) => ({
  searchedStock: null,
  setSearchedStock: (stock) => set({ searchedStock: stock }),
}));
