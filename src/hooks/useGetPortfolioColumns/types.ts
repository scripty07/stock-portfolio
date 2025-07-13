import type { PortfolioItem } from '../../typings/portfolio';

export interface GetPortfolioColumnProps {
  loading: boolean;
  setStockToInvest: React.Dispatch<React.SetStateAction<PortfolioItem | null>>;
}
