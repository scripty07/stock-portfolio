import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { PiTrendUp } from 'react-icons/pi';
import { RiDeleteBin5Line } from 'react-icons/ri';

import type { GetPortfolioColumnProps } from './types';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import type { PortfolioItem } from '../../typings/portfolio';

export const useGetPortfolioColumns = (props: GetPortfolioColumnProps) => {
  const { loading, setSelectedStock } = props;

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

          return price.toLocaleString('en-US', {
            style: 'currency',
            currency: info.row.original.currency,
          });
        },
        enableSorting: !loading,
      },
      {
        accessorKey: 'allocation',
        header: 'Allocations',
        cell: (info) => {
          const allocation = info.getValue() as number | undefined;

          if (!allocation) {
            return 'N.A';
          }

          return allocation.toLocaleString('en-US', {
            style: 'currency',
            currency: info.row.original.currency,
          });
        },
        enableSorting: !loading,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-3">
            <button
              className="text-sm flex gap-2 items-center bg-blue-500 hover:bg-blue-400 cursor-pointer text-white p-2 rounded"
              onClick={() => setSelectedStock(row.original)}
            >
              Invest <PiTrendUp />
            </button>
            <button
              className="text-red-500 cursor-pointer p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              onClick={() => removeStock(row.original.id)}
            >
              <RiDeleteBin5Line size="1rem" />
            </button>
          </div>
        ),
      },
    ],
    [loading, setSelectedStock, removeStock]
  );

  return { columns };
};
