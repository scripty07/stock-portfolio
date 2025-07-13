import type { PortfolioItem } from '../../typings/portfolio';

export interface ComputeProjectionProps {
  selectedStock: PortfolioItem | null;
  pastStockPortfolio?: PortfolioItem;
  selectedProjection: string;
}
