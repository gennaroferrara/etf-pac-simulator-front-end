import { useState } from 'react';

export const useSimulation = () => {
  const [simulationData, setSimulationData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  // Esegui simulazione tramite API backend
  const runSimulation = async (config) => {
    setIsSimulating(true);
    
    try {
      const response = await fetch('/api/simulations/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Errore simulazione');
      }

      const data = await response.json();
      
      setSimulationData(data.simulationData);
      setResults(data.results);
      
      return { success: true, data: data.simulationData, results: data.results };
      
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
      const response = await fetch('/api/backtest/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config, period })
      });

      if (!response.ok) {
        throw new Error('Errore backtesting');
      }

      const data = await response.json();
      setHistoricalData(data.historicalData);
      
      return { success: true, data: data.historicalData };
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