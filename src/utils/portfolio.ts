import type { SortingState } from '@tanstack/react-table';

import type { SelectedStockDetail } from '../services/useFetchSlectedStock/types';
import type { PortfolioItem } from '../typings/portfolio';

export const getTotalInvested = (stocks: Array<PortfolioItem>) => {
  return stocks.reduce(
    (total: number, stock: PortfolioItem) => total + (stock.allocation ?? 0),
    0
  );
};

export const createPortfolioItem = (stockDetails: SelectedStockDetail) => {
  const stockPrice = Number(
    (
      (stockDetails?.market_cap ?? 0) /
      (stockDetails?.weighted_shares_outstanding ?? 1)
    ).toFixed(2)
  );

  const desiredStockDetails: PortfolioItem = {
    id: stockDetails.ticker,
    name: stockDetails.name,
    currency: stockDetails.currency_name,
    price: stockPrice,
  };

  return desiredStockDetails;
};

export const getSortedStocks = (
  stocks: Array<PortfolioItem>,
  sorting: SortingState
) => {
  if (!sorting.length) {
    return stocks;
  }

  const sortedStocks = [...stocks];
  const isDescending = sorting[0].desc;
  const sortingKey = sorting[0].id as keyof PortfolioItem;

  return sortedStocks.sort((a, b) => {
    const valueA = a?.[sortingKey];
    const valueB = b?.[sortingKey];

    if (typeof valueA === 'undefined' || typeof valueB === 'undefined') {
      return 0;
    }

    // If valueA is number then valueB will be number as both are refering to same key
    if (typeof valueA === 'number') {
      return isDescending
        ? (valueB as number) - valueA
        : valueA - (valueB as number);
    }

    return isDescending
      ? (valueB as string).localeCompare(valueA as string)
      : valueA.localeCompare(valueB as string);
  });
};
