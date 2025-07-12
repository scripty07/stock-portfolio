export interface PortfolioItem {
  id: string;
  name: string;
  currency: string;
  price: number;
  allocation?: number;
}
