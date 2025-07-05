import { useState } from 'react';
import { ETF_OPTIONS } from '../constants';

export const useSimulation = () => {
  const [simulationData, setSimulationData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  // Genera prezzi ETF simulati
  const generateETFPrices = (months, etfType, strategy) => {
    const basePrice = 100;
    const etf = ETF_OPTIONS.find(e => e.id === etfType);
    const volatility = etf?.risk === 'low' ? 0.02 : etf?.risk === 'medium' ? 0.04 : 0.06;
    const trend = etf?.risk === 'low' ? 0.003 : 0.007;
    
    let prices = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i <= months; i++) {
      const randomShock = (Math.random() - 0.5) * volatility;
      const monthlyTrend = trend + randomShock;
      currentPrice = currentPrice * (1 + monthlyTrend);
      prices.push(currentPrice);
    }
    
    return prices;
  };

  // Calcola strategia di investimento avanzata
  const calculateStrategy = (prices, config) => {
    const { monthlyAmount, strategy, frequency } = config;
    let totalShares = 0;
    let totalInvested = config.initialAmount;
    let portfolio = [];
    
    // Investimento iniziale
    if (config.initialAmount > 0) {
      const initialShares = config.initialAmount / prices[0];
      totalShares += initialShares;
      portfolio.push({
        month: 0,
        price: prices[0],
        invested: config.initialAmount,
        shares: initialShares,
        totalShares: totalShares,
        portfolioValue: totalShares * prices[0],
        totalInvested: totalInvested,
        monthlyReturn: 0,
        cumulativeReturn: 0
      });
    }

    // Investimenti periodici
    for (let i = 1; i <= config.investmentPeriod; i++) {
      let investmentAmount = monthlyAmount;
      
      // Logica specifica per strategia
      switch (strategy) {
        case 'value_averaging':
          const targetValue = totalInvested + (monthlyAmount * i);
          const currentValue = totalShares * prices[i];
          investmentAmount = Math.max(0, targetValue - currentValue);
          break;
          
        case 'momentum':
          const momentum = i > 3 ? (prices[i] - prices[i-3]) / prices[i-3] : 0;
          investmentAmount = monthlyAmount * (1 + momentum);
          break;
          
        case 'contrarian':
          const decline = i > 1 ? (prices[i-1] - prices[i]) / prices[i-1] : 0;
          investmentAmount = monthlyAmount * (1 + Math.max(0, decline * 2));
          break;

        case 'smart_beta':
          // Combina momentum e value con peso dinamico
          const smartMomentum = i > 3 ? (prices[i] - prices[i-3]) / prices[i-3] : 0;
          const smartFactor = smartMomentum * 2 + (Math.random() - 0.5) * 0.1;
          investmentAmount = monthlyAmount * (1 + smartFactor * 0.5);
          break;

        case 'tactical':
          // Allocazione tattica basata su volatilità
          const recentVol = i > 6 ? 
            Math.sqrt(prices.slice(i-6, i).reduce((acc, price, idx) => {
              if (idx === 0) return 0;
              const ret = (price - prices[i-6+idx-1]) / prices[i-6+idx-1];
              return acc + ret * ret;
            }, 0) / 5) : 0.05;
          investmentAmount = monthlyAmount * (1 + (0.05 - recentVol) * 5);
          break;
          
        default: // DCA
          investmentAmount = monthlyAmount;
      }
      
      const shares = investmentAmount / prices[i];
      totalShares += shares;
      totalInvested += investmentAmount;
      
      const monthlyReturn = i > 1 ? ((prices[i] - prices[i-1]) / prices[i-1]) * 100 : 0;
      const cumulativeReturn = ((totalShares * prices[i]) - totalInvested) / totalInvested * 100;
      
      portfolio.push({
        month: i,
        price: prices[i],
        invested: investmentAmount,
        shares: shares,
        totalShares: totalShares,
        portfolioValue: totalShares * prices[i],
        totalInvested: totalInvested,
        monthlyReturn: monthlyReturn,
        cumulativeReturn: cumulativeReturn
      });
    }
    
    return portfolio;
  };

  // Simulazione avanzata multi-ETF
  const generateAdvancedSimulation = async (config, strategy, backtestYears = 5) => {
    const months = config.investmentPeriod;
    let portfolioData = [];
    let totalValue = 0;
    let totalInvested = config.initialAmount;
    
    // Simula ogni ETF nell'allocazione
    const etfSimulations = {};
    Object.entries(config.etfAllocation).forEach(([etfId, percentage]) => {
      if (percentage > 0) {
        const prices = generateETFPrices(months, etfId, strategy);
        etfSimulations[etfId] = {
          prices,
          allocation: percentage / 100
        };
      }
    });

    // Combina simulazioni ETF in portfolio aggregato
    for (let month = 0; month <= months; month++) {
      let monthlyValue = 0;
      let monthlyInvestment = month === 0 ? config.initialAmount : config.monthlyAmount;
      let monthlyReturn = 0;
      let allocation = {};

      // Calcola valore per ogni ETF
      Object.entries(etfSimulations).forEach(([etfId, simulation]) => {
        const etfValue = monthlyInvestment * simulation.allocation;
        const etfShares = etfValue / simulation.prices[month];
        const etfPortfolioValue = etfShares * simulation.prices[month] * (month === 0 ? 1 : month);
        
        monthlyValue += etfPortfolioValue;
        allocation[etfId] = {
          value: etfPortfolioValue,
          shares: etfShares,
          price: simulation.prices[month],
          allocation: simulation.allocation
        };

        if (month > 0) {
          const etfReturn = (simulation.prices[month] - simulation.prices[month-1]) / simulation.prices[month-1];
          monthlyReturn += etfReturn * simulation.allocation;
        }
      });

      if (month > 0) {
        totalInvested += monthlyInvestment;
      }
      totalValue = monthlyValue;

      portfolioData.push({
        month,
        totalValue: totalValue,
        totalInvested: totalInvested,
        monthlyInvestment: monthlyInvestment,
        monthlyReturn: monthlyReturn * 100,
        allocation: allocation,
        cumulativeReturn: ((totalValue - totalInvested) / totalInvested) * 100,
        inflationAdjustedValue: totalValue / Math.pow(1.02, month/12),
        sharpeRatio: month > 12 ? (monthlyReturn - 0.02) / 0.15 : 0
      });
    }

    return portfolioData;
  };

  // Esegui simulazione principale
  const runSimulation = async (config) => {
    setIsSimulating(true);
    
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const portfolioData = await generateAdvancedSimulation(config, config.strategy);
      setSimulationData(portfolioData);
      
      // Calcola metriche avanzate
      const finalData = portfolioData[portfolioData.length - 1];
      const returns = portfolioData.slice(1).map(d => d.monthlyReturn);
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const volatility = Math.sqrt(returns.reduce((acc, r) => acc + Math.pow(r - avgReturn, 2), 0) / returns.length);
      
      const maxDrawdown = Math.min(...portfolioData.map((d, i) => {
        const peak = Math.max(...portfolioData.slice(0, i+1).map(p => p.totalValue));
        return ((d.totalValue - peak) / peak) * 100;
      }));

      const calculatedResults = {
        totalInvested: finalData.totalInvested,
        finalValue: finalData.totalValue,
        totalReturn: finalData.totalValue - finalData.totalInvested,
        cumulativeReturn: finalData.cumulativeReturn,
        volatility: volatility,
        maxDrawdown: maxDrawdown,
        sharpeRatio: (avgReturn - 2) / volatility,
        calmarRatio: finalData.cumulativeReturn / Math.abs(maxDrawdown),
        winRate: returns.filter(r => r > 0).length / returns.length * 100,
        bestMonth: Math.max(...returns),
        worstMonth: Math.min(...returns),
        consistency: 1 - (volatility / Math.abs(finalData.cumulativeReturn / config.investmentPeriod)),
        annualizedReturn: Math.pow(finalData.totalValue / finalData.totalInvested, 12/config.investmentPeriod) - 1
      };
      
      setResults(calculatedResults);
      return { success: true, data: portfolioData, results: calculatedResults };
      
    } catch (error) {
      console.error('Simulation error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSimulating(false);
    }
  };

  // Backtesting su dati storici
  const runBacktest = async (config, period) => {
    setIsSimulating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const years = parseInt(period.replace('years', '')) || 5;
      const backtestData = await generateAdvancedSimulation(config, config.strategy, years);
      setHistoricalData(backtestData);
      
      return { success: true, data: backtestData };
    } catch (error) {
      console.error('Backtest error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset simulazione
  const resetSimulation = () => {
    setSimulationData([]);
    setResults(null);
    setHistoricalData([]);
  };

  return {
    simulationData,
    results,
    historicalData,
    isSimulating,
    runSimulation,
    runBacktest,
    resetSimulation
  };
};