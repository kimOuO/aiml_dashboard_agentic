// utils/promptBuilder.ts
import { ContentAnalyzer, PageContext } from '@/lib/contentAnalyzer';

export class PromptBuilder {
  static buildIntelligentPrompt(userMessage: string): string {
    const context = ContentAnalyzer.analyzePageContent();
    
    return this.buildContextualPrompt({
      pageContext: context,
      userMessage
    });
  }

  static buildContextualPrompt(data: { pageContext: PageContext; userMessage: string }): string {
    const { pageContext, userMessage } = data;
    
    let prompt = `[CONTEXT]
Page: ${pageContext.pageTitle}
Entity: ${pageContext.semanticContext.entityType} - ${pageContext.semanticContext.entityName}
Section: ${pageContext.semanticContext.section}
Action: ${pageContext.semanticContext.action}`;

    // Add navigation context
    if (pageContext.navigationContext.length > 0) {
      const navLinks = pageContext.navigationContext
        .filter(nav => nav.clickable)
        .map(nav => nav.text)
        .join(', ');
      
      if (navLinks) {
        prompt += `
Available Navigation: ${navLinks}`;
      }
    }

    // Add primary actions
    if (pageContext.primaryActions.length > 0) {
      prompt += `
Primary Actions: ${pageContext.primaryActions.join(', ')}`;
    }

    // Add form context
    const activeForms = pageContext.formContext.filter(form => 
      form.isModal ? true : form.fields.length > 0
    );
    
    if (activeForms.length > 0) {
      const activeForm = activeForms[0]; // Focus on first active form
      
      if (activeForm.isModal && activeForm.modalTitle) {
        prompt += `
Modal: ${activeForm.modalTitle}`;
      }
      
      if (activeForm.fields.length > 0) {
        const fieldDescriptions = activeForm.fields.map(field => 
          `${field.label || field.name} (${field.type})`
        ).join(', ');
        
        prompt += `
Form Fields: ${fieldDescriptions}`;
        
        // Highlight readonly fields
        const readonlyFields = activeForm.fields.filter(f => f.readonly);
        if (readonlyFields.length > 0) {
          const readonlyNames = readonlyFields.map(f => f.label || f.name);
          prompt += `
Note: Read-only fields: ${readonlyNames.join(', ')}`;
        }
      }
      
      if (activeForm.submitButtons.length > 0) {
        prompt += `
Form Actions: ${activeForm.submitButtons.join(', ')}`;
      }
    }

    // Add data context
    if (pageContext.dataContext.cards.length > 0) {
      prompt += `
Data: ${pageContext.dataContext.cards.length} items displayed`;
      
      if (pageContext.dataContext.pagination) {
        prompt += ` (page ${pageContext.dataContext.pagination.currentPage} of ${pageContext.dataContext.pagination.totalPages})`;
      }
    }

    // Add capabilities
    if (pageContext.semanticContext.capabilities.length > 0) {
      prompt += `
User Can: ${pageContext.semanticContext.capabilities.join(', ')}`;
    }

    prompt += `

[USER_QUESTION]
${userMessage}

Provide specific help based on the current page context. Reference available actions and navigation options. For read-only fields, explain their purpose instead of suggesting edits.`;

    return prompt;
  }

  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}