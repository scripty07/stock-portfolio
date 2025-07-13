import { useMemo, useState } from 'react';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

import { useGetPortfolioColumns } from '../../hooks/useGetPortfolioColumns';
import { useListenSelectedStock } from '../../hooks/useListenSelectedStock';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import type { PortfolioItem } from '../../typings/portfolio';
import { getFormattedCurrency } from '../../utils/format';
import { getSortedStocks, getTotalInvested } from '../../utils/portfolio';
import { InvestModal } from '../InvestModal';

export const Portfolio = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { loading } = useListenSelectedStock();

  const [stockToInvest, setStockToInvest] = useState<PortfolioItem | null>(
    null
  );

  const stocks = usePortfolioStore((state) => state.stocks);
  const selectedStock = usePortfolioStore((state) => state.selectedStock);
  const updateStock = usePortfolioStore((state) => state.updateStock);
  const setSelectedStock = usePortfolioStore((state) => state.setSelectedStock);

  const totalInvestments = useMemo(() => getTotalInvested(stocks), [stocks]);
  const { columns } = useGetPortfolioColumns({
    loading,
    setStockToInvest,
  });

  const filteredStocks = useMemo(() => {
    return getSortedStocks(stocks, sorting);
  }, [sorting, stocks]);

  const table = useReactTable({
    data: filteredStocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const submitInvestment = (stock: PortfolioItem) => {
    updateStock(stock);
    closeInvestment();
  };

  const closeInvestment = () => {
    setStockToInvest(null);
  };

  return (
    <div className="p-6 mx-auto relative">
      <div className="flex justify-between items-center gap-2 text-lg font-bold mb-4">
        <h2>My Stock Portfolio</h2>
        <div className="flex gap-2 items-center">
          <h2>Total Investments - </h2>
          <h2 className="text-blue-400">
            {getFormattedCurrency(totalInvestments, stocks[0]?.currency)}
          </h2>
        </div>
      </div>

      {table.getRowModel().rows.length === 0 && !loading ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold mb-2">
            No stocks in your portfolio
          </h3>
          <p className="text-gray-600">
            Please search and select stocks to add in portfolio
          </p>
        </div>
      ) : (
        <div className="relative">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
            <thead className="bg-gray-300">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`p-2 text-sm text-left select-none ${header.column.getIsSorted() ? 'bg-gray-400' : ''} ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex gap-1 items-center">
                        <div className="flex-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                        {header.column.getIsSorted() === 'asc' ? (
                          <FaSortUp />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <FaSortDown />
                        ) : header.column.getCanSort() ? (
                          <FaSort />
                        ) : (
                          ''
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                const currentStock = row.original;
                const isStockSelected = currentStock.id === selectedStock?.id;

                return (
                  <tr
                    key={row.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStock(isStockSelected ? null : currentStock);
                    }}
                    className={`cursor-pointer transition-colors ${isStockSelected ? 'bg-blue-200' : 'bg-white hover:bg-gray-200'}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-2 border-t border-gray-200"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="text-black text-lg animate-pulse">
                Loading stock data...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Investing */}
      {!!stockToInvest && (
        <InvestModal
          isVisible={!!stockToInvest}
          selectedStock={stockToInvest}
          onSubmit={submitInvestment}
          onClose={closeInvestment}
        />
      )}
    </div>
  );
};
