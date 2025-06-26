export interface PageContext {
  pageTitle: string;
  mainHeading: string;
  primaryActions: string[];
  navigationContext: NavigationElement[];
  formContext: FormContext[];
  dataContext: DataContext;
  semanticContext: SemanticContext;
  interactionElements: InteractionElement[];
}

export interface NavigationElement {
  type: 'navigation-badge' | 'breadcrumb' | 'action-button' | 'dashboard-card';
  text: string;
  clickable: boolean;
  color?: string;
  url?: string;
}

export interface FormContext {
  action?: string;
  method?: string;
  fields: FormField[];
  submitButtons: string[];
  isModal: boolean;
  modalTitle?: string;
}

export interface FormField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  readonly: boolean;
  value?: string;
}

export interface DataContext {
  tables: TableInfo[];
  lists: ListInfo[];
  cards: CardInfo[];
  pagination: PaginationInfo | null;
}

export interface SemanticContext {
  entityType: string;
  entityName: string;
  action: string;
  section: string;
  capabilities: string[];
}

export class ContentAnalyzer {
  private static isUUIDOrTimestamp(text: string): boolean {
    const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    const timestampPatterns = [
      /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      /^\d{13}$/,
    ];
    
    if (uuidPattern.test(text)) return true;
    return timestampPatterns.some(pattern => pattern.test(text));
  }

  static analyzePageContent(): PageContext {
    try {
      return {
        pageTitle: document.title,
        mainHeading: this.extractMainHeading(),
        primaryActions: this.extractPrimaryActions(),
        navigationContext: this.extractNavigationContext(),
        formContext: this.extractFormContext(),
        dataContext: this.extractDataContext(),
        semanticContext: this.extractSemanticContext(),
        interactionElements: this.extractInteractionElements()
      };
    } catch (error) {
      console.warn('Content analysis failed:', error);
      return this.getFallbackContext();
    }
  }

  private static extractMainHeading(): string {
    // Look for main headings in order of priority
    const headingSelectors = [
      'h1',
      'h2',
      '.text-3xl', // Your Tailwind heading class
      '[role="heading"]',
      '.page-title',
      '.main-title'
    ];

    for (const selector of headingSelectors) {
      const heading = document.querySelector(selector);
      if (heading && heading.textContent?.trim()) {
        const text = heading.textContent.trim();
        if (!this.isUUIDOrTimestamp(text) && text.length > 2) {
          return text;
        }
      }
    }

    return '';
  }

  private static extractPrimaryActions(): string[] {
    const actions: string[] = [];
    
    // Based on your codebase patterns
    const actionSelectors = [
      'button.bg-green-800',    // Primary green buttons
      'button.bg-green-700',    
      'button.bg-blue-800',     // Secondary blue buttons
      'button[class*="bg-green"]',
      'button[class*="primary"]'
    ];

    actionSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        const text = button.textContent?.trim();
        if (text && !this.isUUIDOrTimestamp(text) && text.length < 50) {
          actions.push(text);
        }
      });
    });

    return [...new Set(actions)]; // Remove duplicates
  }

  private static extractNavigationContext(): NavigationElement[] {
    const navigation: NavigationElement[] = [];

    // 1. Extract colored navigation badges (your specific pattern)
    const badgeColors = [
      { selector: '.bg-red-100.text-red-800', color: 'red' },
      { selector: '.bg-green-100.text-green-800', color: 'green' },
      { selector: '.bg-blue-100.text-blue-800', color: 'blue' },
      { selector: '.bg-yellow-100.text-yellow-800', color: 'yellow' },
      { selector: '.bg-purple-100.text-purple-800', color: 'purple' },
      { selector: '.bg-indigo-100.text-indigo-800', color: 'indigo' }
    ];

    badgeColors.forEach(({ selector, color }) => {
      const badges = document.querySelectorAll(selector);
      badges.forEach(badge => {
        const span = badge.querySelector('span');
        const text = span?.textContent?.trim() || badge.textContent?.trim();
        if (text && !this.isUUIDOrTimestamp(text)) {
          navigation.push({
            type: 'navigation-badge',
            text,
            clickable: badge.classList.contains('cursor-pointer'),
            color
          });
        }
      });
    });

    // 2. Extract breadcrumbs
    const breadcrumbElements = document.querySelectorAll('p.text-gray-500');
    breadcrumbElements.forEach(element => {
      const text = element.textContent;
      if (text && text.includes('/')) {
        const parts = text.split('/').map(part => part.trim()).filter(part => 
          part && !this.isUUIDOrTimestamp(part) && part !== 'Projects' && part !== 'Applications'
        );
        parts.forEach(part => {
          navigation.push({
            type: 'breadcrumb',
            text: part,
            clickable: false
          });
        });
      }
    });

    // 3. Extract dashboard cards with arrows
    const dashboardCards = document.querySelectorAll('.cursor-pointer');
    dashboardCards.forEach(card => {
      const cardText = card.textContent;
      if (cardText && cardText.includes('→')) {
        const match = cardText.match(/(.+?)\s*→/);
        if (match) {
          const text = match[1].trim();
          if (!this.isUUIDOrTimestamp(text) && text.length > 2) {
            navigation.push({
              type: 'dashboard-card',
              text,
              clickable: true
            });
          }
        }
      }
    });

    return navigation;
  }

  private static extractFormContext(): FormContext[] {
    const forms: FormContext[] = [];
    
    // Regular forms
    const formElements = document.querySelectorAll('form');
    formElements.forEach(form => {
      forms.push(this.analyzeForm(form, false));
    });

    // Modal forms (your pattern)
    const modals = document.querySelectorAll('.fixed.inset-0, [role="dialog"]');
    modals.forEach(modal => {
      if (modal.offsetParent !== null) { // is visible
        const formInModal = modal.querySelector('form') || modal;
        forms.push(this.analyzeForm(formInModal, true, this.extractModalTitle(modal)));
      }
    });

    return forms;
  }

  private static analyzeForm(formElement: Element, isModal: boolean, modalTitle?: string): FormContext {
    const form = formElement as HTMLFormElement;
    
    return {
      action: form.action || '',
      method: form.method || '',
      fields: this.extractFormFields(formElement),
      submitButtons: this.extractSubmitButtons(formElement),
      isModal,
      modalTitle
    };
  }

  private static extractFormFields(container: Element): FormField[] {
    const inputs = container.querySelectorAll('input, select, textarea');
    
    return Array.from(inputs).map(input => {
      const htmlInput = input as HTMLInputElement;
      
      return {
        type: this.determineFieldType(htmlInput),
        name: htmlInput.name || htmlInput.id || '',
        label: this.getFieldLabel(htmlInput),
        placeholder: htmlInput.placeholder || '',
        required: htmlInput.required,
        readonly: this.isFieldReadonly(htmlInput),
        value: htmlInput.value || ''
      };
    }).filter(field => field.name || field.label);
  }

  private static determineFieldType(input: HTMLInputElement): string {
    const isReadonly = this.isFieldReadonly(input);
    const baseType = input.type || input.tagName.toLowerCase();
    
    return isReadonly ? `${baseType}-readonly` : baseType;
  }

  private static isFieldReadonly(input: HTMLInputElement): boolean {
    // Check readonly attributes
    if (input.hasAttribute('readonly') || input.readOnly || 
        input.hasAttribute('disabled') || input.disabled) {
      return true;
    }

    // Check styling patterns from your ModalInput component
    const computedStyle = window.getComputedStyle(input);
    if (computedStyle.backgroundColor === 'rgb(243, 244, 246)' || 
        computedStyle.cursor === 'not-allowed' ||
        computedStyle.pointerEvents === 'none') {
      return true;
    }

    // Check for readonly indicators in value or label
    const value = input.value || '';
    const label = this.getFieldLabel(input);
    
    if (this.isUUIDOrTimestamp(value) ||
        label.toLowerCase().includes('uid') ||
        label.toLowerCase().includes('file extension') ||
        label.toLowerCase().includes('created time')) {
      return true;
    }

    return false;
  }

  private static getFieldLabel(input: HTMLInputElement): string {
    // Try multiple methods to find the label
    let label = document.querySelector(`label[for="${input.id}"]`) ||
                input.closest('.form-group, .field')?.querySelector('label') ||
                input.previousElementSibling?.tagName === 'LABEL' ? input.previousElementSibling : null;
    
    if (label) {
      return label.textContent?.trim() || '';
    }

    // Look for label-like elements in parent
    const parent = input.closest('div');
    if (parent) {
      const labelElements = parent.querySelectorAll('span, div, p');
      for (const el of labelElements) {
        const text = el.textContent?.trim();
        if (text && !el.contains(input) && text.length < 50 && !this.isUUIDOrTimestamp(text)) {
          return text;
        }
      }
    }

    return input.placeholder || '';
  }

  private static extractSubmitButtons(container: Element): string[] {
    const buttons = container.querySelectorAll('button[type="submit"], button.bg-green-700, button.bg-blue-700');
    
    return Array.from(buttons)
      .map(btn => btn.textContent?.trim())
      .filter(text => text && !this.isUUIDOrTimestamp(text)) as string[];
  }

  private static extractModalTitle(modal: Element): string {
    const titleSelectors = ['h1', 'h2', 'h3', '.modal-title', '.text-2xl'];
    
    for (const selector of titleSelectors) {
      const titleEl = modal.querySelector(selector);
      if (titleEl?.textContent?.trim()) {
        return titleEl.textContent.trim();
      }
    }
    
    return '';
  }

  private static extractDataContext(): DataContext {
    return {
      tables: this.analyzeTables(),
      lists: this.analyzeLists(),
      cards: this.analyzeCards(),
      pagination: this.analyzePagination()
    };
  }

  private static analyzeTables(): TableInfo[] {
    const tables = document.querySelectorAll('table');
    
    return Array.from(tables).map(table => ({
      headers: Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || ''),
      rowCount: table.querySelectorAll('tbody tr').length,
      hasActions: !!table.querySelector('button, .action')
    }));
  }

  private static analyzeLists(): ListInfo[] {
    const lists = document.querySelectorAll('ul, ol, .space-y-4');
    
    return Array.from(lists).map(list => ({
      itemCount: list.children.length,
      hasActions: !!list.querySelector('button'),
      listType: list.tagName.toLowerCase()
    }));
  }

  private static analyzeCards(): CardInfo[] {
    // Based on your card patterns
    const cardSelectors = [
      '.space-y-4 > div', // Your card container pattern
      '.grid > div',
      '[class*="card"]'
    ];

    const cards: CardInfo[] = [];
    
    cardSelectors.forEach(selector => {
      const cardElements = document.querySelectorAll(selector);
      cardElements.forEach(card => {
        if (card.querySelector('button, .cursor-pointer')) {
          cards.push({
            title: this.extractCardTitle(card),
            hasActions: true,
            actionCount: card.querySelectorAll('button').length
          });
        }
      });
    });

    return cards;
  }

  private static extractCardTitle(card: Element): string {
    const titleSelectors = ['h3', 'h4', '.font-bold', '.text-lg'];
    
    for (const selector of titleSelectors) {
      const titleEl = card.querySelector(selector);
      if (titleEl?.textContent?.trim()) {
        const text = titleEl.textContent.trim();
        if (!this.isUUIDOrTimestamp(text)) {
          return text;
        }
      }
    }
    
    return '';
  }

  private static analyzePagination(): PaginationInfo | null {
    const pagination = document.querySelector('[class*="pagination"], .flex.space-x-2');
    
    if (pagination) {
      return {
        currentPage: this.extractCurrentPage(pagination),
        totalPages: this.extractTotalPages(pagination),
        hasNext: !!pagination.querySelector('[class*="next"], [class*="Next"]'),
        hasPrevious: !!pagination.querySelector('[class*="prev"], [class*="Previous"]')
      };
    }
    
    return null;
  }

  private static extractCurrentPage(pagination: Element): number {
    const activePageEl = pagination.querySelector('.bg-gray-600, [class*="active"]');
    if (activePageEl?.textContent) {
      const pageNum = parseInt(activePageEl.textContent.trim());
      return isNaN(pageNum) ? 1 : pageNum;
    }
    return 1;
  }

  private static extractTotalPages(pagination: Element): number {
    const pageLinks = pagination.querySelectorAll('[class*="PaginationLink"]');
    let maxPage = 1;
    
    pageLinks.forEach(link => {
      const pageNum = parseInt(link.textContent?.trim() || '0');
      if (!isNaN(pageNum) && pageNum > maxPage) {
        maxPage = pageNum;
      }
    });
    
    return maxPage;
  }

  private static extractSemanticContext(): SemanticContext {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    
    return {
      entityType: this.inferEntityType(segments),
      entityName: this.inferEntityName(segments),
      action: this.inferAction(segments),
      section: this.inferSection(segments),
      capabilities: this.inferCapabilities()
    };
  }

  private static inferEntityType(segments: string[]): string {
    const typeMap: Record<string, string> = {
      'projects': 'project',
      'applications': 'application',
      'preprocessing_pipeline': 'pipeline',
      'training_pipeline': 'pipeline',
      'optimization_pipeline': 'pipeline',
      'evaluation_pipeline': 'pipeline',
      'model': 'model',
      'datasets': 'dataset',
      'optimization_datasets': 'dataset',
      'raw_data': 'data'
    };
    
    for (const segment of segments) {
      if (typeMap[segment]) return typeMap[segment];
    }
    
    return 'unknown';
  }

  private static inferEntityName(segments: string[]): string {
    // Entity names are typically after the entity type
    const entityTypeIndex = segments.findIndex(seg => 
      ['projects', 'applications', 'preprocessing_pipeline', 'training_pipeline', 
       'optimization_pipeline', 'evaluation_pipeline', 'model'].includes(seg)
    );
    
    if (entityTypeIndex >= 0 && entityTypeIndex + 1 < segments.length) {
      const name = decodeURIComponent(segments[entityTypeIndex + 1]);
      return this.isUUIDOrTimestamp(name) ? '' : name;
    }
    
    return '';
  }

  private static inferAction(segments: string[]): string {
    const actionKeywords = ['config', 'tasks', 'build_file', 'tuning_model'];
    
    for (const segment of segments) {
      if (actionKeywords.includes(segment)) {
        return segment.replace('_', '-');
      }
    }
    
    if (segments[segments.length - 1] === 'dashboard') return 'overview';
    
    return 'listing';
  }

  private static inferSection(segments: string[]): string {
    return segments[segments.length - 1] || '';
  }

  private static inferCapabilities(): string[] {
    const capabilities: string[] = [];
    
    // Infer from available actions
    const actions = this.extractPrimaryActions();
    
    actions.forEach(action => {
      const actionLower = action.toLowerCase();
      if (actionLower.includes('create') || actionLower.includes('upload')) {
        capabilities.push('create');
      }
      if (actionLower.includes('run') || actionLower.includes('execute')) {
        capabilities.push('execute');
      }
      if (actionLower.includes('config')) {
        capabilities.push('configure');
      }
    });
    
    // Infer from navigation
    const navigation = this.extractNavigationContext();
    navigation.forEach(nav => {
      if (nav.clickable) {
        capabilities.push('navigate');
      }
    });
    
    return [...new Set(capabilities)];
  }

  private static extractInteractionElements(): InteractionElement[] {
    const elements: InteractionElement[] = [];
    
    // Clickable elements
    const clickables = document.querySelectorAll('.cursor-pointer, [role="button"], button');
    clickables.forEach(el => {
      const text = el.textContent?.trim();
      if (text && !this.isUUIDOrTimestamp(text) && text.length < 100) {
        elements.push({
          type: 'clickable',
          text,
          selector: this.generateSelector(el)
        });
      }
    });
    
    return elements;
  }

  private static generateSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.classList.length > 0) {
      return `.${Array.from(element.classList).slice(0, 2).join('.')}`;
    }
    return element.tagName.toLowerCase();
  }

  private static getFallbackContext(): PageContext {
    return {
      pageTitle: document.title || 'Unknown Page',
      mainHeading: '',
      primaryActions: [],
      navigationContext: [],
      formContext: [],
      dataContext: { tables: [], lists: [], cards: [], pagination: null },
      semanticContext: {
        entityType: 'unknown',
        entityName: '',
        action: 'unknown',
        section: '',
        capabilities: []
      },
      interactionElements: []
    };
  }
}

// Additional interfaces
interface TableInfo {
  headers: string[];
  rowCount: number;
  hasActions: boolean;
}

interface ListInfo {
  itemCount: number;
  hasActions: boolean;
  listType: string;
}

interface CardInfo {
  title: string;
  hasActions: boolean;
  actionCount: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface InteractionElement {
  type: string;
  text: string;
  selector: string;
}