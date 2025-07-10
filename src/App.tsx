import { Header } from './container/Header';

function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-200 to-amber-50">
      <div className="container mx-auto">
        {/* Component - Header to display Brand Name */}
        <Header />

        {/* Component - Autocomplete to search stocks */}

        {/* Container - Table to display  */}

        {/* Container - Cards to display overall portfolio */}
      </div>
    </div>
  );
}

export default App;
