// src/hooks/usePortfolio.js
import { useState } from 'react';
import apiService from '../services/api';

export const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Crea nuovo portfolio
  const createPortfolio = async (portfolioData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createPortfolio(portfolioData);
      
      if (response.success) {
        setPortfolios(prev => [...prev, response.data]);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Errore creazione portfolio');
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Carica portfolios dell'utente
  const loadUserPortfolios = async (userId, includeTemplates = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserPortfolios(userId, includeTemplates);
      
      if (response.success) {
        setPortfolios(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Errore caricamento portfolios');
      }
    } catch (error) {
      console.error('Error loading portfolios:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Carica dettagli portfolio
  const getPortfolioDetails = async (portfolioId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getPortfolioById(portfolioId);
      
      if (response.success) {
        setCurrentPortfolio(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Portfolio non trovato');
      }
    } catch (error) {
      console.error('Error loading portfolio details:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Aggiorna portfolio
  const updatePortfolio = async (portfolioId, portfolioData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updatePortfolio(portfolioId, portfolioData);
      
      if (response.success) {
        setCurrentPortfolio(response.data);
        setPortfolios(prev => 
          prev.map(p => p.id === portfolioId ? response.data : p)
        );
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Errore aggiornamento portfolio');
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Elimina portfolio
  const deletePortfolio = async (portfolioId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.deletePortfolio(portfolioId);
      
      if (response.success) {
        setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
        if (currentPortfolio?.id === portfolioId) {
          setCurrentPortfolio(null);
        }
        return { success: true };
      } else {
        throw new Error(response.error || 'Errore eliminazione portfolio');
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Valida allocazione ETF
  const validateAllocation = async (allocation) => {
    try {
      const response = await apiService.validateAllocation(allocation);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Errore validazione allocazione');
      }
    } catch (error) {
      console.error('Error validating allocation:', error);
      return {
        is_valid: false,
        total_allocation: Object.values(allocation).reduce((sum, val) => sum + val, 0),
        errors: [error.message],
        warnings: []
      };
    }
  };

  // Ottimizza portfolio
  const optimizePortfolio = async (riskProfile, constraints = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.optimizePortfolio({
        risk_profile: riskProfile,
        constraints
      });
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Errore ottimizzazione portfolio');
      }
    } catch (error) {
      console.error('Error optimizing portfolio:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    portfolios,
    currentPortfolio,
    isLoading,
    error,
    createPortfolio,
    loadUserPortfolios,
    getPortfolioDetails,
    updatePortfolio,
    deletePortfolio,
    validateAllocation,
    optimizePortfolio
  };
};