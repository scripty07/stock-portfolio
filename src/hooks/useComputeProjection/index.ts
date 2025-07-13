import { useMemo } from 'react';

import type { ComputeProjectionProps } from './types';

export const useComputeProjection = (props: ComputeProjectionProps) => {
  const { selectedStock, pastStockPortfolio, selectedProjection } = props;
  const investedAmount = selectedStock?.allocation ?? 0;

  const { projectedAmount, amountGain, percentGain } = useMemo(() => {
    if (!selectedStock?.price || !pastStockPortfolio || !selectedProjection) {
      return {
        projectedAmount: 0,
        amountGain: 0,
        percentGain: 0,
      };
    }

    const pastPrice = pastStockPortfolio?.price || 1;
    const currentPrice = selectedStock.price;

    const years = Number(selectedProjection.replace('Y', '')) || 1;
    const annualGrowthRate = currentPrice / pastPrice;

    const projectedAmount = investedAmount * Math.pow(annualGrowthRate, years);
    const amountGain = projectedAmount - investedAmount;
    const percentGain = investedAmount
      ? (amountGain / investedAmount) * 100
      : 0;

    return {
      projectedAmount: Number(projectedAmount.toFixed(2)),
      amountGain: Number(amountGain.toFixed(2)),
      percentGain: Number(percentGain.toFixed(2)),
    };
  }, [
    selectedStock?.price,
    pastStockPortfolio,
    selectedProjection,
    investedAmount,
  ]);

  return {
    projectedAmount,
    projectedGrowth: amountGain,
    projectedGrowthPercent: percentGain,
  };
};
