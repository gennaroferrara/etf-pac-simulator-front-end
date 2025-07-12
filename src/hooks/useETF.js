// src/hooks/useETF.js
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useETF = () => {
  const [etfs, setEtfs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carica tutti gli ETF
  const loadETFs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getAllETFs();
      
      if (response.success) {
        setEtfs(response.data);
      } else {
        throw new Error(response.error || 'Errore caricamento ETF');
      }
    } catch (error) {
      console.error('Error loading ETFs:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Carica ETF per livello di rischio
  const loadETFsByRisk = async (riskLevel) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getETFsByRisk(riskLevel);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Errore caricamento ETF per rischio');
      }
    } catch (error) {
      console.error('Error loading ETFs by risk:', error);
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Carica top performing ETF
  const loadTopPerformingETFs = async (limit = 10) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getTopPerformingETFs(limit);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Errore caricamento top ETF');
      }
    } catch (error) {
      console.error('Error loading top ETFs:', error);
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Carica ETF a basso costo
  const loadLowCostETFs = async (maxExpense = 0.5) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getLowCostETFs(maxExpense);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Errore caricamento ETF low-cost');
      }
    } catch (error) {
      console.error('Error loading low-cost ETFs:', error);
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Carica dettagli singolo ETF
  const getETFDetails = async (etfId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getETFById(etfId);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'ETF non trovato');
      }
    } catch (error) {
      console.error('Error loading ETF details:', error);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Carica ETF all'avvio
  useEffect(() => {
    loadETFs();
  }, []);

  return {
    etfs,
    isLoading,
    error,
    loadETFs,
    loadETFsByRisk,
    loadTopPerformingETFs,
    loadLowCostETFs,
    getETFDetails
  };
};