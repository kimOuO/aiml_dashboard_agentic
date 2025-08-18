export class UIInteractionService {
  private static instance: UIInteractionService;
  
  public static getInstance(): UIInteractionService {
    if (!UIInteractionService.instance) {
      UIInteractionService.instance = new UIInteractionService();
    }
    return UIInteractionService.instance;
  }

  // Smart element finder with multiple fallback strategies
  public findElement(selectors: string | string[]): Element | null {
    const selectorList = Array.isArray(selectors) ? selectors : [selectors];
    
    for (const selector of selectorList) {
      try {
        if (!selector || selector.trim() === '') continue;
        
        // Handle special temp selectors
        if (selector.includes('data-temp-highlight')) {
          const element = document.querySelector(selector);
          if (element) return element;
          continue;
        }
        
        // Try exact selector
        const element = document.querySelector(selector);
        if (element && this.isElementVisible(element)) return element;
        
      } catch (error) {
        console.warn(`Selector failed: ${selector}`, error);
      }
    }
    
    return null;
  }

  // Find elements by text content - improved
  public findElementByText(text: string, elementTypes: string[] = ['button', 'a']): Element | null {
    const searchText = text.toLowerCase();
    console.log(`Searching for text: "${text}" in elements:`, elementTypes);
    
    for (const elementType of elementTypes) {
      const elements = document.querySelectorAll(elementType);
      console.log(`Found ${elements.length} ${elementType} elements`);
      
      for (const element of elements) {
        const elementText = element.textContent?.toLowerCase() || '';
        if (elementText.includes(searchText) && this.isElementVisible(element)) {
          console.log(`Found matching element:`, element, `with text: "${elementText}"`);
          return element;
        }
      }
    }
    console.log(`No element found with text: "${text}"`);
    return null;
  }

  // Find ALL matching elements (for highlighting multiple elements) - improved
  public findAllElementsByText(text: string, elementTypes: string[] = ['button', 'a']): Element[] {
    const searchText = text.toLowerCase();
    const foundElements: Element[] = [];
    console.log(`Searching for ALL elements with text: "${text}"`);
    
    for (const elementType of elementTypes) {
      const elements = document.querySelectorAll(elementType);
      for (const element of elements) {
        const elementText = element.textContent?.toLowerCase() || '';
        if (elementText.includes(searchText) && this.isElementVisible(element)) {
          foundElements.push(element);
          console.log(`Found matching element:`, element);
        }
      }
    }
    console.log(`Found ${foundElements.length} elements with text: "${text}"`);
    return foundElements;
  }

  // Find ALL cards - more strict criteria for application cards
  public findAllCards(): Element[] {
    const foundElements: Element[] = [];
    console.log('Searching for cards with strict criteria...');
    
    // Look for all potential card elements
    const allElements = document.querySelectorAll('div, section, article');
    
    for (const element of allElements) {
      if (this.isApplicationCard(element)) {
        foundElements.push(element);
        console.log(`Added strict card element:`, element);
      }
    }
    
    console.log(`Found ${foundElements.length} strict application cards`);
    return foundElements;
  }

  // Check if element is a valid application card
  private isApplicationCard(element: Element): boolean {
    if (!this.isElementVisible(element)) return false;
    
    const htmlElement = element as HTMLElement;
    const style = window.getComputedStyle(htmlElement);
    const rect = htmlElement.getBoundingClientRect();
    
    // Must have reasonable card dimensions
    if (rect.width < 100 || rect.height < 80) return false;
    
    // Must have rounded corners (border-radius)
    const borderRadius = parseFloat(style.borderRadius || '0');
    if (borderRadius < 4) return false; // At least 4px border radius
    
    // Must contain UID pattern (alphanumeric string that looks like an ID)
    const textContent = element.textContent || '';
    const hasUID = /\b[a-f0-9]{8,}\b/i.test(textContent) || // Hex-like IDs
                   /\b[A-Z0-9]{6,}\b/.test(textContent) ||   // Uppercase alphanumeric IDs
                   /\buid[:\s]*[a-zA-Z0-9]+/i.test(textContent); // Explicit UID labels
    
    if (!hasUID) return false;
    
    // Additional checks for card-like appearance
    const hasBackground = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                         style.backgroundColor !== 'transparent';
    const hasBorder = parseFloat(style.borderWidth || '0') > 0;
    const hasShadow = style.boxShadow !== 'none';
    
    // Must have at least one card-like visual property
    if (!hasBackground && !hasBorder && !hasShadow) return false;
    
    console.log(`Valid application card found:`, {
      element,
      borderRadius,
      hasUID,
      textContent: textContent.substring(0, 100),
      dimensions: { width: rect.width, height: rect.height }
    });
    
    return true;
  }

  // Find elements by text content with exact match option
  public findElementByText(
    text: string, 
    elementTypes: string[] = ['button', 'a'],
    exactMatch: boolean = false
  ): Element | null {
    const searchText = text.toLowerCase();
    console.log(`Searching for text: "${text}" (exact: ${exactMatch}) in elements:`, elementTypes);
    
    for (const elementType of elementTypes) {
      const elements = document.querySelectorAll(elementType);
      console.log(`Found ${elements.length} ${elementType} elements`);
      
      for (const element of elements) {
        const elementText = element.textContent?.toLowerCase().trim() || '';
        
        const isMatch = exactMatch ? 
          elementText === searchText : 
          elementText.includes(searchText);
        
        if (isMatch && this.isElementVisible(element)) {
          console.log(`Found matching element:`, element, `with text: "${elementText}"`);
          return element;
        }
      }
    }
    console.log(`No element found with text: "${text}"`);
    return null;
  }

  // Find ALL matching elements with exact match option
  public findAllElementsByText(
    text: string, 
    elementTypes: string[] = ['button', 'a'],
    exactMatch: boolean = false
  ): Element[] {
    const searchText = text.toLowerCase();
    const foundElements: Element[] = [];
    console.log(`Searching for ALL elements with text: "${text}" (exact: ${exactMatch})`);
    
    for (const elementType of elementTypes) {
      const elements = document.querySelectorAll(elementType);
      for (const element of elements) {
        const elementText = element.textContent?.toLowerCase().trim() || '';
        // Clean up text by removing arrows and extra whitespace
        const cleanElementText = elementText.replace(/\s*[→>]\s*$/, '').trim();
        
        const isMatch = exactMatch ? 
          cleanElementText === searchText : 
          cleanElementText.includes(searchText);
        
        if (isMatch && this.isElementVisible(element)) {
          foundElements.push(element);
          console.log(`Found matching element:`, element, `with text: "${elementText}" (cleaned: "${cleanElementText}")`);
        }
      }
    }
    console.log(`Found ${foundElements.length} elements with text: "${text}"`);
    return foundElements;
  }

  // Simplified element finding based on description - fixed logic
  public findElementsByDescription(description: string): Element[] {
    const desc = description.toLowerCase();
    console.log(`Finding elements by description: "${description}"`);
    
    // Project datasets button - find ALL dataset buttons (partial match OK)
    if (desc.includes('datasets') && desc.includes('project')) {
      console.log('Looking for dataset buttons...');
      const elements = this.findAllElementsByText('datasets', ['button', 'a'], false);
      if (elements.length === 0) {
        const variations = this.findAllElementsByText('dataset', ['button', 'a'], false);
        elements.push(...variations);
      }
      console.log(`Found ${elements.length} dataset buttons`);
      return elements;
    }
    
    // Project applications button - find ALL application buttons (partial match OK)
    if (desc.includes('applications') && desc.includes('project')) {
      console.log('Looking for application buttons...');
      const elements = this.findAllElementsByText('applications', ['button', 'a'], false);
      if (elements.length === 0) {
        const variations = this.findAllElementsByText('application', ['button', 'a'], false);
        elements.push(...variations);
      }
      console.log(`Found ${elements.length} application buttons`);
      return elements;
    }
    
    // Pipeline features - handle BEFORE card selection (order matters!)
    if (desc.includes('training') && desc.includes('pipeline')) {
      console.log('Looking for training pipeline elements...');
      let elements = this.findAllElementsByText('training pipeline', ['button', 'a', 'div', 'span'], true);
      if (elements.length === 0) {
        elements = this.findAllElementsByText('training', ['button', 'a', 'div', 'span'], true);
      }
      if (elements.length === 0) {
        // Try partial match as fallback
        elements = this.findAllElementsByText('training', ['button', 'a', 'div', 'span'], false);
      }
      console.log(`Found ${elements.length} training elements`);
      return elements;
    }
    
    if (desc.includes('preprocessing') && desc.includes('pipeline')) {
      console.log('Looking for preprocessing pipeline elements...');
      let elements = this.findAllElementsByText('preprocessing pipeline', ['button', 'a', 'div', 'span'], true);
      if (elements.length === 0) {
        elements = this.findAllElementsByText('preprocessing', ['button', 'a', 'div', 'span'], true);
      }
      if (elements.length === 0) {
        // Try partial match as fallback
        elements = this.findAllElementsByText('preprocessing', ['button', 'a', 'div', 'span'], false);
      }
      console.log(`Found ${elements.length} preprocessing elements`);
      return elements;
    }
    
    if (desc.includes('evaluation') && desc.includes('pipeline')) {
      console.log('Looking for evaluation pipeline elements...');
      let elements = this.findAllElementsByText('evaluation pipeline', ['button', 'a', 'div', 'span'], true);
      if (elements.length === 0) {
        elements = this.findAllElementsByText('evaluation', ['button', 'a', 'div', 'span'], true);
      }
      if (elements.length === 0) {
        // Try partial match as fallback
        elements = this.findAllElementsByText('evaluation', ['button', 'a', 'div', 'span'], false);
      }
      console.log(`Found ${elements.length} evaluation elements`);
      return elements;
    }
    
    if (desc.includes('optimization') && desc.includes('pipeline')) {
      console.log('Looking for optimization pipeline elements...');
      let elements = this.findAllElementsByText('optimization pipeline', ['button', 'a', 'div', 'span'], true);
      if (elements.length === 0) {
        elements = this.findAllElementsByText('optimization', ['button', 'a', 'div', 'span'], true);
      }
      if (elements.length === 0) {
        // Try partial match as fallback
        elements = this.findAllElementsByText('optimization', ['button', 'a', 'div', 'span'], false);
      }
      console.log(`Found ${elements.length} optimization elements`);
      return elements;
    }
    
    // Raw Data feature
    if (desc.includes('raw') && desc.includes('data')) {
      console.log('Looking for raw data elements...');
      let elements = this.findAllElementsByText('raw data', ['button', 'a', 'div', 'span'], true);
      if (elements.length === 0) {
        elements = this.findAllElementsByText('raw', ['button', 'a', 'div', 'span'], true);
      }
      if (elements.length === 0) {
        // Try partial match as fallback
        elements = this.findAllElementsByText('raw', ['button', 'a', 'div', 'span'], false);
      }
      console.log(`Found ${elements.length} raw data elements`);
      return elements;
    }
    
    // Model feature
    if (desc.includes('model') && !desc.includes('pipeline')) {
      console.log('Looking for model elements...');
      let elements = this.findAllElementsByText('model', ['button', 'a', 'div', 'span'], true);
      if (elements.length === 0) {
        // Try partial match as fallback
        elements = this.findAllElementsByText('model', ['button', 'a', 'div', 'span'], false);
      }
      console.log(`Found ${elements.length} model elements`);
      return elements;
    }
    
    // Optimization Dataset feature
    if (desc.includes('optimization') && desc.includes('dataset')) {
      console.log('Looking for optimization dataset elements...');
      let elements = this.findAllElementsByText('optimization dataset', ['button', 'a', 'div', 'span'], true);
      if (elements.length === 0) {
        elements = this.findAllElementsByText('optimization', ['button', 'a', 'div', 'span'], true);
      }
      if (elements.length === 0) {
        // Try partial match as fallback
        elements = this.findAllElementsByText('optimization', ['button', 'a', 'div', 'span'], false);
      }
      console.log(`Found ${elements.length} optimization dataset elements`);
      return elements;
    }
    
    // Application card selection - ONLY for explicit application selection (more specific check)
    if ((desc.includes('select') && desc.includes('application')) || 
        (desc.includes('choose') && desc.includes('application')) ||
        (desc.includes('click') && desc.includes('application') && desc.includes('card'))) {
      console.log('Looking for strict application cards...');
      const cards = this.findAllCards();
      console.log(`Found ${cards.length} strict cards`);
      return cards;
    }
    
    // Generic card selection - for other card-based selections
    if ((desc.includes('select') && desc.includes('card')) || 
        (desc.includes('choose') && desc.includes('card'))) {
      console.log('Looking for generic cards...');
      const cards = this.findAllCards();
      console.log(`Found ${cards.length} cards`);
      return cards;
    }
    
    console.log(`No elements found for description: "${description}"`);
    return [];
  }

  // Check if element is visible - improved
  private isElementVisible(element: Element): boolean {
    if (!element) return false;
    
    const htmlElement = element as HTMLElement;
    const style = window.getComputedStyle(htmlElement);
    const rect = htmlElement.getBoundingClientRect();
    
    const isVisible = style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           rect.width > 0 && 
           rect.height > 0 &&
           rect.top < window.innerHeight &&
           rect.bottom > 0 &&
           rect.left < window.innerWidth &&
           rect.right > 0;
    
    return isVisible;
  }

  // Simple element interaction
  public async interactWithElement(
    selector: string | string[], 
    action: 'click' | 'hover' | 'focus' = 'click',
    options: { waitTimeout?: number; retryCount?: number; scrollIntoView?: boolean; } = {}
  ): Promise<boolean> {
    const { waitTimeout = 3000, retryCount = 2, scrollIntoView = true } = options;
    
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        let element: Element | null = null;
        
        // Try to find element using multiple strategies
        if (typeof selector === 'string') {
          // First try direct selector
          element = this.findElement(selector);
          
          // If not found, try action-specific finding
          if (!element && (selector.includes('Create') || selector.includes('Edit') || 
                          selector.includes('Delete') || selector.includes('Download'))) {
            element = this.findActionButton(selector);
          }
        } else {
          element = this.findElement(selector);
        }
        
        if (!element) {
          if (attempt < retryCount - 1) {
            await this.wait(500);
            continue;
          }
          return false;
        }

        if (scrollIntoView) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await this.wait(300);
        }

        // Perform the action
        switch (action) {
          case 'click':
            // Try multiple click methods for better compatibility
            try {
              (element as HTMLElement).click();
            } catch (error) {
              // Fallback method
              element.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              }));
            }
            break;
          case 'hover':
            element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            break;
          case 'focus':
            (element as HTMLElement).focus();
            break;
        }

        return true;
      } catch (error) {
        console.error(`Interaction attempt ${attempt + 1} failed:`, error);
        if (attempt < retryCount - 1) await this.wait(500);
      }
    }
    return false;
  }

  // Wait for element
  public async waitForElement(selector: string | string[], timeout: number = 3000): Promise<Element | null> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = this.findElement(selector);
      if (element) return element;
      await this.wait(100);
    }
    return null;
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Add this method to the UIInteractionService class
  public findActionButton(action: string): Element | null {
    const actionLower = action.toLowerCase();
    console.log(`Looking for action button: ${action}`);
    
    // Create button patterns (most common in your codebase)
    if (actionLower.includes('create')) {
      // Try exact text match first
      let element = this.findElementByText('Create', ['button'], true);
      if (element) return element;
      
      // Try variations
      element = this.findElementByText('Create Application', ['button'], true);
      if (element) return element;
      
      element = this.findElementByText('Create New Item', ['button'], true);
      if (element) return element;
      
      // Try by class (green buttons are typically create buttons)
      element = document.querySelector('button.bg-green-700, button[class*="bg-green"]');
      if (element && this.isElementVisible(element)) return element;
    }
    
    // Edit button patterns
    if (actionLower.includes('edit')) {
      // Try image-based edit buttons first
      let element = document.querySelector('img[alt="Edit"]');
      if (element) {
        const button = element.closest('button');
        if (button && this.isElementVisible(button)) return button;
      }
      
      // Try text-based edit buttons
      element = this.findElementByText('Edit', ['button'], true);
      if (element) return element;
    }
    
    // Delete button patterns
    if (actionLower.includes('delete')) {
      let element = document.querySelector('img[alt="Delete"]');
      if (element) {
        const button = element.closest('button');
        if (button && this.isElementVisible(button)) return button;
      }
      
      element = this.findElementByText('Delete', ['button'], true);
      if (element) return element;
    }
    
    // Download button patterns
    if (actionLower.includes('download')) {
      let element = document.querySelector('img[alt="Download"]');
      if (element) {
        const button = element.closest('button');
        if (button && this.isElementVisible(button)) return button;
      }
      
      element = this.findElementByText('Download', ['button'], true);
      if (element) return element;
      
      element = this.findElementByText('Log', ['button'], true); // Log buttons are download buttons
      if (element) return element;
    }
    
    console.log(`No action button found for: ${action}`);
    return null;
  }
}

export const uiInteractionService = UIInteractionService.getInstance();