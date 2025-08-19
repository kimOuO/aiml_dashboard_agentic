'use client';

import React from 'react';
import { useTaskMonitoring } from '@/contexts/TaskMonitoringContext';

const TaskMonitoringControls = ({ className = "" }) => {
  const { 
    isGlobalMonitoringEnabled, 
    monitoringInterval, 
    toggleGlobalMonitoring, 
    updateMonitoringInterval 
  } = useTaskMonitoring();

  const intervalOptions = [
    { value: 3000, label: '3 秒' },
    { value: 5000, label: '5 秒' },
    { value: 10000, label: '10 秒' },
    { value: 30000, label: '30 秒' },
  ];

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleGlobalMonitoring}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            isGlobalMonitoringEnabled
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isGlobalMonitoringEnabled ? (
            <>
              <span className="mr-1">🔄</span>
              自動更新：開啟
            </>
          ) : (
            <>
              <span className="mr-1">⏸️</span>
              自動更新：關閉
            </>
          )}
        </button>
      </div>

      {isGlobalMonitoringEnabled && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">更新間隔：</span>
          <select
            value={monitoringInterval}
            onChange={(e) => updateMonitoringInterval(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {intervalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskMonitoringControls;
