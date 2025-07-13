import { renderHook } from '@testing-library/react';

import { useComputeProjection } from '../index';
import type { ComputeProjectionProps } from '../types';

const baseProps = {
  selectedStock: {
    id: 'AAPL',
    name: 'Apple Inc.',
    price: 200,
    currency: 'usd',
    allocation: 10000,
  },
  pastStockPortfolio: {
    id: 'AAPL',
    name: 'Apple Inc.',
    price: 100,
    currency: 'usd',
  },
  selectedProjection: '3Y',
};

describe('useComputeProjection', () => {
  it('should return correct projected amount and growth for valid data', () => {
    const { result } = renderHook(() => useComputeProjection(baseProps));

    const expectedProjected = 10000 * Math.pow(200 / 100, 3); // 10000 * 8 = 80000
    const expectedGrowth = expectedProjected - 10000;
    const expectedPercent = (expectedGrowth / 10000) * 100;

    expect(result.current.projectedAmount).toBeCloseTo(expectedProjected, 2);
    expect(result.current.projectedGrowth).toBeCloseTo(expectedGrowth, 2);
    expect(result.current.projectedGrowthPercent).toBeCloseTo(
      expectedPercent,
      2
    );
  });

  it('should return 0s if selectedStock is undefined', () => {
    const { result } = renderHook(() =>
      useComputeProjection({
        ...baseProps,
        selectedStock: undefined,
      } as any)
    );

    expect(result.current.projectedAmount).toBe(0);
    expect(result.current.projectedGrowth).toBe(0);
    expect(result.current.projectedGrowthPercent).toBe(0);
  });

  it('should return 0s if pastStockPortfolio is undefined', () => {
    const { result } = renderHook(() =>
      useComputeProjection({
        ...baseProps,
        pastStockPortfolio: undefined,
      } as any)
    );

    expect(result.current.projectedAmount).toBe(0);
    expect(result.current.projectedGrowth).toBe(0);
    expect(result.current.projectedGrowthPercent).toBe(0);
  });

  it('should return 0s if selectedProjection is undefined', () => {
    const { result } = renderHook(() =>
      useComputeProjection({
        ...baseProps,
        selectedProjection: undefined,
      } as any)
    );

    expect(result.current.projectedAmount).toBe(0);
    expect(result.current.projectedGrowth).toBe(0);
    expect(result.current.projectedGrowthPercent).toBe(0);
  });

  it('should fallback to 1 if past price is 0 (to prevent divide by zero)', () => {
    const props: ComputeProjectionProps = {
      ...baseProps,
      pastStockPortfolio: {
        ...baseProps.pastStockPortfolio,
        price: 0,
      },
    };

    const { result } = renderHook(() => useComputeProjection(props));

    const expectedProjected = 10000 * Math.pow(200 / 1, 3); // 10000 * 8_000_000
    expect(result.current.projectedAmount).toBeCloseTo(expectedProjected, 2);
  });

  it('should return 0 projected growth if allocation is 0', () => {
    const props: ComputeProjectionProps = {
      ...baseProps,
      selectedStock: {
        ...baseProps.selectedStock,
        allocation: 0,
      },
    };

    const { result } = renderHook(() => useComputeProjection(props));

    expect(result.current.projectedAmount).toBe(0);
    expect(result.current.projectedGrowth).toBe(0);
    expect(result.current.projectedGrowthPercent).toBe(0);
  });

  it('should default to 1 year projection if string is invalid', () => {
    const props: ComputeProjectionProps = {
      ...baseProps,
      selectedProjection: 'abc', // invalid string
    };

    const { result } = renderHook(() => useComputeProjection(props));

    const expectedProjected = 10000 * Math.pow(200 / 100, 1); // 10000 * 2 = 20000
    expect(result.current.projectedAmount).toBeCloseTo(expectedProjected, 2);
  });

  it('should handle decimal precision correctly', () => {
    const props: ComputeProjectionProps = {
      ...baseProps,
      selectedStock: {
        ...baseProps.selectedStock,
        price: 123.456,
      },
      pastStockPortfolio: {
        ...baseProps.pastStockPortfolio,
        price: 100,
      },
      selectedProjection: '2Y',
    };

    const annualRate = 123.456 / 100;
    const expectedProjected = 10000 * Math.pow(annualRate, 2);

    const { result } = renderHook(() => useComputeProjection(props));

    expect(result.current.projectedAmount).toBeCloseTo(expectedProjected, 2);
  });
});
