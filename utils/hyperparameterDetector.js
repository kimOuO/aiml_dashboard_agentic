export const HYPERPARAMETER_DETECTOR = {
  // 偵測 training pipeline 中的超參數
  detectHyperparameters: (pipelineCode) => {
    const hyperparameters = {};
    
    if (!pipelineCode) return hyperparameters;

    console.log('🔍 Starting hyperparameter detection...');

    // 🆕 偵測 config.get() 無默認值的模式
    const configGetWithoutDefault = /config\.get\(\s*['""]([^'"]+)['""],?\s*\)/gi;
    
    let match;
    while ((match = configGetWithoutDefault.exec(pipelineCode)) !== null) {
      const paramName = match[1];
      
      // 只處理我們關心的參數名稱
      const knownParams = [
        'learning_rate', 'lr', 'batch_size', 'epochs', 'num_epochs',
        'dropout_rate', 'dropout', 'additional_layer', 'num_layers',
        'hidden_layers', 'hidden_size', 'hidden_dim', 'optimizer',
        'weight_decay', 'momentum', 'hidden_units'
      ];
      
      if (knownParams.includes(paramName.toLowerCase()) && !hyperparameters[paramName]) {
        hyperparameters[paramName] = {
          value: "", // 🎯 留空值
          type: inferTypeFromParamName(paramName),
          description: `Found via config.get(): ${paramName} (no default value)`,
          source: 'config_get_no_default',
          pattern: 'config.get() without default',
          location: match.index
        };
        console.log(`✅ Found config.get (no default) param ${paramName}:`, hyperparameters[paramName]);
      }
    }

    // 🆕 偵測 config.get() 有默認值的模式
    const configGetWithDefault = /config\.get\(\s*['""]([^'"]+)['""],?\s*([\d.e-]+|['""][^'"]+['""])\s*\)/gi;
    
    configGetWithDefault.lastIndex = 0; // 重置索引
    while ((match = configGetWithDefault.exec(pipelineCode)) !== null) {
      const paramName = match[1];
      const paramValue = match[2];
      
      // 清理引號
      let cleanValue = paramValue;
      if (paramValue.startsWith('"') || paramValue.startsWith("'")) {
        cleanValue = paramValue.slice(1, -1);
      }
      
      // 只處理我們關心的參數名稱，且尚未被無默認值版本偵測到
      const knownParams = [
        'learning_rate', 'lr', 'batch_size', 'epochs', 'num_epochs',
        'dropout_rate', 'dropout', 'additional_layer', 'num_layers',
        'hidden_layers', 'hidden_size', 'hidden_dim', 'optimizer',
        'weight_decay', 'momentum', 'hidden_units'
      ];
      
      if (knownParams.includes(paramName.toLowerCase()) && !hyperparameters[paramName]) {
        hyperparameters[paramName] = {
          value: cleanValue,
          type: inferType(cleanValue),
          description: `Found via config.get(): ${paramName}`,
          source: 'config_get_with_default',
          pattern: 'config.get() with default',
          location: match.index
        };
        console.log(`✅ Found config.get (with default) param ${paramName}:`, hyperparameters[paramName]);
      }
    }

    // 原有的其他偵測模式...
    const patterns = {
      learning_rate: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]learning_rate['""],?\s*([\d.e-]+)\s*\)/gi,
        /config\.get\(\s*['""]lr['""],?\s*([\d.e-]+)\s*\)/gi,
        /config\.get\(\s*['""]LR['""],?\s*([\d.e-]+)\s*\)/gi,
        // 原有模式
        /learning_rate\s*=\s*([\d.e-]+)/gi,
        /lr\s*=\s*([\d.e-]+)/gi,
        /LR\s*=\s*([\d.e-]+)/gi,
        /'learning_rate':\s*([\d.e-]+)/gi,
        /"learning_rate":\s*([\d.e-]+)/gi,
        /Adam.*lr\s*=\s*([\d.e-]+)/gi,
        /SGD.*lr\s*=\s*([\d.e-]+)/gi,
        /optim\.\w+.*lr\s*=\s*([\d.e-]+)/gi,
      ],
      batch_size: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]batch_size['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]batchsize['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]BATCH_SIZE['""],?\s*(\d+)\s*\)/gi,
        // 原有模式
        /batch_size\s*=\s*(\d+)/gi,
        /BATCH_SIZE\s*=\s*(\d+)/gi,
        /'batch_size':\s*(\d+)/gi,
        /"batch_size":\s*(\d+)/gi,
        /DataLoader.*batch_size\s*=\s*(\d+)/gi,
        /batch_size\s*:\s*(\d+)/gi,
      ],
      epochs: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]epochs['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]num_epochs['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]EPOCHS['""],?\s*(\d+)\s*\)/gi,
        // 原有模式
        /epochs\s*=\s*(\d+)/gi,
        /num_epochs\s*=\s*(\d+)/gi,
        /EPOCHS\s*=\s*(\d+)/gi,
        /'epochs':\s*(\d+)/gi,
        /"epochs":\s*(\d+)/gi,
        /\.fit.*epochs\s*=\s*(\d+)/gi,
        /train.*epochs\s*=\s*(\d+)/gi,
      ],
      dropout_rate: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]dropout_rate['""],?\s*([\d.]+)\s*\)/gi,
        /config\.get\(\s*['""]dropout['""],?\s*([\d.]+)\s*\)/gi,
        /config\.get\(\s*['""]DROPOUT_RATE['""],?\s*([\d.]+)\s*\)/gi,
        /config\.get\(\s*['""]DROPOUT['""],?\s*([\d.]+)\s*\)/gi,
        // 原有模式
        /dropout_rate\s*=\s*([\d.]+)/gi,
        /dropout\s*=\s*([\d.]+)/gi,
        /DROPOUT_RATE\s*=\s*([\d.]+)/gi,
        /DROPOUT\s*=\s*([\d.]+)/gi,
        /'dropout_rate':\s*([\d.]+)/gi,
        /"dropout_rate":\s*([\d.]+)/gi,
        /'dropout':\s*([\d.]+)/gi,
        /"dropout":\s*([\d.]+)/gi,
        /Dropout\(\s*([\d.]+)\s*\)/gi,
        /nn\.Dropout\(\s*([\d.]+)\s*\)/gi,
        /layers\.Dropout\(\s*([\d.]+)\s*\)/gi,
        /F\.dropout.*p\s*=\s*([\d.]+)/gi,
        /dropout.*?(\d\.\d+)/gi,
        /dropout.*?=.*?(0\.\d+)/gi,
      ],
      additional_layer: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]additional_layer['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]num_layers['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]hidden_layers['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]n_layers['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]NUM_LAYERS['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]num_hidden_layers['""],?\s*(\d+)\s*\)/gi,
        // 原有模式
        /additional_layer\s*=\s*(\d+)/gi,
        /num_layers\s*=\s*(\d+)/gi,
        /hidden_layers\s*=\s*(\d+)/gi,
        /n_layers\s*=\s*(\d+)/gi,
        /NUM_LAYERS\s*=\s*(\d+)/gi,
        /num_hidden_layers\s*=\s*(\d+)/gi,
        /'additional_layer':\s*(\d+)/gi,
        /"additional_layer":\s*(\d+)/gi,
        /'num_layers':\s*(\d+)/gi,
        /"num_layers":\s*(\d+)/gi,
        /'hidden_layers':\s*(\d+)/gi,
        /"hidden_layers":\s*(\d+)/gi,
        /self\.layer\d+\s*=\s*nn\.Linear/gi,
        /self\.hidden\d+\s*=\s*nn\.Linear/gi,
      ],
      hidden_size: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]hidden_size['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]hidden_dim['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]HIDDEN_SIZE['""],?\s*(\d+)\s*\)/gi,
        /config\.get\(\s*['""]hidden_units['""],?\s*(\d+)\s*\)/gi,
        // 原有模式
        /hidden_size\s*=\s*(\d+)/gi,
        /hidden_dim\s*=\s*(\d+)/gi,
        /HIDDEN_SIZE\s*=\s*(\d+)/gi,
        /'hidden_size':\s*(\d+)/gi,
        /"hidden_size":\s*(\d+)/gi,
        /Linear\(\d+,\s*(\d+)\)/gi,
        /hidden_units\s*=\s*(\d+)/gi,
      ],
      optimizer: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]optimizer['""],?\s*['""](\w+)['""],?\s*\)/gi,
        /config\.get\(\s*['""]optim['""],?\s*['""](\w+)['""],?\s*\)/gi,
        /config\.get\(\s*['""]OPTIMIZER['""],?\s*['""](\w+)['""],?\s*\)/gi,
        // 原有模式
        /optimizer\s*=\s*['"](\w+)['"]/gi,
        /optim\.(\w+)/gi,
        /'optimizer':\s*['"](\w+)['"]/gi,
        /"optimizer":\s*"(\w+)"/gi,
        /torch\.optim\.(\w+)/gi,
      ],
      weight_decay: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]weight_decay['""],?\s*([\d.e-]+)\s*\)/gi,
        /config\.get\(\s*['""]WEIGHT_DECAY['""],?\s*([\d.e-]+)\s*\)/gi,
        /config\.get\(\s*['""]wd['""],?\s*([\d.e-]+)\s*\)/gi,
        // 原有模式
        /weight_decay\s*=\s*([\d.e-]+)/gi,
        /WEIGHT_DECAY\s*=\s*([\d.e-]+)/gi,
        /'weight_decay':\s*([\d.e-]+)/gi,
        /"weight_decay":\s*([\d.e-]+)/gi,
      ],
      momentum: [
        // 🆕 config.get() 模式
        /config\.get\(\s*['""]momentum['""],?\s*([\d.]+)\s*\)/gi,
        /config\.get\(\s*['""]MOMENTUM['""],?\s*([\d.]+)\s*\)/gi,
        // 原有模式
        /momentum\s*=\s*([\d.]+)/gi,
        /MOMENTUM\s*=\s*([\d.]+)/gi,
        /'momentum':\s*([\d.]+)/gi,
        /"momentum":\s*([\d.]+)/gi,
      ]
    };

    // 對每個超參數類型進行偵測
    Object.entries(patterns).forEach(([paramName, patternList]) => {
      patternList.forEach(pattern => {
        let match;
        pattern.lastIndex = 0; // 重置正則表達式索引
        
        while ((match = pattern.exec(pipelineCode)) !== null) {
          const value = match[1];
          
          // 特殊處理 additional_layer 的複雜偵測
          if (paramName === 'additional_layer') {
            if (pattern.source.includes('layer\\d+') || pattern.source.includes('hidden\\d+')) {
              // 計算 self.layerX 或 self.hiddenX 的數量
              const layerMatches = pipelineCode.match(/self\.(layer|hidden)\d+\s*=\s*nn\.Linear/g);
              if (layerMatches && layerMatches.length > 0) {
                const layerCount = layerMatches.length > 1 ? layerMatches.length - 1 : layerMatches.length;
                hyperparameters[paramName] = {
                  value: layerCount.toString(),
                  type: 'integer',
                  description: `Detected ${layerMatches.length} Linear layers (${layerCount} hidden layers)`,
                  source: 'code_structure_analysis',
                  pattern: 'Layer structure analysis',
                  location: match.index
                };
                console.log(`✅ Found ${paramName} via structure analysis:`, hyperparameters[paramName]);
              }
            } else if (value) {
              // 檢查是否為 config.get() 模式
              const isConfigGet = pattern.source.includes('config\\.get');
              hyperparameters[paramName] = {
                value: value,
                type: 'integer',
                description: getParameterDescription(paramName),
                source: isConfigGet ? 'config_get_analysis' : 'code_analysis',
                pattern: pattern.source,
                location: match.index
              };
              console.log(`✅ Found ${paramName} ${isConfigGet ? '(config.get)' : ''}:`, hyperparameters[paramName]);
            }
          } else if (value) {
            // 避免重複偵測同一個參數
            if (!hyperparameters[paramName]) {
              // 檢查是否為 config.get() 模式
              const isConfigGet = pattern.source.includes('config\\.get');
              hyperparameters[paramName] = {
                value: value,
                type: inferType(value),
                description: getParameterDescription(paramName),
                source: isConfigGet ? 'config_get_analysis' : 'code_analysis',
                pattern: pattern.source,
                location: match.index
              };
              console.log(`✅ Found ${paramName} ${isConfigGet ? '(config.get)' : ''}:`, hyperparameters[paramName]);
            }
          }
        }
      });
    });

    // 🆕 額外偵測通用的 config.get() 模式
    try {
      const genericConfigParams = detectGenericConfigGet(pipelineCode);
      console.log('🔍 Generic config.get patterns found:', genericConfigParams);
      
      if (genericConfigParams && typeof genericConfigParams === 'object') {
        Object.assign(hyperparameters, genericConfigParams);
      }
    } catch (error) {
      console.error('❌ Error detecting generic config.get patterns:', error);
    }

    // 偵測配置塊
    try {
      const configParams = detectConfigBlocks(pipelineCode);
      console.log('🔍 Config blocks found:', configParams);
      
      if (configParams && typeof configParams === 'object') {
        Object.assign(hyperparameters, configParams);
      }
    } catch (error) {
      console.error('❌ Error detecting config blocks:', error);
    }

    // 記錄偵測結果
    console.log(`🎯 Detection complete! Found ${Object.keys(hyperparameters).length} hyperparameters:`, hyperparameters);

    return hyperparameters;
  },

  generateHyperparameterConfig: (detectedParams) => {
    const config = {
      "hyperparameters": {},
      "metadata": {
        "detection_timestamp": new Date().toISOString(),
        "detected_count": Object.keys(detectedParams).length
      }
    };

    Object.entries(detectedParams).forEach(([param, info]) => {
      config.hyperparameters[param] = {
        "value": info.value,
        "type": info.type,
        "description": info.description || `Auto-detected ${param}`,
        "tunable": true,
        "source": info.source || "hyperparameter_detection"
      };
    });

    return config;
  },

  generateStandardTrainingConfig: () => {
    return {
      "config_type": "training_parameters",
      "description": "Standard training configuration template",
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
};

// 🆕 新增：偵測通用的 config.get() 模式
function detectGenericConfigGet(code) {
  const configParams = {};
  
  try {
    // 通用的 config.get() 模式
    const genericConfigPattern = /config\.get\(\s*['""]([^'"]+)['""],?\s*([\d.e-]+|['""][^'"]+['""])\s*\)/gi;
    
    let match;
    while ((match = genericConfigPattern.exec(code)) !== null) {
      const paramName = match[1];
      const paramValue = match[2];
      
      // 清理引號
      let cleanValue = paramValue;
      if (paramValue.startsWith('"') || paramValue.startsWith("'")) {
        cleanValue = paramValue.slice(1, -1);
      }
      
      // 只處理我們關心的參數名稱
      const knownParams = [
        'learning_rate', 'lr', 'batch_size', 'epochs', 'num_epochs',
        'dropout_rate', 'dropout', 'additional_layer', 'num_layers',
        'hidden_layers', 'hidden_size', 'hidden_dim', 'optimizer',
        'weight_decay', 'momentum', 'hidden_units'
      ];
      
      if (knownParams.includes(paramName.toLowerCase()) && !configParams[paramName]) {
        configParams[paramName] = {
          value: cleanValue,
          type: inferType(cleanValue),
          description: `Found via config.get(): ${paramName}`,
          source: 'generic_config_get',
          pattern: 'config.get() generic pattern',
          location: match.index
        };
        console.log(`✅ Found generic config.get param ${paramName}:`, configParams[paramName]);
      }
    }
  } catch (error) {
    console.error('❌ Error in detectGenericConfigGet:', error);
  }

  return configParams;
}

// 其他輔助函數保持不變...
function detectConfigBlocks(code) {
  const configParams = {};
  
  try {
    const configPatterns = [
      /config\s*=\s*\{([^}]+)\}/gi,
      /CONFIG\s*=\s*\{([^}]+)\}/gi,
      /hyperparams\s*=\s*\{([^}]+)\}/gi,
      /parameters\s*=\s*\{([^}]+)\}/gi,
      /settings\s*=\s*\{([^}]+)\}/gi,
    ];

    configPatterns.forEach(pattern => {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(code)) !== null) {
        const configBlock = match[1];
        console.log('🔍 Found config block:', configBlock);
        
        const paramPatterns = {
          learning_rate: /['"]?learning_rate['"]?\s*:\s*([\d.e-]+)/gi,
          batch_size: /['"]?batch_size['"]?\s*:\s*(\d+)/gi,
          epochs: /['"]?epochs['"]?\s*:\s*(\d+)/gi,
          dropout_rate: /['"]?dropout_rate['"]?\s*:\s*([\d.]+)/gi,
          additional_layer: /['"]?additional_layer['"]?\s*:\s*(\d+)/gi,
          hidden_size: /['"]?hidden_size['"]?\s*:\s*(\d+)/gi,
        };

        Object.entries(paramPatterns).forEach(([param, paramPattern]) => {
          paramPattern.lastIndex = 0;
          const paramMatch = paramPattern.exec(configBlock);
          if (paramMatch && !configParams[param]) {
            configParams[param] = {
              value: paramMatch[1],
              type: inferType(paramMatch[1]),
              description: `Found in config block: ${param}`,
              source: 'config_block',
              location: match.index + paramMatch.index
            };
            console.log(`✅ Found config param ${param}:`, configParams[param]);
          }
        });
      }
    });
  } catch (error) {
    console.error('❌ Error in detectConfigBlocks:', error);
  }

  return configParams;
}

function inferType(value) {
  if (!value) return 'string';
  
  const cleanValue = value.toString().replace(/['"]/g, '');
  
  if (/^\d+$/.test(cleanValue)) {
    return 'integer';
  }
  if (/^\d*\.\d+$/.test(cleanValue) || /^\d+\.?\d*e[+-]?\d+$/i.test(cleanValue)) {
    return 'float';
  }
  if (/^(true|false)$/i.test(cleanValue)) {
    return 'boolean';
  }
  return 'string';
}

function getParameterDescription(param) {
  const descriptions = {
    learning_rate: 'Learning rate for the optimizer',
    batch_size: 'Number of samples per batch',
    epochs: 'Number of training epochs',
    dropout_rate: 'Dropout rate for regularization (0.0-1.0)',
    additional_layer: 'Number of additional hidden layers in the model',
    hidden_size: 'Number of neurons in hidden layers',
    optimizer: 'Optimization algorithm (Adam, SGD, etc.)',
    weight_decay: 'Weight decay (L2 regularization) factor',
    momentum: 'Momentum factor for SGD optimizer'
  };
  
  return descriptions[param] || `Configuration parameter: ${param}`;
}

// 🆕 根據參數名稱推斷類型
function inferTypeFromParamName(paramName) {
  const paramLower = paramName.toLowerCase();
  
  if (paramLower.includes('rate') || paramLower.includes('lr') || paramLower.includes('momentum')) {
    return 'float';
  }
  if (paramLower.includes('size') || paramLower.includes('epoch') || paramLower.includes('layer') || paramLower.includes('dim')) {
    return 'integer';
  }
  if (paramLower.includes('optimizer') || paramLower.includes('optim')) {
    return 'string';
  }
  
  return 'string'; // 默認為字符串
}