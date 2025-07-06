import { useState, useEffect } from 'react';
import './index.css';

// Import constants and utilities
import { INITIAL_CONFIG } from './constants';
import { useSimulation } from './hooks/useSimulation';

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

  // Custom hooks per funzionalità specializzate
  const { 
    simulationData, 
    results, 
    historicalData, 
    isSimulating, 
    runSimulation, 
    runBacktest, 
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
      // Chiamata API per recuperare simulazioni salvate
      const response = await fetch('/api/simulations');
      if (response.ok) {
        const data = await response.json();
        setSavedSimulations(data);
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
      const result = await runSimulation(config);
      
      if (result.success) {
        setActiveTab('results');
      } else {
        console.error('Errore simulazione:', result.error);
      }
    } catch (error) {
      console.error('Errore simulazione:', error);
    }
  };

  // Handler per salvataggio simulazione
  const handleSaveSimulation = async () => {
    if (!results) return;

    try {
      const simulation = {
        name: config.name || `Simulazione ${new Date().toLocaleDateString()}`,
        config: { ...config },
        results: { ...results },
        simulationData: [...simulationData],
        createdAt: new Date().toISOString()
      };

      // Salva nel backend
      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulation)
      });

      if (response.ok) {
        const saved = await response.json();
        setSavedSimulations(prev => [...prev, saved]);
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
      }
    } catch (error) {
      console.error('Errore backtesting:', error);
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
            onRunComparison={handleRunSimulation}
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