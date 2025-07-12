// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ========== ETF MANAGEMENT ==========
  
  // Ottieni tutti gli ETF
  async getAllETFs() {
    return await this.request('/etfs');
  }

  // Ottieni ETF per ID
  async getETFById(id) {
    return await this.request(`/etfs/${id}`);
  }

  // Filtra ETF per livello di rischio
  async getETFsByRisk(riskLevel) {
    return await this.request(`/etfs/filter/risk/${riskLevel}`);
  }

  // Ottieni ETF con migliori performance
  async getTopPerformingETFs(limit = 10) {
    return await this.request(`/etfs/top-performing?limit=${limit}`);
  }

  // Ottieni ETF a basso costo
  async getLowCostETFs(maxExpense = 0.5) {
    return await this.request(`/etfs/low-cost?maxExpense=${maxExpense}`);
  }

  // ========== PORTFOLIO MANAGEMENT ==========
  
  // Crea nuovo portfolio
  async createPortfolio(portfolioData) {
    return await this.request('/portfolios', {
      method: 'POST',
      body: JSON.stringify(portfolioData),
    });
  }

  // Ottieni portfolio per ID
  async getPortfolioById(id) {
    return await this.request(`/portfolios/${id}`);
  }

  // Aggiorna portfolio
  async updatePortfolio(id, portfolioData) {
    return await this.request(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(portfolioData),
    });
  }

  // Elimina portfolio
  async deletePortfolio(id) {
    return await this.request(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  // Ottieni portfolio dell'utente
  async getUserPortfolios(userId, includeTemplates = false) {
    return await this.request(`/portfolios/user/${userId}?includeTemplates=${includeTemplates}`);
  }

  // Valida allocazione ETF
  async validateAllocation(allocation) {
    return await this.request('/portfolios/validate-allocation', {
      method: 'POST',
      body: JSON.stringify(allocation),
    });
  }

  // Ottimizza portfolio
  async optimizePortfolio(optimizationData) {
    return await this.request('/portfolios/optimize', {
      method: 'POST',
      body: JSON.stringify(optimizationData),
    });
  }

  // ========== SIMULATION MANAGEMENT ==========
  
  // Esegui simulazione
  async runSimulation(simulationData) {
    return await this.request('/simulations/run', {
      method: 'POST',
      body: JSON.stringify(simulationData),
    });
  }

  // Ottieni tutte le simulazioni
  async getAllSimulations(page = 0, size = 20) {
    return await this.request(`/simulations?page=${page}&size=${size}`);
  }

  // Salva simulazione
  async saveSimulation(simulationData) {
    return await this.request('/simulations', {
      method: 'POST',
      body: JSON.stringify(simulationData),
    });
  }

  // Ottieni simulazione per ID
  async getSimulationById(id) {
    return await this.request(`/simulations/${id}`);
  }

  // Elimina simulazione
  async deleteSimulation(id) {
    return await this.request(`/simulations/${id}`, {
      method: 'DELETE',
    });
  }

  // Confronta simulazioni
  async compareSimulations(simulationIds) {
    return await this.request('/simulations/compare', {
      method: 'POST',
      body: JSON.stringify({ simulation_ids: simulationIds }),
    });
  }

  // ========== BACKTESTING ==========
  
  // Esegui backtest
  async runBacktest(backtestData) {
    return await this.request('/backtest/run', {
      method: 'POST',
      body: JSON.stringify(backtestData),
    });
  }

  // Confronta strategie
  async compareStrategies(strategies, baseParameters) {
    return await this.request('/backtest/compare-strategies', {
      method: 'POST',
      body: JSON.stringify({ strategies, base_parameters: baseParameters }),
    });
  }

  // Ottieni risultati backtest
  async getBacktestResults(backtestId) {
    return await this.request(`/backtest/${backtestId}`);
  }

  // ========== USER MANAGEMENT ==========
  
  // Ottieni tutti gli utenti
  async getAllUsers() {
    return await this.request('/users');
  }

  // Crea utente demo
  async createUser(userData) {
    return await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

// Crea e esporta singleton
export const apiService = new ApiService();
export default apiService;