// src/hooks/useSimulation.js
import { useState } from 'react';
import apiService from '../services/api';

export const useSimulation = () => {
  const [simulationData, setSimulationData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  // Esegui simulazione tramite API backend
  const runSimulation = async (config) => {
    setIsSimulating(true);
    
    try {
      // Prepara i dati nel formato richiesto dall'API
      const simulationRequest = {
        name: config.name || `Simulazione ${new Date().toLocaleDateString()}`,
        initialAmount: config.initialAmount,
        monthlyAmount: config.monthlyAmount,
        investmentPeriod: config.investmentPeriod,
        frequency: config.frequency?.toUpperCase() || 'MONTHLY',
        strategy: config.strategy?.toUpperCase() || 'DCA',
        etfAllocation: config.etfAllocation,
        riskTolerance: config.riskTolerance?.toUpperCase() || 'MODERATE',
        rebalanceFrequency: config.rebalanceFrequency?.toUpperCase() || 'QUARTERLY',
        automaticRebalance: config.automaticRebalance !== false,
        stopLoss: config.stopLoss || 0,
        takeProfitTarget: config.takeProfitTarget || 0,
        userId: 1 // Default user ID per demo
      };

      const response = await apiService.runSimulation(simulationRequest);
      
      if (response.success) {
        setSimulationData(response.data.simulationData);
        setResults(response.data.results);
        
        return { 
          success: true, 
          data: response.data.simulationData, 
          results: response.data.results 
        };
      } else {
        throw new Error(response.error || 'Errore simulazione');
      }
      
    } catch (error) {
      console.error('Simulation error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSimulating(false);
    }
  };

  // Backtesting tramite API backend
  const runBacktest = async (config, period) => {
    setIsSimulating(true);
    
    try {
      // Calcola date basate sul periodo
      const endDate = new Date();
      const startDate = new Date();
      
      switch(period) {
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        case '3years':
          startDate.setFullYear(startDate.getFullYear() - 3);
          break;
        case '5years':
          startDate.setFullYear(startDate.getFullYear() - 5);
          break;
        case '10years':
          startDate.setFullYear(startDate.getFullYear() - 10);
          break;
        default:
          startDate.setFullYear(startDate.getFullYear() - 5);
      }

      const backtestRequest = {
        name: `Backtest ${config.strategy} - ${period}`,
        strategy: config.strategy?.toUpperCase() || 'DCA',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        initialAmount: config.initialAmount,
        monthlyAmount: config.monthlyAmount,
        etfAllocation: config.etfAllocation,
        frequency: config.frequency?.toUpperCase() || 'MONTHLY',
        period: period.replace('years', 'Y').replace('year', 'Y').toUpperCase(),
        riskTolerance: config.riskTolerance?.toUpperCase() || 'MODERATE',
        rebalanceFrequency: config.rebalanceFrequency?.toUpperCase() || 'QUARTERLY',
        automaticRebalance: config.automaticRebalance !== false,
        stopLoss: config.stopLoss || 0,
        takeProfitTarget: config.takeProfitTarget || 0,
        includeTransactionCosts: false,
        transactionCostPercentage: 0.1,
        includeDividends: true,
        benchmarkIndex: 'SP500',
        userId: 1 // Default user ID per demo
      };

      const response = await apiService.runBacktest(backtestRequest);
      
      if (response.success) {
        setHistoricalData(response.data.historical_data || []);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Errore backtesting');
      }
    } catch (error) {
      console.error('Backtest error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSimulating(false);
    }
  };

  // Salva simulazione
  const saveSimulation = async (simulationToSave) => {
    try {
      const response = await apiService.saveSimulation(simulationToSave);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Errore salvataggio');
      }
    } catch (error) {
      console.error('Save simulation error:', error);
      return { success: false, error: error.message };
    }
  };

  // Carica simulazioni salvate
  const loadSimulations = async (page = 0, size = 20) => {
    try {
      const response = await apiService.getAllSimulations(page, size);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Errore caricamento simulazioni');
      }
    } catch (error) {
      console.error('Load simulations error:', error);
      return { success: false, error: error.message };
    }
  };

  // Confronta simulazioni
  const compareSimulations = async (simulationIds) => {
    try {
      const response = await apiService.compareSimulations(simulationIds);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Errore confronto simulazioni');
      }
    } catch (error) {
      console.error('Compare simulations error:', error);
      return { success: false, error: error.message };
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
    saveSimulation,
    loadSimulations,
    compareSimulations,
    resetSimulation
  };
};