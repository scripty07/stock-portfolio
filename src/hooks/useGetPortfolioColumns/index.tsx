import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { PiTrendUp } from 'react-icons/pi';
import { RiDeleteBin5Line } from 'react-icons/ri';

import type { GetPortfolioColumnProps } from './types';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import type { PortfolioItem } from '../../typings/portfolio';
import { getFormattedCurrency } from '../../utils/format';

export const useGetPortfolioColumns = (props: GetPortfolioColumnProps) => {
  const { loading, setStockToInvest } = props;

  const removeStock = usePortfolioStore((state) => state.removeStock);

  const columns = useMemo<ColumnDef<PortfolioItem>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => 'Ticker Symbol',
        cell: (info) => info.getValue(),
        enableSorting: !loading,
      },
      {
        accessorKey: 'name',
        header: () => 'Company Name',
        cell: (info) => info.getValue(),
        enableSorting: !loading,
      },
      {
        accessorKey: 'price',
        header: 'Last Closing Price',
        cell: (info) => {
          const price = info.getValue() as number;

          return getFormattedCurrency(price, info.row.original.currency);
        },
        enableSorting: !loading,
      },
      {
        accessorKey: 'allocation',
        header: 'Allocations',
        cell: (info) => {
          const allocation = (info.getValue() as number) ?? 0;

          return getFormattedCurrency(allocation, info.row.original.currency);
        },
        enableSorting: !loading,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-3">
            <button
              className="text-sm flex gap-2 items-center bg-blue-500 hover:bg-blue-400 cursor-pointer text-white p-2 rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                setStockToInvest(row.original);
              }}
            >
              Invest <PiTrendUp />
            </button>
            <button
              className="text-red-500 cursor-pointer p-2 bg-red-100 rounded-xl hover:bg-red-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                removeStock(row.original.id);
              }}
            >
              <RiDeleteBin5Line size="1rem" />
            </button>
          </div>
        ),
      },
    ],
    [loading, setStockToInvest, removeStock]
  );

  return { columns };
};
