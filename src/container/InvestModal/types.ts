import type { PortfolioItem } from '../../typings/portfolio';

export interface InvestModalProps {
  isVisible: boolean;
  selectedStock: PortfolioItem;
  onSubmit: (stock: PortfolioItem) => void;
  onClose: () => void;
}
