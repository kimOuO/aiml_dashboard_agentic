'use client';

import { createContext, useContext, useState } from 'react';

const TaskMonitoringContext = createContext();

export const TaskMonitoringProvider = ({ children }) => {
  const [isGlobalMonitoringEnabled, setIsGlobalMonitoringEnabled] = useState(true);
  const [monitoringInterval, setMonitoringInterval] = useState(5000); // 5 seconds default

  const toggleGlobalMonitoring = () => {
    setIsGlobalMonitoringEnabled(prev => !prev);
  };

  const updateMonitoringInterval = (interval) => {
    setMonitoringInterval(interval);
  };

  return (
    <TaskMonitoringContext.Provider
      value={{
        isGlobalMonitoringEnabled,
        monitoringInterval,
        toggleGlobalMonitoring,
        updateMonitoringInterval,
      }}
    >
      {children}
    </TaskMonitoringContext.Provider>
  );
};

export const useTaskMonitoring = () => {
  const context = useContext(TaskMonitoringContext);
  if (!context) {
    throw new Error('useTaskMonitoring must be used within TaskMonitoringProvider');
  }
  return context;
};
