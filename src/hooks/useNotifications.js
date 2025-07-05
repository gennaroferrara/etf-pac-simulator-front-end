import { useState, useCallback } from 'react';

export const useNotifications = () => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      ...alert
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto-remove after 5 seconds for success alerts
    if (alert.type === 'success') {
      setTimeout(() => {
        removeAlert(newAlert.id);
      }, 5000);
    }
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Helper functions for different alert types
  const showSuccess = useCallback((title, message) => {
    addAlert({ type: 'success', title, message });
  }, [addAlert]);

  const showError = useCallback((title, message) => {
    addAlert({ type: 'error', title, message });
  }, [addAlert]);

  const showWarning = useCallback((title, message) => {
    addAlert({ type: 'warning', title, message });
  }, [addAlert]);

  const showInfo = useCallback((title, message) => {
    addAlert({ type: 'info', title, message });
  }, [addAlert]);

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAllAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};