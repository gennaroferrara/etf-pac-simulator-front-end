const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method per le richieste
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ========== SIMULAZIONI ==========
  
  // Esegui simulazione
  async runSimulation(config) {
    try {
      return await this.request('/simulations/run', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    } catch (error) {
      throw new Error('Simulazione fallita');
    }
  }

  // Ottieni lista simulazioni salvate
  async getSimulations() {
    try {
      return await this.request('/simulations');
    } catch (error) {
      throw new Error('Errore recupero simulazioni');
    }
  }

  // Salva simulazione
  async saveSimulation(simulationData) {
    try {
      return await this.request('/simulations', {
        method: 'POST',
        body: JSON.stringify(simulationData),
      });
    } catch (error) {
      throw new Error('Errore salvataggio simulazione');
    }
  }

  // Ottieni dettaglio simulazione
  async getSimulation(id) {
    try {
      return await this.request(`/simulations/${id}`);
    } catch (error) {
      throw new Error('Errore recupero simulazione');
    }
  }

  // Elimina simulazione
  async deleteSimulation(id) {
    try {
      return await this.request(`/simulations/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error('Errore eliminazione simulazione');
    }
  }

  // ========== BACKTESTING ==========
  
  // Esegui backtesting
  async runBacktest(strategy, period, parameters) {
    try {
      return await this.request('/backtest/run', {
        method: 'POST',
        body: JSON.stringify({ strategy, period, parameters }),
      });
    } catch (error) {
      throw new Error('Backtesting fallito');
    }
  }

  // Ottieni risultati backtest
  async getBacktestResults(backtestId) {
    try {
      return await this.request(`/backtest/results/${backtestId}`);
    } catch (error) {
      throw new Error('Errore recupero risultati backtest');
    }
  }

  // ========== DATI DI MERCATO ==========
  
  // Ottieni dati ETF disponibili
  async getETFData() {
    try {
      return await this.request('/market-data/etfs');
    } catch (error) {
      throw new Error('Errore recupero dati ETF');
    }
  }

  // Ottieni dati di mercato per simboli specifici
  async getMarketData(symbols) {
    try {
      const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
      return await this.request(`/market-data?symbols=${symbolsParam}`);
    } catch (error) {
      throw new Error('Errore recupero dati di mercato');
    }
  }

  // Ottieni prezzi real-time
  async getRealTimePrices(symbols) {
    try {
      const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
      return await this.request(`/market-data/real-time?symbols=${symbolsParam}`);
    } catch (error) {
      throw new Error('Errore recupero prezzi real-time');
    }
  }

  // Ottieni dati storici
  async getHistoricalData(symbol, period = '1y') {
    try {
      return await this.request(`/market-data/historical/${symbol}?period=${period}`);
    } catch (error) {
      throw new Error('Errore recupero dati storici');
    }
  }

  // ========== ANALISI E OTTIMIZZAZIONE ==========
  
  // Ottimizza portfolio
  async optimizePortfolio(constraints) {
    try {
      return await this.request('/analysis/optimize', {
        method: 'POST',
        body: JSON.stringify(constraints),
      });
    } catch (error) {
      throw new Error('Ottimizzazione portfolio fallita');
    }
  }

  // Analisi del rischio
  async performRiskAnalysis(portfolioData) {
    try {
      return await this.request('/analysis/risk', {
        method: 'POST',
        body: JSON.stringify(portfolioData),
      });
    } catch (error) {
      throw new Error('Analisi rischio fallita');
    }
  }

  // Predizioni di mercato
  async getMarketPredictions(horizon = '6m') {
    try {
      return await this.request(`/analysis/predictions?horizon=${horizon}`);
    } catch (error) {
      throw new Error('Errore recupero predizioni');
    }
  }

  // Stress testing
  async stressTesting(portfolioData, scenarios) {
    try {
      return await this.request('/analysis/stress-test', {
        method: 'POST',
        body: JSON.stringify({ portfolio: portfolioData, scenarios }),
      });
    } catch (error) {
      throw new Error('Stress testing fallito');
    }
  }

  // ========== CONFRONTO STRATEGIE ==========
  
  // Confronta multiple strategie
  async compareStrategies(strategies, config) {
    try {
      return await this.request('/analysis/compare-strategies', {
        method: 'POST',
        body: JSON.stringify({ strategies, config }),
      });
    } catch (error) {
      throw new Error('Confronto strategie fallito');
    }
  }

  // ========== PORTFOLIO ==========
  
  // Calcola metriche portfolio
  async calculatePortfolioMetrics(portfolioData) {
    try {
      return await this.request('/portfolio/metrics', {
        method: 'POST',
        body: JSON.stringify(portfolioData),
      });
    } catch (error) {
      throw new Error('Calcolo metriche fallito');
    }
  }

  // Suggerimenti di ribilanciamento
  async getRebalancingSuggestions(portfolioId) {
    try {
      return await this.request(`/portfolio/${portfolioId}/rebalance`);
    } catch (error) {
      throw new Error('Errore recupero suggerimenti ribilanciamento');
    }
  }

  // ========== UTILITY ==========
  
  // Verifica stato API
  async checkHealth() {
    try {
      return await this.request('/health');
    } catch (error) {
      throw new Error('API non raggiungibile');
    }
  }

  // Ottieni configurazione ETF disponibili
  async getAvailableETFs() {
    try {
      return await this.request('/config/etfs');
    } catch (error) {
      throw new Error('Errore recupero configurazione ETF');
    }
  }

  // Ottieni strategie disponibili
  async getAvailableStrategies() {
    try {
      return await this.request('/config/strategies');
    } catch (error) {
      throw new Error('Errore recupero strategie');
    }
  }
}

// Crea e esporta singleton
export const apiService = new ApiService();
export default apiService;