import { useState } from 'react';
import { Settings, Play, Clock, Save, Eye, EyeOff } from 'lucide-react';
import { ETF_OPTIONS, STRATEGIES } from '../../constants';

const Configuration = ({ config, setConfig, onRunSimulation, isSimulating, onSaveSimulation }) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleAllocationChange = (etfId, value) => {
    setConfig(prev => ({
      ...prev,
      etfAllocation: {
        ...prev.etfAllocation,
        [etfId]: parseInt(value) || 0
      }
    }));
  };

  const getTotalAllocation = () => {
    return Object.values(config.etfAllocation || {}).reduce((sum, value) => sum + (value || 0), 0);
  };

  const isValidAllocation = () => {
    const total = getTotalAllocation();
    return total === 100;
  };

  return (
    <div className="space-y-6">
      {/* Configurazione Base */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Settings className="mr-2" />
          Configurazione Portfolio
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Portfolio
            </label>
            <input
              type="text"
              value={config.name || ''}
              onChange={(e) => handleConfigChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Es. Portfolio Diversificato 2025"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Importo Iniziale (€)
            </label>
            <input
              type="number"
              value={config.initialAmount || 0}
              onChange={(e) => handleConfigChange('initialAmount', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investimento Periodico (€)
            </label>
            <input
              type="number"
              value={config.monthlyAmount || 0}
              onChange={(e) => handleConfigChange('monthlyAmount', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durata Investimento (mesi)
            </label>
            <input
              type="number"
              value={config.investmentPeriod || 12}
              onChange={(e) => handleConfigChange('investmentPeriod', parseInt(e.target.value) || 12)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequenza Investimento
            </label>
            <select
              value={config.frequency || 'monthly'}
              onChange={(e) => handleConfigChange('frequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Mensile</option>
              <option value="weekly">Settimanale</option>
              <option value="quarterly">Trimestrale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Allocazione ETF */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Allocazione ETF (%)</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isValidAllocation() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Totale: {getTotalAllocation()}%
          </div>
        </div>
        
        <div className="space-y-4">
          {ETF_OPTIONS.map((etf) => (
            <div key={etf.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    {etf.name} ({etf.ticker})
                  </label>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>TER: {etf.expense}%</span>
                    <span>Div: {etf.dividend}</span>
                    <span>Beta: {etf.beta}</span>
                    <span>1Y: {etf.oneYear}%</span>
                    <span className={`px-2 py-1 rounded-full ${
                      etf.risk === 'low' ? 'bg-green-100 text-green-800' :
                      etf.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      etf.risk === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {etf.risk}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={config.etfAllocation?.[etf.id] || 0}
                    onChange={(e) => handleAllocationChange(etf.id, e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm font-bold text-blue-600 w-8">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.etfAllocation?.[etf.id] || 0}
                onChange={(e) => handleAllocationChange(etf.id, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          ))}
        </div>
        
        {!isValidAllocation() && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ L'allocazione totale deve essere esattamente 100% per procedere con la simulazione.
            </p>
          </div>
        )}
      </div>

      {/* Selezione Strategia */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Strategia di Investimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STRATEGIES.map((strategy) => (
            <div
              key={strategy.id}
              onClick={() => handleConfigChange('strategy', strategy.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                config.strategy === strategy.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{strategy.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{strategy.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Complessità:</span>
                      <span className="font-medium">{strategy.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rischio:</span>
                      <span className="font-medium">{strategy.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Win Rate:</span>
                      <span className="font-medium text-green-600">{strategy.winRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Orizzonte:</span>
                      <span className="font-medium">{strategy.timeHorizon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impostazioni Avanzate */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Impostazioni Avanzate</h3>
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showAdvancedSettings ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showAdvancedSettings ? 'Nascondi' : 'Mostra'}
          </button>
        </div>
        
        {showAdvancedSettings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequenza Ribilanciamento
              </label>
              <select
                value={config.rebalanceFrequency || 'quarterly'}
                onChange={(e) => handleConfigChange('rebalanceFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Mensile</option>
                <option value="quarterly">Trimestrale</option>
                <option value="semiannual">Semestrale</option>
                <option value="annual">Annuale</option>
                <option value="never">Mai</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stop Loss (%)
              </label>
              <input
                type="number"
                value={config.stopLoss || 0}
                onChange={(e) => handleConfigChange('stopLoss', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="50"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Take Profit Target (%)
              </label>
              <input
                type="number"
                value={config.takeProfitTarget || 0}
                onChange={(e) => handleConfigChange('takeProfitTarget', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="200"
                step="0.5"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="automaticRebalance"
                checked={config.automaticRebalance || false}
                onChange={(e) => handleConfigChange('automaticRebalance', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="automaticRebalance" className="text-sm text-gray-700">
                Ribilanciamento Automatico
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Pulsanti Azione */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onRunSimulation}
          disabled={isSimulating || !isValidAllocation()}
          className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSimulating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Simulazione in corso...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Avvia Simulazione Avanzata
            </>
          )}
        </button>
        
        <button
          onClick={() => window.location.href = '#backtest'}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Clock className="mr-2 h-4 w-4" />
          Backtesting
        </button>
        
        {onSaveSimulation && (
          <button
            onClick={onSaveSimulation}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="mr-2 h-4 w-4" />
            Salva Configurazione
          </button>
        )}
      </div>
    </div>
  );
};

export default Configuration;