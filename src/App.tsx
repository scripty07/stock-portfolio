import { Header } from './container/Header';
import { Portfolio } from './container/Portfolio/Portfolio';
import { Projection } from './container/Projection';
import { useRefreshPortfolio } from './hooks/useRefreshPortfolio';

export const App = () => {
  useRefreshPortfolio();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-200 to-amber-50">
      <div className="container mx-auto">
        <Header />
        <Portfolio />
        <Projection />
      </div>
    </div>
  );
};
