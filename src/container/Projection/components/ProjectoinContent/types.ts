import type { PortfolioItem } from '../../../../typings/portfolio';

export interface ProjectionContentProps {
  stocks: Array<PortfolioItem>;
  selectedProjection: string;
}
