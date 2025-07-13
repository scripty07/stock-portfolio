import { useState } from 'react';

import { ProjectionContent } from './components/ProjectoinContent';
import { ButtonSelectorGroup } from '../../components/ButtonSelectorGroup';
import { PROJECTION_DURATIONS } from '../../constants/common';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export const Projection = () => {
  const [selectedProjection, setSelectedProjection] = useState(
    PROJECTION_DURATIONS[0].value
  );

  const stocks = usePortfolioStore((state) => state.stocks);

  const handleProjectionChange = (value: string) => {
    setSelectedProjection(value);
  };

  // No need to show projections when no stocks are selected
  if (!stocks.length) {
    return <></>;
  }

  return (
    <div className="p-6 relative max-w-xl">
      <div className="flex justify-between items-center gap-2 text-lg font-bold mb-4">
        <div>
          <h2>Projection</h2>
          <h4 className="text-sm font-normal">
            Estimated projection for your investments
          </h4>
        </div>
        <div className="flex gap-2 items-center">
          <ButtonSelectorGroup
            selectedButton={selectedProjection}
            options={PROJECTION_DURATIONS}
            onChange={handleProjectionChange}
          />
        </div>
      </div>

      <ProjectionContent
        stocks={stocks}
        selectedProjection={selectedProjection}
      />
    </div>
  );
};
