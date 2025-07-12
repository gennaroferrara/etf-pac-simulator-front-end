// src/App.jsx
import { useState, useEffect } from 'react';
import './index.css';

// Import constants and utilities
import { INITIAL_CONFIG } from './constants';
import { useSimulation } from './hooks/useSimulation';
import apiService from './services/api';

// Import UI components
import Header from './components/UI/Header';
import Navigation from './components/UI/Navigation';

// Import main components
import Dashboard from './components/Dashboard/Dashboard';
import Configuration from './components/Configuration/Configuration';
import Results from './components/Results/Results';
import Comparison from './components/Comparison/Comparison';
import Backtest from './components/Backtest/Backtest';

const ETFPACSimulator = () => {
  // State management principale
  const [activeTab, setActiveTab] = useState('dashboard');
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(1); // Default user ID

  // Custom hooks per funzionalità specializzate
  const { 
    simulationData, 
    results, 
    historicalData, 
    isSimulating, 
    runSimulation, 
    runBacktest,
    saveSimulation,
    loadSimulations,
    resetSimulation 
  } = useSimulation();

  // Effetti per inizializzazione e persistenza
  useEffect(() => {
    loadSavedSimulations();
  }, []);

  // Carica simulazioni salvate dal backend
  const loadSavedSimulations = async () => {
    setIsLoading(true);
    try {
      const result = await loadSimulations();
      if (result.success) {
        setSavedSimulations(result.data);
      }
    } catch (error) {
      console.error('Errore caricamento simulazioni:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler per esecuzione simulazione
  const handleRunSimulation = async () => {
    try {
      const result = await runSimulation({ ...config, userId });
      
      if (result.success) {
        setActiveTab('results');
      } else {
        console.error('Errore simulazione:', result.error);
        // TODO: Mostra notifica errore all'utente
      }
    } catch (error) {
      console.error('Errore simulazione:', error);
    }
  };

  // Handler per salvataggio simulazione
  const handleSaveSimulation = async () => {
    if (!results) return;

    try {
      const simulationToSave = {
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
        userId: userId
      };

      const result = await saveSimulation(simulationToSave);
      
      if (result.success) {
        // Ricarica lista simulazioni
        await loadSavedSimulations();
        // TODO: Mostra notifica successo
      } else {
        console.error('Errore salvataggio:', result.error);
        // TODO: Mostra notifica errore
      }
    } catch (error) {
      console.error('Errore salvataggio:', error);
    }
  };

  // Handler per backtesting
  const handleRunBacktest = async (period) => {
    try {
      const result = await runBacktest(config, period);
      
      if (!result.success) {
        console.error('Errore backtesting:', result.error);
        // TODO: Mostra notifica errore
      }
    } catch (error) {
      console.error('Errore backtesting:', error);
    }
  };

  // Handler per confronto strategie
  const handleRunComparison = async (strategies, baseConfig) => {
    try {
      const response = await apiService.compareStrategies(strategies, baseConfig);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Errore confronto strategie');
      }
    } catch (error) {
      console.error('Errore confronto strategie:', error);
      throw error;
    }
  };

  // Handler per reset configurazione
  const handleResetConfig = () => {
    setConfig(INITIAL_CONFIG);
    resetSimulation();
  };

  // Render del tab attivo
  const renderActiveTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Caricamento in corso...</h3>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            setActiveTab={setActiveTab} 
            savedSimulations={savedSimulations}
          />
        );
      
      case 'simulation':
        return (
          <Configuration 
            config={config} 
            setConfig={setConfig}
            onRunSimulation={handleRunSimulation}
            isSimulating={isSimulating}
            onSaveSimulation={handleSaveSimulation}
            onResetConfig={handleResetConfig}
          />
        );
      
      case 'results':
        return (
          <Results 
            results={results} 
            simulationData={simulationData} 
            config={config}
            onSaveSimulation={handleSaveSimulation}
          />
        );
      
      case 'comparison':
        return (
          <Comparison 
            isSimulating={isSimulating}
            onRunComparison={handleRunComparison}
          />
        );
      
      case 'backtest':
        return (
          <Backtest 
            runBacktest={handleRunBacktest}
            isSimulating={isSimulating}
            historicalData={historicalData}
          />
        );
      
      default:
        return (
          <Dashboard 
            setActiveTab={setActiveTab} 
            savedSimulations={savedSimulations}
          />
        );
    }
  };

  // Render principale
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <Header />
      
      {/* Contenuto Principale */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Navigazione */}
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          results={results} 
        />
        
        {/* Contenuto Tab Attivo */}
        <main className="mb-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default ETFPACSimulator;