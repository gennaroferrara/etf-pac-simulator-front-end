import { BarChart3, Settings, TrendingUp, BarChart2, Clock, Brain } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, results }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'simulation', label: 'Simulazione', icon: Settings },
    { id: 'results', label: 'Risultati', icon: TrendingUp },
    { id: 'comparison', label: 'Confronto', icon: BarChart2 },
    { id: 'backtest', label: 'Backtesting', icon: Clock },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isDisabled = tab.id === 'results' && !results;
          
          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveTab(tab.id)}
              disabled={isDisabled}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : isDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;