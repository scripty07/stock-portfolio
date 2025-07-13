import { useMemo } from 'react';

import type { ProjectionContentProps } from './types';
import { useComputeProjection } from '../../../../hooks/useComputeProjection';
import { useFetchSelectedStock } from '../../../../services/useFetchSlectedStock';
import { usePortfolioStore } from '../../../../store/usePortfolioStore';
import { getFormattedCurrency } from '../../../../utils/format';
import { createPortfolioItem } from '../../../../utils/portfolio';

export const ProjectionContent = (props: ProjectionContentProps) => {
  const { selectedProjection } = props;

  const selectedStock = usePortfolioStore((state) => state.selectedStock);
  const currency = selectedStock?.currency;
  const investedAmount = selectedStock?.allocation ?? 0;

  const requiredDate = useMemo(() => {
    const today = new Date();
    const resDate = new Date();
    resDate.setDate(today.getDate() - 365);

    return resDate;
  }, []);

  const { data: pastStockData, isLoading } = useFetchSelectedStock(
    selectedStock?.id ?? '',
    requiredDate
  );

  const pastStockPortfolio = useMemo(() => {
    if (pastStockData) {
      return createPortfolioItem(pastStockData);
    }
  }, [pastStockData]);

  const { projectedAmount, projectedGrowth, projectedGrowthPercent } =
    useComputeProjection({
      selectedStock,
      pastStockPortfolio,
      selectedProjection,
    });

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
        <div className="text-black text-lg animate-pulse">
          Loading projections...
        </div>
      </div>
    );
  }

  if (!selectedStock?.id) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold mb-2">No stock selected</h3>
        <p className="text-gray-600">
          Please select some stock from your portfolio to view projections
        </p>
      </div>
    );
  }

  if (!investedAmount) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold mb-2">No investments found</h3>
        <p className="text-gray-600">Please invest some amount in this stock</p>
      </div>
    );
  }

  if (!isLoading && !pastStockData) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold mb-2">
          Unable to calculate projections
        </h3>
        <p className="text-gray-600">Please try gain after some time</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 p-3 shadow-lg ring-1 ring-black/5 backdrop-blur-lg rounded-xl flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="flex-1">Initial Investment</div>
        <div className="flex flex-1 justify-end">
          {getFormattedCurrency(investedAmount, currency)}
        </div>
      </div>
      <div className="flex gap-2 border-t border-gray-300 pt-3">
        <div className="flex-1">Projected Amount</div>
        <div className="flex flex-1 justify-end">
          {getFormattedCurrency(projectedAmount, currency)}
        </div>
      </div>
      <div className="flex gap-2 border-t border-gray-300 pt-3">
        <div className="flex-1">Potential Gain</div>
        <div className="flex flex-1 justify-end gap-2 items-center">
          <span>{getFormattedCurrency(projectedGrowth, currency)}</span>
          <span
            className={`${projectedGrowth > 0 ? 'text-green-600' : 'text-red-500'} text-xs`}
          >{`${projectedGrowthPercent}%`}</span>
        </div>
      </div>
    </div>
  );
};
