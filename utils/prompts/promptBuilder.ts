// utils/promptBuilder.ts
import { ContentAnalyzer, PageContext } from '@/lib/contentAnalyzer';

export class PromptBuilder {
  static buildIntelligentPrompt(userMessage: string): string {
    return this.buildContextualPrompt({
      userMessage
    });
  }

  static buildContextualPrompt(data: { userMessage: string }): string {
    const { userMessage } = data;
    
    let prompt = `[CONTEXT]
Current URL: ${window.location.pathname}${window.location.search}`;

    prompt += `

[USER_QUESTION]
${userMessage}

Provide specific help based on the current page context and URL. Reference the current page and available functionality.`;

    return prompt;
  }

  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}