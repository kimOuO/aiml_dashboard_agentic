export const INDEXED_DB_HYPERPARAMETER_STORAGE = {
  dbName: 'HyperparameterStorage',
  dbVersion: 1,
  storeName: 'hyperparameters',

  // 初始化 IndexedDB
  initDB: () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        INDEXED_DB_HYPERPARAMETER_STORAGE.dbName, 
        INDEXED_DB_HYPERPARAMETER_STORAGE.dbVersion
      );

      request.onerror = () => {
        console.error('IndexedDB 初始化失敗:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 創建 object store 如果不存在
        if (!db.objectStoreNames.contains(INDEXED_DB_HYPERPARAMETER_STORAGE.storeName)) {
          const objectStore = db.createObjectStore(
            INDEXED_DB_HYPERPARAMETER_STORAGE.storeName, 
            { keyPath: 'pipelineUID' }
          );
          
          // 創建索引
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('detectedAt', 'detectedAt', { unique: false });
          objectStore.createIndex('paramCount', 'paramCount', { unique: false });
        }
      };
    });
  },

  // 儲存超參數到 IndexedDB
  saveHyperparameters: async (pipelineUID, hyperparameters) => {
    try {
      const db = await INDEXED_DB_HYPERPARAMETER_STORAGE.initDB();
      
      const dataToStore = {
        pipelineUID,
        hyperparameters,
        timestamp: Date.now(),
        version: '1.0',
        detectedAt: new Date().toISOString(),
        paramCount: Object.keys(hyperparameters).length,
        storageType: 'indexedDB'
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([INDEXED_DB_HYPERPARAMETER_STORAGE.storeName], 'readwrite');
        const objectStore = transaction.objectStore(INDEXED_DB_HYPERPARAMETER_STORAGE.storeName);
        
        const request = objectStore.put(dataToStore);
        
        request.onsuccess = () => {
          console.log(`Hyperparameters saved to IndexedDB for pipeline: ${pipelineUID}`);
          resolve(true);
        };
        
        request.onerror = () => {
          console.error('Error saving hyperparameters to IndexedDB:', request.error);
          reject(request.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    } catch (error) {
      console.error('Error saving hyperparameters to IndexedDB:', error);
      return false;
    }
  },

  // 從 IndexedDB 讀取超參數
  loadHyperparameters: async (pipelineUID) => {
    try {
      const db = await INDEXED_DB_HYPERPARAMETER_STORAGE.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([INDEXED_DB_HYPERPARAMETER_STORAGE.storeName], 'readonly');
        const objectStore = transaction.objectStore(INDEXED_DB_HYPERPARAMETER_STORAGE.storeName);
        
        const request = objectStore.get(pipelineUID);
        
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            console.log(`Hyperparameters loaded from IndexedDB for pipeline: ${pipelineUID}`);
            resolve(result.hyperparameters);
          } else {
            console.log(`No hyperparameter data found for pipeline: ${pipelineUID}`);
            resolve(null);
          }
        };
        
        request.onerror = () => {
          console.error('Error loading hyperparameters from IndexedDB:', request.error);
          reject(request.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    } catch (error) {
      console.error('Error loading hyperparameters from IndexedDB:', error);
      return null;
    }
  },

  // 生成 config 模板基於偵測到的超參數
  generateConfigTemplate: async (pipelineUID) => {
    try {
      const hyperparams = await INDEXED_DB_HYPERPARAMETER_STORAGE.loadHyperparameters(pipelineUID);
      
      if (!hyperparams || Object.keys(hyperparams).length === 0) {
        // 如果沒有偵測到超參數，返回基本模板
        return {
          "config_type": "training_parameters",
          "description": "Basic training configuration",
          "parameters": {
            "learning_rate": {
              "value": 0.001,
              "type": "float",
              "description": "Learning rate for optimizer",
              "tunable": true
            },
            "batch_size": {
              "value": 32,
              "type": "integer",
              "description": "Batch size for training", 
              "tunable": true
            },
            "epochs": {
              "value": 100,
              "type": "integer",
              "description": "Number of training epochs",
              "tunable": true
            },
            "dropout_rate": {
              "value": 0.5,
              "type": "float",
              "description": "Dropout rate for regularization",
              "tunable": true
            },
            "additional_layer": {
              "value": 2,
              "type": "integer",
              "description": "Number of additional hidden layers",
              "tunable": true
            }
          }
        };
      }

      // 根據偵測到的超參數生成配置
      const configTemplate = {
        "config_type": "auto_detected_parameters",
        "description": `Auto-generated from pipeline: ${pipelineUID}`,
        "detected_timestamp": new Date().toISOString(),
        "parameters": {}
      };

      // 轉換偵測到的超參數為配置格式
      Object.entries(hyperparams).forEach(([param, info]) => {
        if (!param.startsWith('_')) { // 跳過內部參數
          let value = info.value;
          
          // 根據類型轉換值
          if (info.type === 'integer') {
            value = parseInt(info.value);
          } else if (info.type === 'float') {
            value = parseFloat(info.value);
          } else if (info.type === 'boolean') {
            value = info.value.toLowerCase() === 'true';
          }
          
          configTemplate.parameters[param] = {
            value: value,
            type: info.type,
            description: info.description || `Auto-detected ${param}`,
            source: "hyperparameter_detection",
            tunable: true
          };
        }
      });

      return configTemplate;
    } catch (error) {
      console.error('Error generating config template:', error);
      return null;
    }
  },

  // 檢查 pipeline 是否有可用的超參數
  hasSavedHyperparameters: async (pipelineUID) => {
    try {
      const hyperparams = await INDEXED_DB_HYPERPARAMETER_STORAGE.loadHyperparameters(pipelineUID);
      return hyperparams !== null;
    } catch (error) {
      console.error('Error checking saved hyperparameters:', error);
      return false;
    }
  },

  // 刪除超參數資料
  removeHyperparameters: async (pipelineUID) => {
    try {
      const db = await INDEXED_DB_HYPERPARAMETER_STORAGE.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([INDEXED_DB_HYPERPARAMETER_STORAGE.storeName], 'readwrite');
        const objectStore = transaction.objectStore(INDEXED_DB_HYPERPARAMETER_STORAGE.storeName);
        
        const request = objectStore.delete(pipelineUID);
        
        request.onsuccess = () => {
          console.log(`Hyperparameter data removed for pipeline: ${pipelineUID}`);
          resolve(true);
        };
        
        request.onerror = () => {
          console.error('Error removing hyperparameter data:', request.error);
          reject(request.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    } catch (error) {
      console.error('Error removing hyperparameter data:', error);
      return false;
    }
  },

  // 列出所有儲存的超參數
  listAllHyperparameters: async () => {
    try {
      const db = await INDEXED_DB_HYPERPARAMETER_STORAGE.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([INDEXED_DB_HYPERPARAMETER_STORAGE.storeName], 'readonly');
        const objectStore = transaction.objectStore(INDEXED_DB_HYPERPARAMETER_STORAGE.storeName);
        
        const request = objectStore.getAll();
        
        request.onsuccess = () => {
          const results = request.result.map(item => ({
            pipelineUID: item.pipelineUID,
            timestamp: item.timestamp,
            detectedAt: item.detectedAt,
            paramCount: item.paramCount,
            version: item.version
          }));
          resolve(results);
        };
        
        request.onerror = () => {
          console.error('Error listing hyperparameter data:', request.error);
          reject(request.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    } catch (error) {
      console.error('Error listing hyperparameter data:', error);
      return [];
    }
  },

  // 清理舊的資料
  cleanupOldData: async (daysToKeep = 30) => {
    try {
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
      const db = await INDEXED_DB_HYPERPARAMETER_STORAGE.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([INDEXED_DB_HYPERPARAMETER_STORAGE.storeName], 'readwrite');
        const objectStore = transaction.objectStore(INDEXED_DB_HYPERPARAMETER_STORAGE.storeName);
        const index = objectStore.index('timestamp');
        
        const range = IDBKeyRange.upperBound(cutoffTime);
        const request = index.openCursor(range);
        
        let deletedCount = 0;
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            deletedCount++;
            console.log(`Cleaned up old hyperparameter data: ${cursor.value.pipelineUID}`);
            cursor.continue();
          } else {
            console.log(`Cleanup completed. Deleted ${deletedCount} old records.`);
            resolve(deletedCount);
          }
        };
        
        request.onerror = () => {
          console.error('Error during cleanup:', request.error);
          reject(request.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    } catch (error) {
      console.error('Error cleaning up old hyperparameter data:', error);
      return 0;
    }
  },

  // 獲取存儲統計信息
  getStorageStats: async () => {
    try {
      const db = await INDEXED_DB_HYPERPARAMETER_STORAGE.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([INDEXED_DB_HYPERPARAMETER_STORAGE.storeName], 'readonly');
        const objectStore = transaction.objectStore(INDEXED_DB_HYPERPARAMETER_STORAGE.storeName);
        
        const countRequest = objectStore.count();
        const getAllRequest = objectStore.getAll();
        
        let totalFiles = 0;
        let totalSize = 0;
        let oldestTime = Date.now();
        let newestTime = 0;
        let oldestFile = null;
        let newestFile = null;

        countRequest.onsuccess = () => {
          totalFiles = countRequest.result;
        };

        getAllRequest.onsuccess = () => {
          const results = getAllRequest.result;
          
          results.forEach(item => {
            // 估算大小
            totalSize += JSON.stringify(item).length;
            
            if (item.timestamp < oldestTime) {
              oldestTime = item.timestamp;
              oldestFile = item.pipelineUID;
            }
            
            if (item.timestamp > newestTime) {
              newestTime = item.timestamp;
              newestFile = item.pipelineUID;
            }
          });

          resolve({
            totalFiles,
            totalSize,
            oldestFile,
            newestFile,
            storageType: 'IndexedDB'
          });
        };
        
        countRequest.onerror = getAllRequest.onerror = () => {
          console.error('Error getting storage stats:', countRequest.error || getAllRequest.error);
          reject(countRequest.error || getAllRequest.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  },

  // 導出所有超參數為 JSON 檔案
  exportAllHyperparameters: async () => {
    try {
      const allHyperparams = await INDEXED_DB_HYPERPARAMETER_STORAGE.listAllHyperparameters();
      
      const exportData = {
        exportDate: new Date().toISOString(),
        totalPipelines: allHyperparams.length,
        storageType: 'IndexedDB',
        hyperparameters: {}
      };

      // 獲取每個 pipeline 的詳細超參數
      for (const item of allHyperparams) {
        const hyperparams = await INDEXED_DB_HYPERPARAMETER_STORAGE.loadHyperparameters(item.pipelineUID);
        if (hyperparams) {
          exportData.hyperparameters[item.pipelineUID] = {
            metadata: {
              detectedAt: item.detectedAt,
              paramCount: item.paramCount,
              timestamp: item.timestamp,
              version: item.version
            },
            parameters: hyperparams
          };
        }
      }

      // 創建下載連結
      const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `hyperparameters_indexedDB_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Hyperparameters exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting hyperparameters:', error);
      return false;
    }
  },

  // 從 JSON 檔案導入超參數
  importHyperparameters: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          if (!importData.hyperparameters) {
            reject(new Error('Invalid file format: missing hyperparameters'));
            return;
          }

          let importCount = 0;
          const entries = Object.entries(importData.hyperparameters);
          
          for (const [pipelineUID, data] of entries) {
            if (data.parameters) {
              try {
                const success = await INDEXED_DB_HYPERPARAMETER_STORAGE.saveHyperparameters(
                  pipelineUID, 
                  data.parameters
                );
                if (success) importCount++;
              } catch (error) {
                console.error(`Failed to import hyperparameters for pipeline ${pipelineUID}:`, error);
              }
            }
          }

          console.log(`Imported hyperparameters for ${importCount} pipelines`);
          resolve(importCount);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  },

  // 搜尋超參數
  searchHyperparameters: async (searchTerm) => {
    try {
      const allData = await INDEXED_DB_HYPERPARAMETER_STORAGE.listAllHyperparameters();
      const results = [];

      for (const item of allData) {
        const hyperparams = await INDEXED_DB_HYPERPARAMETER_STORAGE.loadHyperparameters(item.pipelineUID);
        
        if (hyperparams) {
          // 搜尋 pipeline UID 或參數名稱
          const matchesPipelineUID = item.pipelineUID.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesParamName = Object.keys(hyperparams).some(param => 
            param.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          if (matchesPipelineUID || matchesParamName) {
            results.push({
              ...item,
              hyperparameters: hyperparams
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching hyperparameters:', error);
      return [];
    }
  }
};