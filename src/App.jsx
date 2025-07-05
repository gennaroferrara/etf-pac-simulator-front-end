import { useState, useEffect } from 'react';
import './index.css';

// Import constants and utilities
import { INITIAL_CONFIG, INITIAL_USER } from './constants';
import { useSimulation } from './hooks/useSimulation';
import { useNotifications } from './hooks/useNotifications';

// Import UI components
import Header from './components/UI/Header';
import Navigation from './components/UI/Navigation';
import NotificationSystem from './components/UI/NotificationSystem';

// Import main components
import Dashboard from './components/Dashboard/Dashboard';
import Configuration from './components/Configuration/Configuration';
import Results from './components/Results/Results';
import Comparison from './components/Comparison/Comparison';
import Backtest from './components/Backtest/Backtest';

const AdvancedETFPACPlatform = () => {
  // State management principale
  const [activeTab, setActiveTab] = useState('dashboard');
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [user, setUser] = useState(INITIAL_USER);
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

  const {
    alerts,
    removeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  } = useNotifications();

  // Effetti per inizializzazione e persistenza
  useEffect(() => {
    // Simula caricamento dati utente dal backend
    initializeApp();
  }, []);

  useEffect(() => {
    // Salva configurazione nel localStorage per persistenza
    if (config.name) {
      localStorage.setItem('etf-pac-config', JSON.stringify(config));
    }
  }, [config]);

  useEffect(() => {
    // Salva simulazioni nel localStorage
    if (savedSimulations.length > 0) {
      localStorage.setItem('etf-pac-simulations', JSON.stringify(savedSimulations));
    }
  }, [savedSimulations]);

  // Inizializzazione dell'applicazione
  const initializeApp = async () => {
    setIsLoading(true);
    
    try {
      // Carica configurazione salvata
      const savedConfig = localStorage.getItem('etf-pac-config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(prevConfig => ({ ...prevConfig, ...parsedConfig }));
      }

      // Carica simulazioni salvate
      const savedSims = localStorage.getItem('etf-pac-simulations');
      if (savedSims) {
        const parsedSims = JSON.parse(savedSims);
        setSavedSimulations(parsedSims);
      }

      // Simula chiamata API per dati utente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showInfo('Sistema Inizializzato', 'Piattaforma ETF PAC caricata con successo');
    } catch (error) {
      console.error('Errore inizializzazione:', error);
      showError('Errore Inizializzazione', 'Problema nel caricamento dei dati');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler per esecuzione simulazione
  const handleRunSimulation = async () => {
    try {
      showInfo('Simulazione Avviata', 'Elaborazione in corso...');
      
      const result = await runSimulation(config);
      
      if (result.success) {
        showSuccess('Simulazione Completata', `Portfolio ${config.name} simulato con successo`);
        setActiveTab('results');
      } else {
        showError('Errore Simulazione', result.error || 'Si è verificato un errore');
      }
    } catch (error) {
      console.error('Errore simulazione:', error);
      showError('Errore Simulazione', 'Problema durante l\'elaborazione');
    }
  };

  // Handler per salvataggio simulazione
  const handleSaveSimulation = async () => {
    if (!results) {
      showWarning('Nessun Risultato', 'Esegui prima una simulazione');
      return;
    }

    try {
      const simulation = {
        id: Date.now(),
        name: config.name || `Simulazione ${new Date().toLocaleDateString()}`,
        config: { ...config },
        results: { ...results },
        simulationData: [...simulationData],
        createdAt: new Date().toISOString(),
        status: 'completed'
      };

      setSavedSimulations(prev => {
        const updated = [...prev, simulation];
        // Mantieni solo le ultime 10 simulazioni
        return updated.slice(-10);
      });

      showSuccess('Simulazione Salvata', `${simulation.name} salvata nel tuo portfolio`);
    } catch (error) {
      console.error('Errore salvataggio:', error);
      showError('Errore Salvataggio', 'Impossibile salvare la simulazione');
    }
  };

  // Handler per backtesting
  const handleRunBacktest = async (period) => {
    try {
      showInfo('Backtesting Avviato', 'Analisi dati storici in corso...');
      
      const result = await runBacktest(config, period);
      
      if (result.success) {
        showSuccess('Backtesting Completato', 'Analisi storica completata con successo');
      } else {
        showError('Errore Backtesting', result.error || 'Problema durante l\'analisi');
      }
    } catch (error) {
      console.error('Errore backtesting:', error);
      showError('Errore Backtesting', 'Problema durante l\'analisi storica');
    }
  };

  // Handler per reset configurazione
  const handleResetConfig = () => {
    setConfig(INITIAL_CONFIG);
    resetSimulation();
    showInfo('Configurazione Reset', 'Impostazioni ripristinate ai valori predefiniti');
  };

  // Handler per export dati
  const handleExportData = () => {
    try {
      const exportData = {
        config,
        results,
        simulationData,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `etf-pac-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      showSuccess('Export Completato', 'Dati esportati con successo');
    } catch (error) {
      console.error('Errore export:', error);
      showError('Errore Export', 'Impossibile esportare i dati');
    }
  };

  // Render del tab attivo
  const renderActiveTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Caricamento in corso...</h3>
            <p className="text-gray-500">Inizializzazione della piattaforma</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
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
            onExportData={handleExportData}
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
            user={user} 
            setActiveTab={setActiveTab} 
            savedSimulations={savedSimulations}
          />
        );
    }
  };

  // Render principale
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sistema di Notifiche */}
      <NotificationSystem alerts={alerts} removeAlert={removeAlert} />
      
      {/* Header */}
      <Header user={user} alerts={alerts} />
      
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
        
        {/* Footer */}
        <footer className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-500">
            {/* Informazioni Tecniche */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Stack Tecnologico</h4>
              <ul className="space-y-1">
                <li>• React 18 + Vite</li>
                <li>• Recharts per visualizzazioni</li>
                <li>• Tailwind CSS per styling</li>
                <li>• Lucide React per iconografie</li>
              </ul>
            </div>
            
            {/* Funzionalità Backend */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Funzionalità Backend</h4>
              <ul className="space-y-1">
                <li>• API RESTful + GraphQL</li>
                <li>• Autenticazione JWT</li>
                <li>• Database PostgreSQL</li>
                <li>• Cache Redis</li>
              </ul>
            </div>
            
            {/* Compliance e Sicurezza */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Compliance</h4>
              <ul className="space-y-1">
                <li>• GDPR Compliant</li>
                <li>• Normative Finanziarie</li>
                <li>• Audit Trail Completo</li>
                <li>• Risk Management</li>
              </ul>
            </div>
          </div>
          
          {/* Copyright e Versione */}
          <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              © 2024 InvestPro Platform - Project Work Universitario
            </div>
            <div className="text-xs text-gray-400">
              v1.0.0 - Build {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}.{String(new Date().getDate()).padStart(2, '0')}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdvancedETFPACPlatform;