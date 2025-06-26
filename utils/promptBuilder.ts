import { SYSTEM_PROMPTS } from '../config/systemPrompts';

export interface ContextualPromptData {
  pageType: string;
  projectName?: string;
  applicationName?: string;
  pipelineName?: string;
  contextInfo: string;
  helpTopics: string[];
  userMessage: string;
  modalType?: string;
  modalTitle?: string;
  modalFields?: Array<{ label?: string; placeholder?: string; name?: string; type?: string }>;
  modalButtons?: string[];
}

export class PromptBuilder {
  /**
   * Builds a token-efficient contextual prompt
   */
  static buildContextualPrompt(data: ContextualPromptData): string {
    const pageConfig = SYSTEM_PROMPTS.pageSpecific[data.pageType] || SYSTEM_PROMPTS.pageSpecific.general;
    
    // Build a concise, structured prompt
    const contextualPrompt = `[CONTEXT]
Page: ${data.pageType}
${data.projectName ? `Project: ${data.projectName}` : ''}
${data.applicationName ? `Application: ${data.applicationName}` : ''}
${data.pipelineName ? `Pipeline: ${data.pipelineName}` : ''}

[CURRENT_SITUATION]
${pageConfig.context}

[ASSISTANT_FOCUS]
${pageConfig.instructions}

[USER_QUESTION]
${data.userMessage}

Provide a concise, actionable response focused on the user's current page and immediate needs.`;

    return contextualPrompt;
  }

  /**
   * Builds an even more token-efficient prompt for simple queries
   */
  static buildMinimalPrompt(data: ContextualPromptData): string {
    const pageConfig = SYSTEM_PROMPTS.pageSpecific[data.pageType] || SYSTEM_PROMPTS.pageSpecific.general;
    
    return `Context: ${data.pageType}${data.pipelineName ? ` (${data.pipelineName})` : ''}
Focus: ${pageConfig.instructions.split('.')[0]}
Q: ${data.userMessage}`;
  }

  /**
   * Estimates token count (rough approximation: 1 token ≈ 4 characters)
   */
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Chooses the most appropriate prompt based on message complexity
   */
  static buildOptimalPrompt(data: ContextualPromptData): string {
    const messageLength = data.userMessage.length;
    const isComplexQuery = messageLength > 50 || data.userMessage.includes('?') || data.userMessage.toLowerCase().includes('how');
    
    if (isComplexQuery) {
      return this.buildContextualPrompt(data);
    } else {
      return this.buildMinimalPrompt(data);
    }
  }

  /**
   * Builds a modal-aware contextual prompt
   */
  static buildModalAwarePrompt(data: ContextualPromptData): string {
    const pageConfig = SYSTEM_PROMPTS.pageSpecific[data.pageType] || SYSTEM_PROMPTS.pageSpecific.general;
    
    let contextualPrompt = `[CONTEXT]
Page: ${data.pageType}
${data.projectName ? `Project: ${data.projectName}` : ''}
${data.applicationName ? `Application: ${data.applicationName}` : ''}
${data.pipelineName ? `Pipeline: ${data.pipelineName}` : ''}`;

    // Add navigation context
    if (data.navigationLinks && data.navigationLinks.length > 0) {
      const navLinks = data.navigationLinks
        .filter(link => link.clickable)
        .map(link => link.text)
        .join(', ');
      
      if (navLinks) {
        contextualPrompt += `
Available Navigation: ${navLinks}`;
      }
    }
    
    if (data.availableActions && data.availableActions.length > 0) {
      contextualPrompt += `
Primary Actions: ${data.availableActions.join(', ')}`;
    }
    
    if (data.breadcrumbs && data.breadcrumbs.length > 0) {
      const cleanBreadcrumbs = data.breadcrumbs.filter(crumb => !this.isUUIDOrTimestamp(crumb));
      if (cleanBreadcrumbs.length > 0) {
        contextualPrompt += `
Current Path: ${cleanBreadcrumbs.join(' → ')}`;
      }
    }

    // Add modal-specific context if present
    if (data.modalType) {
      contextualPrompt += `
Modal: ${data.modalType}
Modal Title: "${data.modalTitle}"`;
      
      if (data.modalFields && data.modalFields.length > 0) {
        const fieldDescriptions = data.modalFields.map(field => {
          const labelText = field.label || field.placeholder || field.name;
          return `${labelText} (${field.type})`;
        }).join(', ');
        
        contextualPrompt += `
Form Fields: ${fieldDescriptions}`;
        
        // Add readonly field guidance
        const readonlyFields = data.modalFields.filter(f => f.readonly || f.type.includes('readonly'));
        if (readonlyFields.length > 0) {
          const readonlyFieldNames = readonlyFields.map(f => f.label || f.placeholder || f.name);
          contextualPrompt += `
Note: These fields are read-only: ${readonlyFieldNames.join(', ')}`;
        }
      }
      
      if (data.modalButtons && data.modalButtons.length > 0) {
        contextualPrompt += `
Modal Actions: ${data.modalButtons.join(', ')}`;
      }
    }

    contextualPrompt += `

[CURRENT_SITUATION]
${pageConfig.context}

[ASSISTANT_FOCUS]
${pageConfig.instructions}
${data.modalType ? 'Focus on helping with the current modal form. Do not suggest editing read-only fields.' : ''}

[USER_QUESTION]
${data.userMessage}

Provide specific help referencing the available navigation and actions. For read-only fields, explain their purpose instead of suggesting edits.`;

    return contextualPrompt;
  }

  // Helper function for UUID detection
  static isUUIDOrTimestamp(text: string): boolean {
    const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    const timestampPatterns = [
      /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      /^\d{13}$/,
    ];
    
    if (uuidPattern.test(text)) return true;
    return timestampPatterns.some(pattern => pattern.test(text));
  }
}