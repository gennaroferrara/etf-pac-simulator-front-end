import { TrendingUp, DollarSign, BarChart3, AlertTriangle, Target, Save, Calculator, Activity, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const Results = ({ results, simulationData, config, onSaveSimulation }) => {
  if (!results || !simulationData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun risultato disponibile</h3>
          <p className="text-gray-500">Esegui una simulazione per vedere i risultati qui.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Rendimento Totale</p>
              <p className="text-2xl font-bold">{formatPercentage(results.cumulativeReturn || 0)}</p>
              <p className="text-sm text-blue-200">vs benchmark</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Valore Finale</p>
              <p className="text-2xl font-bold">{formatCurrency(results.finalValue || 0)}</p>
              <p className="text-sm text-green-200">Portfolio totale</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Sharpe Ratio</p>
              <p className="text-2xl font-bold">{(results.sharpeRatio || 0).toFixed(2)}</p>
              <p className="text-sm text-purple-200">Risk-adjusted</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Max Drawdown</p>
              <p className="text-2xl font-bold">{formatPercentage(results.maxDrawdown || 0)}</p>
              <p className="text-sm text-orange-200">Worst loss</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Statistiche Finanziarie Aggiuntive */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Target className="h-6 w-6 text-indigo-600" />
          </div>
          <h4 className="font-semibold text-gray-800">Win Rate</h4>
          <p className="text-xl font-bold text-indigo-600">{(results.winRate || 0).toFixed(0)}%</p>
          <p className="text-sm text-gray-500">Mesi positivi</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
          <h4 className="font-semibold text-gray-800">Rendimento Annualizzato</h4>
          <p className="text-xl font-bold text-emerald-600">
            {formatPercentage((results.annualizedReturn || 0) * 100)}
          </p>
          <p className="text-sm text-gray-500">Composto annuo</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Activity className="h-6 w-6 text-amber-600" />
          </div>
          <h4 className="font-semibold text-gray-800">Volatilità</h4>
          <p className="text-xl font-bold text-amber-600">{(results.volatility || 0).toFixed(2)}%</p>
          <p className="text-sm text-gray-500">Deviazione standard</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-rose-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Shield className="h-6 w-6 text-rose-600" />
          </div>
          <h4 className="font-semibold text-gray-800">Calmar Ratio</h4>
          <p className="text-xl font-bold text-rose-600">{(results.calmarRatio || 0).toFixed(2)}</p>
          <p className="text-sm text-gray-500">Return/MaxDD</p>
        </div>
      </div>

      {/* Grafici Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico Andamento Portfolio */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Andamento Portfolio vs Investito</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={simulationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(value),
                  name === 'totalValue' ? 'Valore Portfolio' : 'Totale Investito'
                ]}
                labelFormatter={(month) => `Mese ${month}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="totalValue" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                name="Valore Portfolio"
              />
              <Area 
                type="monotone" 
                dataKey="totalInvested" 
                stackId="2"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Totale Investito"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Grafico Rendimenti Mensili */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Rendimenti Mensili (%)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={simulationData.slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}%`, 'Rendimento']}
                labelFormatter={(month) => `Mese ${month}`}
              />
              <Bar 
                dataKey="monthlyReturn" 
                fill={(entry) => {
                  const value = entry?.monthlyReturn || 0;
                  return value >= 0 ? "#10B981" : "#EF4444";
                }}
                name="Rendimento Mensile"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabella Performance Dettagliata */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Dettagliata</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Metrica</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Valore</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Benchmark</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Differenza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium">Investimento Totale</td>
                <td className="px-4 py-3 font-bold">{formatCurrency(results.totalInvested)}</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">-</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Valore Finale</td>
                <td className="px-4 py-3 font-bold text-green-600">{formatCurrency(results.finalValue)}</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3 text-green-600 font-bold">
                  +{formatCurrency(results.totalReturn)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Rendimento Totale</td>
                <td className="px-4 py-3 text-green-600 font-bold">
                  {formatPercentage(results.cumulativeReturn)}
                </td>
                <td className="px-4 py-3">8.5%</td>
                <td className="px-4 py-3">
                  {formatPercentage((results.cumulativeReturn || 0) - 8.5)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Miglior Mese</td>
                <td className="px-4 py-3 text-green-600 font-bold">
                  {formatPercentage(results.bestMonth || 0)}
                </td>
                <td className="px-4 py-3">12.3%</td>
                <td className="px-4 py-3">{formatPercentage((results.bestMonth || 0) - 12.3)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Peggior Mese</td>
                <td className="px-4 py-3 text-red-600 font-bold">
                  {formatPercentage(results.worstMonth || 0)}
                </td>
                <td className="px-4 py-3">-18.7%</td>
                <td className="px-4 py-3">{formatPercentage((results.worstMonth || 0) + 18.7)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Durata Investimento</td>
                <td className="px-4 py-3 font-bold">{config.investmentPeriod} mesi</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">-</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Strategia Utilizzata</td>
                <td className="px-4 py-3 font-bold capitalize">{config.strategy?.replace('_', ' ')}</td>
                <td className="px-4 py-3">DCA</td>
                <td className="px-4 py-3">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex justify-center">
        {onSaveSimulation && (
          <button
            onClick={onSaveSimulation}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="mr-2 h-4 w-4" />
            Salva Simulazione
          </button>
        )}
      </div>
    </div>
  );
};

export default Results;