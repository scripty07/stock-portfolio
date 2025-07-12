import type { PortfolioItem } from '../../typings/portfolio';

export interface GetPortfolioColumnProps {
  loading: boolean;
  setSelectedStock: React.Dispatch<React.SetStateAction<PortfolioItem | null>>;
}
