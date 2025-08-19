import { useState, useEffect, useRef, useCallback } from 'react';
import { getAPI } from '@/app/api/entrypoint';
import APIKEYS from '@/app/api/api_key.json';

// 安全地導入 context，避免在沒有 provider 的情況下出錯
let useTaskMonitoring = null;
try {
  const context = require('@/contexts/TaskMonitoringContext');
  useTaskMonitoring = context.useTaskMonitoring;
} catch (error) {
  // Context 不存在時的 fallback
  useTaskMonitoring = () => ({
    isGlobalMonitoringEnabled: true,
    monitoringInterval: 5000
  });
}

/**
 * Hook 用於監控特定 pipeline 中的 tasks 狀態變化
 * @param {string} pipelineUID - Pipeline 的 UID
 * @param {number} customInterval - 自定義檢查間隔 (毫秒)，如果不提供則使用全域設定
 * @param {boolean} enabled - 是否啟用監控
 * @param {function} onTasksUpdate - 當 tasks 更新時的回調函數
 */
export const useTaskStatusMonitor = (pipelineUID, customInterval = null, enabled = true, onTasksUpdate = null) => {
  const [tasks, setTasks] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const intervalRef = useRef(null);
  
  // 安全地使用全域監控設定
  let globalSettings = { isGlobalMonitoringEnabled: true, monitoringInterval: 5000 };
  try {
    globalSettings = useTaskMonitoring();
  } catch (error) {
    // 在沒有 provider 的情況下使用預設值
  }
  
  const { isGlobalMonitoringEnabled, monitoringInterval } = globalSettings;
  const effectiveInterval = customInterval || monitoringInterval;
  const shouldMonitor = enabled && isGlobalMonitoringEnabled;

  const fetchTasks = useCallback(async () => {
    if (!pipelineUID || !shouldMonitor) return;

    try {
      const data = { f_pipeline_uid: pipelineUID };
      const response = await getAPI(APIKEYS.FILTER_TASK_BY_PIPELINE, data);
      
      if (response.status === 200) {
        const newTasks = response.data.data;
        
        // 檢查是否有變化
        setTasks(prevTasks => {
          // 比較任務狀態是否有變化
          const hasChanges = JSON.stringify(prevTasks) !== JSON.stringify(newTasks);
          
          if (hasChanges && onTasksUpdate) {
            onTasksUpdate(newTasks);
          }
          
          return newTasks;
        });
        
        setLastUpdateTime(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch tasks status:', error);
    }
  }, [pipelineUID, shouldMonitor, onTasksUpdate]);

  useEffect(() => {
    if (!shouldMonitor || !pipelineUID) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        setIsMonitoring(false);
      }
      return;
    }

    setIsMonitoring(true);
    
    // 立即執行一次
    fetchTasks();
    
    // 設置定期檢查
    intervalRef.current = setInterval(fetchTasks, effectiveInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsMonitoring(false);
    };
  }, [fetchTasks, effectiveInterval, shouldMonitor]);

  return {
    tasks,
    isMonitoring,
    lastUpdateTime,
    refetch: fetchTasks
  };
};

/**
 * Hook 用於監控單個 task 的狀態變化
 * @param {string} taskId - Task 的 ID
 * @param {string} pipelineUID - Pipeline 的 UID
 * @param {number} customInterval - 自定義檢查間隔 (毫秒)
 * @param {boolean} enabled - 是否啟用監控
 */
export const useSingleTaskStatusMonitor = (taskId, pipelineUID, customInterval = null, enabled = true) => {
  const [taskStatus, setTaskStatus] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  // 安全地使用全域監控設定
  let globalSettings = { isGlobalMonitoringEnabled: true, monitoringInterval: 3000 };
  try {
    globalSettings = useTaskMonitoring();
  } catch (error) {
    // 在沒有 provider 的情況下使用預設值
  }
  
  const { isGlobalMonitoringEnabled, monitoringInterval } = globalSettings;
  const effectiveInterval = customInterval || monitoringInterval;
  const shouldMonitor = enabled && isGlobalMonitoringEnabled;

  const { tasks } = useTaskStatusMonitor(pipelineUID, effectiveInterval, shouldMonitor && !!taskId);

  useEffect(() => {
    if (!taskId || !tasks.length) return;

    const currentTask = tasks.find(task => task.uid === taskId);
    if (currentTask) {
      setTaskStatus(currentTask);
    }
  }, [taskId, tasks]);

  useEffect(() => {
    setIsMonitoring(shouldMonitor && !!taskId);
  }, [shouldMonitor, taskId]);

  return {
    taskStatus,
    isMonitoring
  };
};
