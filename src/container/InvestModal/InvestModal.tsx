import { useState, type FormEvent } from 'react';

import type { InvestModalProps } from './types';
import Modal from '../../components/Modal/Modal';
import type { PortfolioItem } from '../../typings/portfolio';

const InvestModal = (props: InvestModalProps) => {
  const { isVisible, selectedStock, onSubmit, onClose } = props;

  const [investValue, setInvestValue] = useState(
    selectedStock.allocation ?? ''
  );

  const submitInvestmentForm = (event: FormEvent) => {
    event.preventDefault();

    if (investValue) {
      submitInvestment();
    }
  };

  const submitInvestment = () => {
    if (!selectedStock) {
      return;
    }

    const updatedStock: PortfolioItem = {
      ...selectedStock,
      allocation: Number(investValue),
    };

    onSubmit(updatedStock);
  };

  const cancelInvestment = () => {
    setInvestValue('');
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      title={`Invest in ${selectedStock.name} (${selectedStock.id})`}
    >
      <form onSubmit={submitInvestmentForm}>
        {/* Body */}
        <div className="bg-white p-4 sm:pb-4 pt-0">
          <span className="block text-ms pb-2">Amount to invest</span>
          <input
            required
            type="number"
            value={investValue}
            className="w-full border p-2 mb-4 rounded"
            onChange={(e) => setInvestValue(e.target.value)}
            placeholder={`Enter amount in ${selectedStock.currency.toUpperCase()}`}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            onClick={submitInvestment}
            className="inline-flex w-full transition-colors cursor-pointer justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
          >
            Invest
          </button>
          <button
            type="button"
            onClick={cancelInvestment}
            className="mt-3 inline-flex w-full justify-center transition-colors cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InvestModal;
