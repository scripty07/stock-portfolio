import { Header } from './container/Header';
import Portfolio from './container/Portfolio/Portfolio';
import { useRefreshPortfolio } from './hooks/useRefreshPortfolio';

function App() {
  useRefreshPortfolio();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-200 to-amber-50">
      <div className="container mx-auto">
        <Header />
        <Portfolio />

        {/* Container - Table to display  */}

        {/* Container - Cards to display overall portfolio */}
      </div>
    </div>
  );
}

export default App;
