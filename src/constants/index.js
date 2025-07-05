export const ETF_OPTIONS = [
  { 
    id: 'world_equity', 
    name: 'FTSE Developed World UCITS ETF', 
    ticker: 'VWCE', 
    expense: 0.22, 
    risk: 'high',
    sector: 'Global Equity',
    aum: '4.2B',
    dividend: '1.8%',
    beta: 0.98,
    sharpe: 0.85,
    maxDrawdown: -34.2,
    ytd: 12.5,
    oneYear: 18.3,
    threeYear: 8.7,
    fiveYear: 11.2
  },
  { 
    id: 'sp500', 
    name: 'S&P 500 UCITS ETF', 
    ticker: 'VUAA', 
    expense: 0.07, 
    risk: 'high',
    sector: 'US Large Cap',
    aum: '8.1B',
    dividend: '1.5%',
    beta: 1.00,
    sharpe: 0.91,
    maxDrawdown: -33.8,
    ytd: 15.2,
    oneYear: 22.1,
    threeYear: 10.1,
    fiveYear: 13.8
  },
  { 
    id: 'europe', 
    name: 'FTSE Developed Europe UCITS ETF', 
    ticker: 'VEUR', 
    expense: 0.12, 
    risk: 'medium',
    sector: 'European Equity',
    aum: '1.8B',
    dividend: '2.8%',
    beta: 0.85,
    sharpe: 0.72,
    maxDrawdown: -28.5,
    ytd: 8.7,
    oneYear: 14.2,
    threeYear: 6.9,
    fiveYear: 8.4
  },
  { 
    id: 'bonds', 
    name: 'Global Aggregate Bond UCITS ETF', 
    ticker: 'VAGF', 
    expense: 0.10, 
    risk: 'low',
    sector: 'Fixed Income',
    aum: '2.5B',
    dividend: '2.1%',
    beta: 0.05,
    sharpe: 0.45,
    maxDrawdown: -8.2,
    ytd: -1.2,
    oneYear: 2.8,
    threeYear: 1.9,
    fiveYear: 2.4
  },
  { 
    id: 'emerging', 
    name: 'FTSE Emerging Markets UCITS ETF', 
    ticker: 'VFEM', 
    expense: 0.22, 
    risk: 'very_high',
    sector: 'Emerging Markets',
    aum: '3.2B',
    dividend: '2.4%',
    beta: 1.15,
    sharpe: 0.65,
    maxDrawdown: -42.1,
    ytd: 8.9,
    oneYear: 12.5,
    threeYear: 3.2,
    fiveYear: 6.8
  },
  { 
    id: 'real_estate', 
    name: 'Global Real Estate UCITS ETF', 
    ticker: 'VGRE', 
    expense: 0.25, 
    risk: 'medium',
    sector: 'Real Estate',
    aum: '1.1B',
    dividend: '3.2%',
    beta: 0.75,
    sharpe: 0.58,
    maxDrawdown: -35.6,
    ytd: 5.4,
    oneYear: 8.9,
    threeYear: 4.1,
    fiveYear: 7.2
  }
];

export const STRATEGIES = [
  { 
    id: 'dca', 
    name: 'Dollar Cost Averaging', 
    description: 'Investimento costante ad intervalli regolari',
    icon: '📈',
    complexity: 'Bassa',
    riskLevel: 'Moderato',
    timeHorizon: 'Lungo termine',
    winRate: '68%'
  },
  { 
    id: 'value_averaging', 
    name: 'Value Averaging', 
    description: 'Aggiustamento degli investimenti basato sul valore target',
    icon: '⚖️',
    complexity: 'Media',
    riskLevel: 'Moderato-Alto',
    timeHorizon: 'Lungo termine',
    winRate: '72%'
  },
  { 
    id: 'momentum', 
    name: 'Momentum Strategy', 
    description: 'Investimento maggiore durante trend positivi',
    icon: '🚀',
    complexity: 'Alta',
    riskLevel: 'Alto',
    timeHorizon: 'Medio-Lungo',
    winRate: '65%'
  },
  { 
    id: 'contrarian', 
    name: 'Contrarian Strategy', 
    description: 'Investimento maggiore durante i ribassi',
    icon: '🔄',
    complexity: 'Alta',
    riskLevel: 'Alto',
    timeHorizon: 'Lungo termine',
    winRate: '70%'
  },
  { 
    id: 'smart_beta', 
    name: 'Smart Beta Strategy', 
    description: 'Combinazione di fattori per ottimizzare rischio/rendimento',
    icon: '🧠',
    complexity: 'Molto Alta',
    riskLevel: 'Moderato',
    timeHorizon: 'Lungo termine',
    winRate: '74%'
  },
  { 
    id: 'tactical', 
    name: 'Tactical Asset Allocation', 
    description: 'Allocazione dinamica basata su condizioni di mercato',
    icon: '⚡',
    complexity: 'Molto Alta',
    riskLevel: 'Variabile',
    timeHorizon: 'Medio termine',
    winRate: '69%'
  }
];

export const INITIAL_CONFIG = {
  name: 'Portfolio Diversificato 2025',
  initialAmount: 10000,
  monthlyAmount: 500,
  investmentPeriod: 60,
  frequency: 'monthly',
  strategy: 'dca',
  etfAllocation: {
    'world_equity': 60,
    'bonds': 20,
    'emerging': 15,
    'real_estate': 5
  },
  riskTolerance: 'moderate',
  rebalanceFrequency: 'quarterly',
  automaticRebalance: true,
  stopLoss: 15,
  takeProfitTarget: 25
};

export const INITIAL_USER = {
  name: 'Marco Rossi',
  email: 'marco.rossi@studente.it',
  riskProfile: 'moderato',
  experience: 'intermedio',
  totalPortfolio: 45000,
  activeSimulations: 3
};

export const TAB_CONFIG = [
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
  { id: 'simulation', label: 'Simulazione', icon: 'Settings' },
  { id: 'results', label: 'Risultati', icon: 'TrendingUp' },
  { id: 'comparison', label: 'Confronto', icon: 'BarChart2' },
  { id: 'backtest', label: 'Backtesting', icon: 'Clock' },
];