import { useState } from 'react';
import { BarChart3, Play, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { STRATEGIES } from '../../constants';

const Comparison = ({ runComparison, isSimulating }) => {
  const [selectedStrategies, setSelectedStrategies] = useState(['dca']);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [baseConfig, setBaseConfig] = useState({
    initialAmount: 10000,
    monthlyAmount: 500,
    investmentPeriod: 60,
    etfAllocation: {
      'world_equity': 60,
      'bonds': 20,
      'emerging': 15,
      'real_estate': 5
    }
  });

  const handleStrategyToggle = (strategyId) => {
    setSelectedStrategies(prev => {
      if (prev.includes(strategyId)) {
        return prev.filter(s => s !== strategyId);
      } else if (prev.length < 4) {
        return [...prev, strategyId];
      }
      return prev;
    });
  };

  const runComparisonSimulation = async () => {
    if (selectedStrategies.length < 2) return;

    // Simula confronto tra strategie
    const mockResults = selectedStrategies.map((strategyId, index) => {
      const strategy = STRATEGIES.find(s => s.id === strategyId);
      const baseReturn = 8 + (Math.random() - 0.5) * 6;
      const volatility = 12 + (Math.random() - 0.5) * 8;
      const maxDrawdown = -15 - (Math.random() * 20);
      
      return {
        strategy: strategyId,
        name: strategy.name,
        icon: strategy.icon,
        finalReturn: baseReturn + index * 1.5,
        volatility: volatility,
        sharpeRatio: (baseReturn - 2) / volatility,
        maxDrawdown: maxDrawdown,
        winRate: 60 + Math.random() * 20,
        calmarRatio: baseReturn / Math.abs(maxDrawdown),
        complexity: strategy.complexity,
        riskLevel: strategy.riskLevel,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] || '#6B7280'
      };
    });

  const monthlyData = [];

for (let month = 0; month < 60; month++) {
  const dataPoint = { month };

  mockResults.forEach(result => {
    const volatility = result.volatility / 100;
    const trend = result.finalReturn / 100 / 12;
    const randomShock = (Math.random() - 0.5) * volatility;
    const monthlyReturn = trend + randomShock;

    if (month === 0) {
      dataPoint[result.strategy] = 10000;
    } else {
      const prevValue = monthlyData[month - 1][result.strategy];
      dataPoint[result.strategy] = prevValue * (1 + monthlyReturn) + 500;
    }
  });

  monthlyData.push(dataPoint);
}


    setComparisonResults({
      strategies: mockResults,
      monthlyData: monthlyData
    });
  };

  const getStrategyColor = (index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    return colors[index] || '#6B7280';
  };

  const formatPercentage = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  const formatCurrency = (value) => `€${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Selezione Strategie */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confronto Strategie di Investimento</h3>
        <p className="text-gray-600 mb-6">
          Seleziona da 2 a 4 strategie da confrontare con le stesse condizioni di mercato
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {STRATEGIES.map((strategy) => (
            <label key={strategy.id} className="relative">
              <input
                type="checkbox"
                checked={selectedStrategies.includes(strategy.id)}
                onChange={() => handleStrategyToggle(strategy.id)}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedStrategies.includes(strategy.id)
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{strategy.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{strategy.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {strategy.complexity}
                      </span>
                      <span className="text-green-600 font-medium">
                        {strategy.winRate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedStrategies.includes(strategy.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
              )}
            </label>
          ))}
        </div>

        {/* Configurazione Base */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Parametri di Confronto</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Importo Iniziale</label>
              <input
                type="number"
                value={baseConfig.initialAmount}
                onChange={(e) => setBaseConfig(prev => ({
                  ...prev,
                  initialAmount: parseInt(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Importo Mensile</label>
              <input
                type="number"
                value={baseConfig.monthlyAmount}
                onChange={(e) => setBaseConfig(prev => ({
                  ...prev,
                  monthlyAmount: parseInt(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Durata (mesi)</label>
              <input
                type="number"
                value={baseConfig.investmentPeriod}
                onChange={(e) => setBaseConfig(prev => ({
                  ...prev,
                  investmentPeriod: parseInt(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedStrategies.length === 0 && "Seleziona almeno 2 strategie"}
            {selectedStrategies.length === 1 && "Seleziona almeno 1 strategia aggiuntiva"}
            {selectedStrategies.length >= 2 && `${selectedStrategies.length} strategie selezionate`}
            {selectedStrategies.length >= 4 && " (massimo raggiunto)"}
          </div>
          
          <button 
            onClick={runComparisonSimulation}
            disabled={selectedStrategies.length < 2 || isSimulating}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSimulating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confronto in corso...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Avvia Confronto
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Risultati del Confronto */}
      {comparisonResults && (
        <>
          {/* Tabella Riassuntiva */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Risultati Confronto</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Strategia</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Rendimento</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Volatilità</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Sharpe</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Max DD</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Win Rate</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Complessità</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonResults.strategies.map((result, index) => (
                    <tr key={result.strategy} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: getStrategyColor(index) }}
                          ></div>
                          <div>
                            <span className="font-medium">{result.name}</span>
                            <span className="ml-2">{result.icon}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${result.finalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(result.finalReturn)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">
                        {result.volatility.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-blue-600">
                        {result.sharpeRatio.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-red-600">
                        {formatPercentage(result.maxDrawdown)}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-green-600">
                        {result.winRate.toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {result.complexity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grafici di Confronto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grafico Performance nel Tempo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Performance nel Tempo</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={comparisonResults.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), STRATEGIES.find(s => s.id === name)?.name || name]}
                    labelFormatter={(month) => `Mese ${month}`}
                  />
                  <Legend 
                    formatter={(value) => STRATEGIES.find(s => s.id === value)?.name || value}
                  />
                  {comparisonResults.strategies.map((result, index) => (
                    <Line
                      key={result.strategy}
                      type="monotone"
                      dataKey={result.strategy}
                      stroke={getStrategyColor(index)}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Grafico Rischio-Rendimento */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Analisi Rischio-Rendimento</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={comparisonResults.strategies}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'finalReturn' ? formatPercentage(value) : value.toFixed(2),
                      name === 'finalReturn' ? 'Rendimento' : 'Sharpe Ratio'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="finalReturn" fill="#3B82F6" name="Rendimento %" />
                  <Bar dataKey="sharpeRatio" fill="#10B981" name="Sharpe Ratio" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart per Confronto Multi-dimensionale */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confronto Multi-dimensionale</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={comparisonResults.strategies.map(s => ({
                  strategy: s.name.split(' ')[0],
                  Rendimento: Math.max(0, s.finalReturn + 20), // Normalized to positive
                  Sharpe: Math.max(0, s.sharpeRatio * 20),
                  'Win Rate': s.winRate,
                  Stabilità: Math.max(0, 100 + s.maxDrawdown), // Inverted drawdown
                  Calmar: Math.max(0, s.calmarRatio * 20)
                }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="strategy" />
                  <PolarRadiusAxis angle={18} domain={[0, 100]} />
                  {comparisonResults.strategies.map((result, index) => (
                    <Radar
                      key={result.strategy}
                      name={result.name.split(' ')[0]}
                      dataKey={result.name.split(' ')[0]}
                      stroke={getStrategyColor(index)}
                      fill={getStrategyColor(index)}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Ranking per Metrica</h4>
                
                {/* Best Return */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-medium">🏆 Miglior Rendimento</span>
                    <span className="text-green-600 font-bold">
                      {comparisonResults.strategies
                        .reduce((best, current) => current.finalReturn > best.finalReturn ? current : best)
                        .name
                      }
                    </span>
                  </div>
                </div>

                {/* Best Sharpe */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-medium">⚖️ Miglior Risk-Adjusted</span>
                    <span className="text-blue-600 font-bold">
                      {comparisonResults.strategies
                        .reduce((best, current) => current.sharpeRatio > best.sharpeRatio ? current : best)
                        .name
                      }
                    </span>
                  </div>
                </div>

                {/* Lowest Drawdown */}
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-800 font-medium">🛡️ Maggior Protezione</span>
                    <span className="text-purple-600 font-bold">
                      {comparisonResults.strategies
                        .reduce((best, current) => current.maxDrawdown > best.maxDrawdown ? current : best)
                        .name
                      }
                    </span>
                  </div>
                </div>

                {/* Highest Win Rate */}
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-800 font-medium">🎯 Maggior Consistenza</span>
                    <span className="text-amber-600 font-bold">
                      {comparisonResults.strategies
                        .reduce((best, current) => current.winRate > best.winRate ? current : best)
                        .name
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raccomandazioni */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2" />
              Raccomandazioni
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">✅ Strategia Consigliata</h4>
                <p className="text-green-700 text-sm mb-2">
                  Per il tuo profilo di rischio, consigliamo la strategia con il miglior rapporto rischio-rendimento.
                </p>
                <p className="font-bold text-green-800">
                  {comparisonResults.strategies
                    .reduce((best, current) => current.sharpeRatio > best.sharpeRatio ? current : best)
                    .name
                  }
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Considerazioni</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Le performance passate non garantiscono risultati futuri</li>
                  <li>• Considera la tua tolleranza al rischio personale</li>
                  <li>• Diversifica sempre i tuoi investimenti</li>
                  <li>• Monitora periodicamente le performance</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Comparison;