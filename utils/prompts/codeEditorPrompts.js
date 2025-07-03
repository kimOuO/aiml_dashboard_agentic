// utils/prompts/codeEditorPrompts.js
export const CODE_EDITOR_PROMPTS = {
  // Simplified prompt - let Dify handle the template and context
  aiChatPrompt: (fileName, code, userRequest, pipelineContext = null) => {
    const pipelineType = pipelineContext || detectPipelineType(fileName, code);
    
    return `File: ${fileName}
Pipeline: ${pipelineType}
Code:
\`\`\`python
${code}
\`\`\`
Request: ${userRequest}`;
  },

  // Generate user identifier with pipeline context
  generateUserId: (pipelineType = 'unknown') => `code-editor-${pipelineType}-user`,

  // Quick action prompts tailored to pipeline types
  getQuickActions: (pipelineType) => {
    const baseActions = [
      'Review this code',
      'Add comments',
      'Add error handling'
    ];

    const pipelineSpecificActions = {
      preprocessing: [
        'Add data validation',
        'Optimize data loading',
        'Add data cleaning steps',
        'Create data quality checks'
      ],
      training: [
        'Add model validation',
        'Implement early stopping',
        'Add hyperparameter tuning',
        'Create training metrics'
      ],
      retrain: [
        'Add incremental learning',
        'Implement model comparison',
        'Add data drift detection',
        'Create retraining triggers',
        'Add model versioning'
      ],
      tuning: [
        'Implement hyperparameter optimization',
        'Add parameter search algorithms',
        'Create tuning experiments',
        'Add performance tracking',
        'Implement automated tuning'
      ],
      evaluation: [
        'Add evaluation metrics',
        'Implement cross-validation',
        'Add model comparison',
        'Create evaluation reports'
      ]
    };

    return [...baseActions, ...(pipelineSpecificActions[pipelineType] || [])];
  },

  // Simplified welcome message
  welcomeMessage: `👋 Hi! I'm here to help you with your code. Use Ctrl+Z to undo and Ctrl+Y to redo changes.

What would you like me to help you with?`
};

// Helper function to detect pipeline type from context
function detectPipelineType(fileName, code) {
  const fileNameLower = fileName.toLowerCase();
  const codeLower = code.toLowerCase();

  if (fileNameLower.includes('preprocessing') || codeLower.includes('preprocess')) {
    return 'preprocessing';
  }
  if (fileNameLower.includes('training') || codeLower.includes('train')) {
    return 'training';
  }
  if (fileNameLower.includes('retrain') || codeLower.includes('retrain')) {
    return 'retrain';
  }
  if (fileNameLower.includes('tuning') || codeLower.includes('tuning') || codeLower.includes('hyperparameter')) {
    return 'tuning';
  }
  if (fileNameLower.includes('evaluation') || codeLower.includes('evaluate')) {
    return 'evaluation';
  }
  
  return 'general';
}