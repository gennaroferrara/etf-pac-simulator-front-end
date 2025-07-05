const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken') || null;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
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

  // Authentication
  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        this.token = response.token;
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(userData) {
    try {
      return await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
      this.token = null;
      localStorage.removeItem('authToken');
    } catch (error) {
      // Silent fail for logout
      this.token = null;
      localStorage.removeItem('authToken');
    }
  }

  async refreshToken() {
    try {
      const response = await this.request('/auth/refresh', { method: 'POST' });
      if (response.token) {
        this.token = response.token;
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  // User Management
  async getUserProfile() {
    try {
      return await this.request('/user/profile');
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }

  async updateUserProfile(profileData) {
    try {
      return await this.request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  }

  // Portfolio Management
  async getPortfolios() {
    try {
      return await this.request('/portfolios');
    } catch (error) {
      throw new Error('Failed to fetch portfolios');
    }
  }

  async getPortfolio(id) {
    try {
      return await this.request(`/portfolios/${id}`);
    } catch (error) {
      throw new Error('Failed to fetch portfolio');
    }
  }

  async createPortfolio(portfolioData) {
    try {
      return await this.request('/portfolios', {
        method: 'POST',
        body: JSON.stringify(portfolioData),
      });
    } catch (error) {
      throw new Error('Failed to create portfolio');
    }
  }

  async updatePortfolio(id, portfolioData) {
    try {
      return await this.request(`/portfolios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(portfolioData),
      });
    } catch (error) {
      throw new Error('Failed to update portfolio');
    }
  }

  async deletePortfolio(id) {
    try {
      return await this.request(`/portfolios/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error('Failed to delete portfolio');
    }
  }

  // Simulation Management
  async getSimulations() {
    try {
      return await this.request('/simulations');
    } catch (error) {
      throw new Error('Failed to fetch simulations');
    }
  }

  async saveSimulation(simulationData) {
    try {
      return await this.request('/simulations', {
        method: 'POST',
        body: JSON.stringify(simulationData),
      });
    } catch (error) {
      throw new Error('Failed to save simulation');
    }
  }

  async getSimulation(id) {
    try {
      return await this.request(`/simulations/${id}`);
    } catch (error) {
      throw new Error('Failed to fetch simulation');
    }
  }

  async deleteSimulation(id) {
    try {
      return await this.request(`/simulations/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error('Failed to delete simulation');
    }
  }

  // Market Data
  async getMarketData(symbols) {
    try {
      const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
      return await this.request(`/market-data?symbols=${symbolsParam}`);
    } catch (error) {
      throw new Error('Failed to fetch market data');
    }
  }

  async getRealTimePrices(symbols) {
    try {
      const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
      return await this.request(`/market-data/real-time?symbols=${symbolsParam}`);
    } catch (error) {
      throw new Error('Failed to fetch real-time prices');
    }
  }

  async getHistoricalData(symbol, period = '1y') {
    try {
      return await this.request(`/market-data/historical/${symbol}?period=${period}`);
    } catch (error) {
      throw new Error('Failed to fetch historical data');
    }
  }

  async getETFData() {
    try {
      return await this.request('/market-data/etfs');
    } catch (error) {
      throw new Error('Failed to fetch ETF data');
    }
  }

  // Analysis and ML
  async optimizePortfolio(constraints) {
    try {
      return await this.request('/analysis/optimize', {
        method: 'POST',
        body: JSON.stringify(constraints),
      });
    } catch (error) {
      throw new Error('Portfolio optimization failed');
    }
  }

  async performRiskAnalysis(portfolioData) {
    try {
      return await this.request('/analysis/risk', {
        method: 'POST',
        body: JSON.stringify(portfolioData),
      });
    } catch (error) {
      throw new Error('Risk analysis failed');
    }
  }

  async getMarketPredictions(horizon = '6m') {
    try {
      return await this.request(`/analysis/predictions?horizon=${horizon}`);
    } catch (error) {
      throw new Error('Failed to fetch market predictions');
    }
  }

  async stressTesting(portfolioData, scenarios) {
    try {
      return await this.request('/analysis/stress-test', {
        method: 'POST',
        body: JSON.stringify({ portfolio: portfolioData, scenarios }),
      });
    } catch (error) {
      throw new Error('Stress testing failed');
    }
  }

  // Backtesting
  async runBacktest(strategy, period, parameters) {
    try {
      return await this.request('/backtest/run', {
        method: 'POST',
        body: JSON.stringify({ strategy, period, parameters }),
      });
    } catch (error) {
      throw new Error('Backtesting failed');
    }
  }

  async getBacktestResults(backtestId) {
    try {
      return await this.request(`/backtest/results/${backtestId}`);
    } catch (error) {
      throw new Error('Failed to fetch backtest results');
    }
  }

  // Notifications
  async getNotifications() {
    try {
      return await this.request('/notifications');
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  }

  async markNotificationAsRead(id) {
    try {
      return await this.request(`/notifications/${id}/read`, {
        method: 'PATCH',
      });
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  // Reports
  async generateReport(portfolioId, reportType = 'comprehensive') {
    try {
      return await this.request(`/reports/generate`, {
        method: 'POST',
        body: JSON.stringify({ portfolioId, reportType }),
      });
    } catch (error) {
      throw new Error('Report generation failed');
    }
  }

  async downloadReport(reportId, format = 'pdf') {
    try {
      const response = await fetch(`${this.baseURL}/reports/download/${reportId}?format=${format}`, {
        headers: {
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.blob();
    } catch (error) {
      throw new Error('Report download failed');
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;