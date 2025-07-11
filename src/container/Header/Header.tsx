import { BRAND_NAME_LOGO } from '../../constants/commonText';
import { StockSearch } from '../StockSearch';

export const Header = () => {
  return (
    <div className="pt-5">
      <div className="bg-white/10 p-2 shadow-lg ring-1 ring-black/5 backdrop-blur-lg rounded-full relative">
        <span className="py-2 px-4 rounded-full bg-blue-200/30 absolute left-[10px] top-[10px] text-blue-500 font-mono shrink-0 flex items-center justify-center">
          {BRAND_NAME_LOGO}
        </span>
        <div className="w-full flex justify-center">
          <StockSearch />
        </div>
      </div>
    </div>
  );
};
