import React, { useState, useEffect, useRef } from "react";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

const RealtimeLogModal = ({ 
  isOpen, 
  onClose, 
  taskId, 
  taskName, 
  taskType, 
  refreshInterval = 3000 // 每3秒更新一次
}) => {
  const [logs, setLogs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef(null);
  const intervalRef = useRef(null);

  // 獲取 log 數據的函數
  const fetchLogs = async () => {
    if (!taskId || !taskType) return;
    
    try {
      const data = { task_uid: taskId, type: taskType };
      const response = await getAPI(APIKEYS.GET_TASK_LOG, data, false, true);

      if (response.status === 200) {
        const blobData = await response.data.text();
        const jsonData = JSON.parse(blobData);

        let logContent = "";
        if (typeof jsonData.data === "object") {
          Object.keys(jsonData.data).forEach((key) => {
            logContent += `=== ${key.toUpperCase()} LOG ===\n${jsonData.data[key]}\n\n`;
          });
        } else if (typeof jsonData.data === "string") {
          logContent = jsonData.data;
        }

        setLogs(logContent);
        setError("");
      } else {
        setError("無法獲取 log 數據");
      }
    } catch (err) {
      console.error("Fetch log error:", err);
      setError("獲取 log 時發生錯誤");
    }
  };

  // 初始化時獲取 logs
  useEffect(() => {
    if (isOpen && taskId) {
      setIsLoading(true);
      fetchLogs().finally(() => setIsLoading(false));
      
      // 設置定期更新
      intervalRef.current = setInterval(fetchLogs, refreshInterval);
    }

    // 清理函數
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen, taskId, taskType, refreshInterval]);

  // 自動滾動到底部
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // 處理手動滾動
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
    setAutoScroll(isAtBottom);
  };

  // 下載 log 文件
  const downloadLogs = () => {
    if (!logs) return;
    
    const blob = new Blob([logs], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${taskName}_log_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 max-w-6xl h-4/5 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              即時 Log 查看器
            </h2>
            <p className="text-gray-600 mt-1">
              Task: <span className="font-medium">{taskName}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadLogs}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              disabled={!logs}
            >
              下載 Log
            </button>
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoScroll 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              自動滾動: {autoScroll ? "開" : "關"}
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              關閉
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {isLoading && !logs ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">載入 Log 中...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              <div className="text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <div className="text-lg font-medium">{error}</div>
              </div>
            </div>
          ) : (
            <div className="h-full relative">
              {/* Log Container */}
              <div 
                ref={logContainerRef}
                onScroll={handleScroll}
                className="h-full bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-y-auto scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-w-2"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {logs || "暫無 log 數據..."}
              </div>
              
              {/* Status Indicator */}
              <div className="absolute top-2 right-2">
                <div className="flex items-center bg-gray-800 bg-opacity-90 rounded-full px-3 py-1 text-xs text-white">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  即時更新中
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          Log 每 {refreshInterval / 1000} 秒自動更新一次
        </div>
      </div>
    </div>
  );
};

export default RealtimeLogModal;
