import type { PortfolioItem } from '../typings/portfolio';

export interface PortfolioStore {
  isInitialLoad: boolean;
  stocks: PortfolioItem[];
  searchedStock: string | null;
  selectedStock: PortfolioItem | null;
  addStock: (stock: PortfolioItem) => void;
  updateStock: (stock: PortfolioItem) => void;
  removeStock: (id: string) => void;
  setSearchedStock: (stock: string) => void;
  setSelectedStock: (stock: PortfolioItem | null) => void;
  resetInitialLoad: () => void;
}
