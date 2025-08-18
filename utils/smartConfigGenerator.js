import { INDEXED_DB_HYPERPARAMETER_STORAGE } from './indexedDBHyperparameterStorage';

export const SMART_CONFIG_GENERATOR = {
  /**
   * 生成簡潔的智能配置 - 只包含參數和值
   */
  generateSmartConfig: async (pipelineUID) => {
    try {
      console.log(`🧠 Generating simple smart config for pipeline: ${pipelineUID}`);
      
      // 1. 從 IndexedDB 加載偵測到的超參數
      const detectedParams = await INDEXED_DB_HYPERPARAMETER_STORAGE.loadHyperparameters(pipelineUID);
      
      if (detectedParams && Object.keys(detectedParams).length > 0) {
        console.log(`✅ Found ${Object.keys(detectedParams).length} detected parameters in IndexedDB`);
        
        // 2. 🎯 只生成簡潔的 key-value 格式
        const simpleConfig = {};
        
        // 3. 提取偵測到的參數，只保留參數名和值
        Object.entries(detectedParams).forEach(([param, info]) => {
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
            
            // 特殊處理 additional_layer - 如果您想要 boolean
            if (param === 'additional_layer') {
              // 選擇：保持數字或轉為 boolean
              // value = parseInt(info.value) > 0; // boolean 版本
              value = parseInt(info.value); // 數字版本
            }
            
            simpleConfig[param] = value;
          }
        });

        console.log(`🎯 Generated simple config:`, simpleConfig);
        return simpleConfig;
        
      } else {
        console.log(`ℹ️ No detected parameters, returning empty config`);
        return {};
      }
      
    } catch (error) {
      console.error('❌ Error generating smart config:', error);
      return {};
    }
  },

  /**
   * 生成標準簡潔配置
   */
  generateStandardSimpleConfig: () => {
    return {
      "learning_rate": 0.001,
      "batch_size": 32,
      "epochs": 100
    };
  },

  /**
   * 檢查 pipeline 是否有可用的智能配置
   */
  hasSmartConfig: async (pipelineUID) => {
    try {
      const hasDetected = await INDEXED_DB_HYPERPARAMETER_STORAGE.hasSavedHyperparameters(pipelineUID);
      return hasDetected;
    } catch (error) {
      console.error('Error checking smart config availability:', error);
      return false;
    }
  },

  /**
   * 獲取配置統計信息
   */
  getConfigStats: async (pipelineUID) => {
    try {
      const detectedParams = await INDEXED_DB_HYPERPARAMETER_STORAGE.loadHyperparameters(pipelineUID);
      
      if (!detectedParams) {
        return {
          hasDetected: false,
          detectedCount: 0,
          completeness: 0
        };
      }
      
      const detectedCount = Object.keys(detectedParams).length;
      const completeness = Math.min(100, detectedCount * 20);
      
      return {
        hasDetected: true,
        detectedCount,
        completeness,
        detectedParams: Object.keys(detectedParams)
      };
      
    } catch (error) {
      console.error('Error getting config stats:', error);
      return {
        hasDetected: false,
        detectedCount: 0,
        completeness: 0,
        error: error.message
      };
    }
  }
};