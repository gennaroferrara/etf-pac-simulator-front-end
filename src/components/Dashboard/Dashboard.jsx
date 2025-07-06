import { Play, BarChart3, Clock, Brain, Globe, Save } from 'lucide-react';
import { ETF_OPTIONS } from '../../constants';

const Dashboard = ({ setActiveTab, savedSimulations = [] }) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Azioni Rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('simulation')}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <Play className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium text-center">Nuova Simulazione</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('comparison')}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium text-center">Confronta Strategie</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('backtest')}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <Clock className="h-8 w-8 text-purple-600 mb-2" />
            <span className="font-medium text-center">Backtesting</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('analysis')}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <Brain className="h-8 w-8 text-orange-600 mb-2" />
            <span className="font-medium text-center">Analisi Avanzata</span>
          </button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Globe className="mr-2" />
          Panoramica ETF Disponibili
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ETF_OPTIONS.slice(0, 6).map((etf) => (
            <div key={etf.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{etf.ticker}</h4>
                  <p className="text-sm text-gray-600">{etf.sector}</p>
                </div>
                <span className={`text-sm font-bold ${etf.ytd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {etf.ytd >= 0 ? '+' : ''}{etf.ytd}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span>1Y: {etf.oneYear}%</span>
                <span>Vol: {(etf.beta * 15).toFixed(1)}%</span>
                <span>TER: {etf.expense}%</span>
                <span>Div: {etf.dividend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulazioni Salvate */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Save className="mr-2" />
          Simulazioni Recenti
        </h3>
        {savedSimulations && savedSimulations.length > 0 ? (
          <div className="space-y-3">
            {savedSimulations.slice(-3).map((sim) => (
              <div key={sim.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-semibold text-gray-800">{sim.name}</h4>
                  <p className="text-sm text-gray-600">
                    Creata il {sim.createdAt ? new Date(sim.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">Strategia: {sim.config?.strategy || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    +{sim.results?.cumulativeReturn?.toFixed(1) || '0.0'}%
                  </p>
                  <p className="text-sm text-gray-500">{sim.config?.investmentPeriod || 0} mesi</p>
                  <p className="text-xs text-gray-400">
                    €{sim.results?.finalValue?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Save className="h-12 w-12 mx-auto mb-2" />
            </div>
            <p className="text-gray-500 mb-4">Nessuna simulazione salvata</p>
            <button 
              onClick={() => setActiveTab('simulation')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crea la tua prima simulazione
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;