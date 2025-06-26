"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { PromptBuilder } from '@/utils/promptBuilder';

const renderMessageContent = (content) => {
  // Simple markdown renderer for common formatting
  let rendered = content;
  
  // Bold text: **text** -> <strong>text</strong>
  rendered = rendered.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic text: *text* -> <em>text</em>
  rendered = rendered.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code blocks: ```code``` -> <code>code</code>
  rendered = rendered.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  
  // Inline code: `code` -> <code>code</code>
  rendered = rendered.replace(/`(.*?)`/g, '<code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>');
  
  // Line breaks
  rendered = rendered.replace(/\n/g, '<br>');
  
  return rendered;
};

const DifyChatbot = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');

  // Function to extract context from current page
  const getPageContext = () => {
    const segments = pathname.split('/').filter(Boolean);
    
    // Extract key information from URL
    const projectName = segments[1] ? decodeURIComponent(segments[1]) : null;
    const applicationName = segments[3] ? decodeURIComponent(segments[3]) : null;
    const pipelineName = segments[6] ? decodeURIComponent(segments[6]) : null;
    const configName = segments[7] ? decodeURIComponent(segments[7]) : null;
    
    // Get URL parameters
    const applicationUID = searchParams.get('applicationUID');
    const pipelineUID = searchParams.get('pipelineUID');
    const organizationUID = searchParams.get('organizationUID');
    
    let pageType = 'general';
    let contextInfo = '';
    let helpTopics = [];
    
    // Your existing context logic...
    if (pathname === '/projects') {
      pageType = 'projects-overview';
      contextInfo = 'User is viewing all projects in the AI/ML platform';
      helpTopics = ['creating projects', 'project management', 'navigation basics'];
    } else if (pathname.includes('/applications') && !pathname.includes('/dashboard')) {
      pageType = 'applications-overview';
      contextInfo = `User is viewing applications for project: ${projectName}`;
      helpTopics = ['creating applications', 'application management', 'linking to agents'];
    } else if (pathname.includes('/agents')) {
      pageType = 'agents';
      contextInfo = 'User is in the AI agents section';
      helpTopics = ['agent management', 'linking applications', 'agent configuration'];
    } else if (pathname.includes('/datasets')) {
      pageType = 'datasets';
      contextInfo = `User is viewing datasets for project: ${projectName}`;
      helpTopics = ['dataset management', 'data upload', 'data preprocessing'];
    } else if (pathname.includes('/raw_data')) {
      pageType = 'raw-data';
      contextInfo = `User is viewing raw data for application: ${applicationName}`;
      helpTopics = ['data filtering', 'search functionality', 'data export'];
    } else if (pathname.includes('/preprocessing_pipeline')) {
      if (pathname.includes('/config')) {
        pageType = 'preprocessing-config';
        contextInfo = `User is configuring preprocessing pipeline: ${pipelineName}`;
        helpTopics = ['task configuration', 'pipeline settings', 'build files'];
      } else if (pathname.includes('/tasks')) {
        pageType = 'preprocessing-tasks';
        contextInfo = `User is managing tasks for preprocessing pipeline: ${pipelineName}`;
        helpTopics = ['task creation', 'task execution', 'monitoring progress'];
      } else if (pathname.includes('/build_file')) {
        pageType = 'preprocessing-buildfile';
        contextInfo = `User is managing build files for preprocessing pipeline: ${pipelineName}`;
        helpTopics = ['build file creation', 'file management', 'deployment'];
      } else {
        pageType = 'preprocessing-pipeline';
        contextInfo = `User is viewing preprocessing pipelines for application: ${applicationName}`;
        helpTopics = ['pipeline creation', 'pipeline management', 'data preprocessing'];
      }
    } else if (pathname.includes('/training_pipeline')) {
      if (pathname.includes('/config')) {
        pageType = 'training-config';
        contextInfo = `User is configuring training pipeline: ${pipelineName}`;
        helpTopics = ['training configuration', 'model parameters', 'hyperparameters'];
      } else if (pathname.includes('/tasks')) {
        pageType = 'training-tasks';
        contextInfo = `User is managing training tasks for pipeline: ${pipelineName}`;
        helpTopics = ['training execution', 'progress monitoring', 'task management'];
      } else {
        pageType = 'training-pipeline';
        contextInfo = `User is viewing training pipelines for application: ${applicationName}`;
        helpTopics = ['pipeline creation', 'model training', 'training management'];
      }
    } else if (pathname.includes('/optimization_pipeline')) {
      if (pathname.includes('/config')) {
        pageType = 'optimization-config';
        contextInfo = `User is configuring optimization pipeline: ${pipelineName}`;
        helpTopics = ['optimization settings', 'hyperparameter tuning', 'performance optimization'];
      } else if (pathname.includes('/tasks')) {
        pageType = 'optimization-tasks';
        contextInfo = `User is managing optimization tasks for pipeline: ${pipelineName}`;
        helpTopics = ['optimization execution', 'task monitoring', 'result analysis'];
      } else {
        pageType = 'optimization-pipeline';
        contextInfo = `User is viewing optimization pipelines for application: ${applicationName}`;
        helpTopics = ['model optimization', 'hyperparameter tuning', 'performance improvement'];
      }
    } else if (pathname.includes('/optimization_datasets')) {
      pageType = 'optimization-datasets';
      contextInfo = `User is viewing optimization datasets for application: ${applicationName}`;
      helpTopics = ['dataset optimization', 'data quality', 'performance datasets'];
    } else if (pathname.includes('/evaluation_pipeline')) {
      if (pathname.includes('/config')) {
        pageType = 'evaluation-config';
        contextInfo = `User is configuring evaluation pipeline: ${pipelineName}`;
        helpTopics = ['evaluation configuration', 'model assessment', 'performance metrics'];
      } else if (pathname.includes('/tasks')) {
        pageType = 'evaluation-tasks';
        contextInfo = `User is managing evaluation tasks for pipeline: ${pipelineName}`;
        helpTopics = ['evaluation execution', 'model testing', 'result analysis'];
      } else if (pathname.includes('/build_file')) {
        pageType = 'evaluation-buildfile';
        contextInfo = `User is managing build files for evaluation pipeline: ${pipelineName}`;
        helpTopics = ['build file creation', 'file management', 'deployment'];
      } else {
        pageType = 'evaluation-pipeline';
        contextInfo = `User is viewing evaluation pipelines for application: ${applicationName}`;
        helpTopics = ['pipeline creation', 'model evaluation', 'assessment workflows'];
      }
    } else if (pathname.includes('/model')) {
      if (pathname.includes('/tuning_model')) {
        pageType = 'model-tuning';
        contextInfo = `User is tuning a model in application: ${applicationName}`;
        helpTopics = ['model fine-tuning', 'hyperparameter optimization', 'performance tuning'];
      } else {
        pageType = 'models';
        contextInfo = `User is viewing models for application: ${applicationName}`;
        helpTopics = ['model management', 'model deployment', 'model publishing'];
      }
    } else if (pathname.includes('/dashboard') && applicationName) {
      pageType = 'application-dashboard';
      contextInfo = `User is on the main dashboard for application: ${applicationName} in project: ${projectName}`;
      helpTopics = ['dashboard navigation', 'application overview', 'pipeline access'];
    }
    
    return {
      pathname,
      pageType,
      contextInfo,
      helpTopics,
      projectName,
      applicationName,
      pipelineName,
      configName,
      applicationUID,
      pipelineUID,
      organizationUID,
      timestamp: new Date().toISOString(),
      pageTitle: document.title
    };
  };

  // Add the missing modal detection functions
  const detectActiveModals = () => {
    // Common modal selectors - adjust based on your modal implementation
    const modalSelectors = [
      '[role="dialog"]',
      '.modal',
      '.modal-overlay',
      '[data-modal]',
      '.fixed.inset-0', // Tailwind modal pattern
      '.MuiDialog-root', // Material-UI
      '.ant-modal', // Ant Design
    ];
    
    let activeModal = null;
    
    // Find active modal
    for (const selector of modalSelectors) {
      const modal = document.querySelector(selector);
      if (modal && modal.offsetParent !== null) { // is visible
        activeModal = modal;
        break;
      }
    }
    
    if (!activeModal) {
      return { isModalOpen: false };
    }
    
    // Extract modal information
    const modalInfo = extractModalInfo(activeModal);
    
    return {
      isModalOpen: true,
      modalType: modalInfo.type,
      title: modalInfo.title,
      fields: modalInfo.fields,
      buttons: modalInfo.buttons,
      relevantTopics: modalInfo.topics
    };
  };

  const extractModalInfo = (modalElement) => {
    // Extract title
    const titleSelectors = [
      'h1', 'h2', 'h3', 'h4',
      '.modal-title',
      '[data-testid*="title"]',
      '.dialog-title',
      '.MuiDialogTitle-root'
    ];
    
    let title = '';
    for (const selector of titleSelectors) {
      const titleEl = modalElement.querySelector(selector);
      if (titleEl) {
        title = titleEl.textContent?.trim() || '';
        break;
      }
    }
    
    // Extract form fields with readonly detection
    const inputs = modalElement.querySelectorAll('input, select, textarea');
    const fields = Array.from(inputs).map(input => {
      const isReadonly = isFieldReadonly(input);
      const fieldType = input.type || input.tagName.toLowerCase();
      
      return {
        type: isReadonly ? `${fieldType}-readonly` : fieldType,
        name: input.name || input.id,
        placeholder: input.placeholder,
        label: getFieldLabel(input),
        readonly: isReadonly
      };
    }).filter(field => field.name || field.placeholder || field.label);
    
    // Extract buttons
    const buttons = Array.from(modalElement.querySelectorAll('button')).map(btn => 
      btn.textContent?.trim()
    ).filter(Boolean);
    
    // Determine modal type and relevant topics based on content
    const { type, topics } = categorizeModal(title, fields, buttons);
    
    return {
      title,
      type,
      fields,
      buttons,
      topics
    };
  };

  const isFieldReadonly = (input) => {
    // Method 1: Check if input has readonly attribute
    if (input.hasAttribute('readonly') || input.readOnly) {
      return true;
    }
    
    // Method 2: Check if input is disabled
    if (input.hasAttribute('disabled') || input.disabled) {
      return true;
    }
    
    // Method 3: Check for ModalInput component patterns in your codebase
    // Look for parent div that might contain readonly styling
    const parentDiv = input.closest('div');
    if (parentDiv) {
      // Check if the parent has readonly-specific classes or attributes
      if (parentDiv.classList.contains('readonly') || 
          parentDiv.hasAttribute('data-readonly')) {
        return true;
      }
    }
    
    // Method 4: Check for specific patterns in your ModalInput component
    // Based on your codebase, ModalInput with readOnly prop likely:
    // - Has a specific background color (like #f3f4f6)
    // - Might have cursor: not-allowed
    // - Might have specific styling
    const computedStyle = window.getComputedStyle(input);
    if (computedStyle.backgroundColor === 'rgb(243, 244, 246)' || // #f3f4f6
        computedStyle.cursor === 'not-allowed' ||
        computedStyle.pointerEvents === 'none') {
      return true;
    }
    
    // Method 5: Check for aria-readonly attribute
    if (input.getAttribute('aria-readonly') === 'true') {
      return true;
    }
    
    // Method 6: Look for readonly indicators in the label text
    const label = getFieldLabel(input);
    if (label && (label.includes('(readonly)') || label.includes('(Read Only)'))) {
      return true;
    }
    
    // Method 7: Check if input value matches common readonly patterns
    // Based on your modals, readonly fields often show UIDs, timestamps, etc.
    const value = input.value || '';
    if (value.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i) || // UUID pattern
        value.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/) || // Timestamp pattern
        label.toLowerCase().includes('uid') ||
        label.toLowerCase().includes('created time') ||
        label.toLowerCase().includes('file extension')) {
      return true;
    }
    
    return false;
  };

  const getFieldLabel = (input) => {
    // Try to find associated label
    let label = document.querySelector(`label[for="${input.id}"]`) ||
                input.closest('.form-group, .field, .input-group')?.querySelector('label') ||
                input.previousElementSibling?.tagName === 'LABEL' ? input.previousElementSibling : null;
    
    // If no direct label found, look for text content in parent elements
    if (!label) {
      const parent = input.closest('div');
      if (parent) {
        // Look for text nodes or elements that might be labels
        const textNodes = Array.from(parent.childNodes).filter(node => 
          node.nodeType === Node.TEXT_NODE && node.textContent.trim()
        );
        if (textNodes.length > 0) {
          return textNodes[0].textContent.trim();
        }
        
        // Look for spans or other elements that might contain label text
        const labelElements = parent.querySelectorAll('span, div, p');
        for (const el of labelElements) {
          if (el.textContent && 
              el.textContent.trim() && 
              !el.contains(input) && 
              el.textContent.length < 50) { // Likely a label if short
            return el.textContent.trim();
          }
        }
      }
    }
    
    return label?.textContent?.trim() || '';
  };

  const categorizeModal = (title, fields, buttons) => {
    const titleLower = title.toLowerCase();
    const fieldNames = fields.map(f => (f.name + ' ' + f.placeholder + ' ' + f.label).toLowerCase()).join(' ');
    const buttonText = buttons.join(' ').toLowerCase();
    
    // Modal type detection logic based on your codebase patterns
    if (titleLower.includes('create') || titleLower.includes('new') || titleLower.includes('add')) {
      if (titleLower.includes('project')) {
        return {
          type: 'create-project',
          topics: ['project creation', 'project settings', 'form validation', 'required fields']
        };
      } else if (titleLower.includes('application')) {
        return {
          type: 'create-application',
          topics: ['application creation', 'application configuration', 'form fields', 'validation']
        };
      } else if (titleLower.includes('pipeline')) {
        return {
          type: 'create-pipeline',
          topics: ['pipeline creation', 'pipeline upload', 'file selection', 'configuration']
        };
      } else if (titleLower.includes('task')) {
        return {
          type: 'create-task',
          topics: ['task creation', 'task configuration', 'execution settings', 'authentication']
        };
      }
    } else if (titleLower.includes('upload')) {
      if (titleLower.includes('dataset')) {
        return {
          type: 'upload-dataset',
          topics: ['dataset upload', 'file selection', 'dataset configuration', 'data validation']
        };
      } else if (titleLower.includes('pipeline')) {
        return {
          type: 'upload-pipeline',
          topics: ['pipeline upload', 'file selection', 'pipeline configuration', 'code upload']
        };
      } else {
        return {
          type: 'file-upload',
          topics: ['file upload', 'file selection', 'import data', 'file formats', 'validation']
        };
      }
    } else if (titleLower.includes('config') || titleLower.includes('configuration')) {
      return {
        type: 'configuration',
        topics: ['configuration', 'settings', 'parameters', 'JSON format', 'validation']
      };
    } else if (titleLower.includes('task') && (titleLower.includes('run') || buttonText.includes('create'))) {
      return {
        type: 'task-execution',
        topics: ['task execution', 'running processes', 'authentication', 'execution parameters']
      };
    } else if (titleLower.includes('edit') || titleLower.includes('update') || titleLower.includes('modify')) {
      return {
        type: 'edit-modal',
        topics: ['editing', 'updating settings', 'form modification', 'save changes']
      };
    } else if (titleLower.includes('delete') || titleLower.includes('remove') || buttonText.includes('delete')) {
      return {
        type: 'delete-confirmation',
        topics: ['deletion confirmation', 'data removal', 'irreversible actions', 'confirmation']
      };
    } else if (fieldNames.includes('username') || fieldNames.includes('password') || fieldNames.includes('auth')) {
      return {
        type: 'authentication',
        topics: ['authentication', 'login credentials', 'security', 'access tokens']
      };
    }
    
    // Default fallback
    return {
      type: 'general-modal',
      topics: ['form completion', 'modal interaction', 'field validation']
    };
  };

  // Enhanced page context function
  const getEnhancedPageContext = () => {
    const baseContext = getPageContext();
    
    // Detect active modals and their content
    const modalContext = detectActiveModals();
    
    // Detect page navigation elements 
    const navigationContext = detectPageNavigation();
    
    // Enhanced context with navigation information
    const enhancedContext = {
      ...baseContext,
      navigationLinks: navigationContext.navigationLinks,
      breadcrumbs: navigationContext.breadcrumbs,
      availableActions: navigationContext.availableActions
    };
    
    // Enhance context with modal information if modal is open
    if (modalContext.isModalOpen) {
      return {
        ...enhancedContext,
        pageType: `${baseContext.pageType}-modal`,
        modalType: modalContext.modalType,
        modalTitle: modalContext.title,
        modalFields: modalContext.fields,
        modalButtons: modalContext.buttons,
        contextInfo: `${baseContext.contextInfo}. Currently in ${modalContext.modalType} modal: "${modalContext.title}"`,
        helpTopics: [...baseContext.helpTopics, ...modalContext.relevantTopics]
      };
    }
    
    return enhancedContext;
  };

  const detectPageNavigation = () => {
    // Common navigation patterns from your codebase
    const navigationElements = [];
    
    // Method 1: Detect colored navigation badges (from your pages)
    const coloredBadges = document.querySelectorAll([
      '.bg-red-100.text-red-800',      // Red badges
      '.bg-green-100.text-green-800',  // Green badges  
      '.bg-blue-100.text-blue-800',    // Blue badges
      '.bg-yellow-100.text-yellow-800', // Yellow badges
      '.bg-purple-100.text-purple-800', // Purple badges
      '.bg-indigo-100.text-indigo-800'  // Indigo badges
    ].join(', '));
    
    coloredBadges.forEach(badge => {
      const span = badge.querySelector('span');
      if (span && span.textContent) {
        const text = span.textContent.trim();
        // Filter out UUIDs and timestamps
        if (!isUUIDOrTimestamp(text)) {
          navigationElements.push({
            type: 'navigation-link',
            text: text,
            clickable: badge.style.cursor === 'pointer' || badge.classList.contains('cursor-pointer')
          });
        }
      }
    });
    
    // Method 2: Detect dashboard cards with arrows (→)
    const dashboardCards = document.querySelectorAll('.cursor-pointer');
    dashboardCards.forEach(card => {
      const cardText = card.textContent;
      if (cardText && cardText.includes('→')) {
        // Extract the main text before the arrow
        const match = cardText.match(/(.+?)\s*→/);
        if (match) {
          const text = match[1].trim();
          if (!isUUIDOrTimestamp(text) && text.length > 2) {
            navigationElements.push({
              type: 'dashboard-card',
              text: text,
              clickable: true
            });
          }
        }
      }
    });
    
    // Method 3: Detect buttons with navigation text
    const navigationButtons = document.querySelectorAll('button');
    navigationButtons.forEach(button => {
      const text = button.textContent?.trim();
      if (text && !isUUIDOrTimestamp(text) && isNavigationButton(text)) {
        navigationElements.push({
          type: 'action-button',
          text: text,
          clickable: true
        });
      }
    });
    
    // Method 4: Detect breadcrumb navigation
    const breadcrumbs = [];
    const breadcrumbElements = document.querySelectorAll('p.text-gray-500');
    breadcrumbElements.forEach(element => {
      const text = element.textContent;
      if (text && text.includes('/')) {
        // Extract navigation path, filter out UUIDs
        const parts = text.split('/').map(part => part.trim()).filter(part => 
          part && !isUUIDOrTimestamp(part) && part !== 'Projects' && part !== 'Applications'
        );
        breadcrumbs.push(...parts);
      }
    });
    
    return {
      navigationLinks: navigationElements,
      breadcrumbs: breadcrumbs,
      availableActions: getAvailableActions()
    };
  };

  const isUUIDOrTimestamp = (text) => {
    // UUID pattern
    const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    
    // Timestamp patterns
    const timestampPatterns = [
      /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,  // 2024-01-01 12:00:00
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,    // ISO format
      /^\d{13}$/,                                  // Unix timestamp
    ];
    
    // Check if it's a UUID
    if (uuidPattern.test(text)) return true;
    
    // Check if it's a timestamp
    return timestampPatterns.some(pattern => pattern.test(text));
  };

  const isNavigationButton = (text) => {
    const navigationKeywords = [
      'Pipeline', 'Model', 'Dataset', 'Config', 'Tasks', 'Build File',
      'Upload', 'Create', 'Run', 'Training', 'Preprocessing', 'Optimization',
      'Evaluation', 'Raw Data', 'Back'
    ];
    
    return navigationKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const getAvailableActions = () => {
    const actions = [];
    
    // Detect main action buttons (usually green buttons)
    const actionButtons = document.querySelectorAll('button.bg-green-800, button.bg-blue-800, button.bg-green-700');
    actionButtons.forEach(button => {
      const text = button.textContent?.trim();
      if (text && !isUUIDOrTimestamp(text)) {
        actions.push(text);
      }
    });
    
    return actions;
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Use enhanced context that includes modals AND navigation
    const context = getEnhancedPageContext();
    
    // Build context-aware prompt with modal and navigation information
    const optimizedPrompt = PromptBuilder.buildModalAwarePrompt({
      pageType: context.pageType,
      projectName: context.projectName,
      applicationName: context.applicationName,
      pipelineName: context.pipelineName,
      contextInfo: context.contextInfo,
      helpTopics: context.helpTopics,
      navigationLinks: context.navigationLinks,
      availableActions: context.availableActions,
      breadcrumbs: context.breadcrumbs,
      modalType: context.modalType,
      modalTitle: context.modalTitle,
      modalFields: context.modalFields,
      modalButtons: context.modalButtons,
      userMessage
    });

    // Log token usage for monitoring
    const estimatedTokens = PromptBuilder.estimateTokens(optimizedPrompt);
    console.log(`Optimized prompt: ${optimizedPrompt}`);
    console.log(`Estimated tokens: ${estimatedTokens} for page: ${context.pageType}`);
    console.log('Context details:', {
      navigationLinks: context.navigationLinks?.length || 0,
      availableActions: context.availableActions?.length || 0,
      isModal: context.modalType,
      title: context.modalTitle,
      fields: context.modalFields?.length || 0,
      buttons: context.modalButtons?.length || 0
    });

    // Add user message to chat (show original message, not the optimized prompt)
    const userMsg = { type: 'user', content: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
      
      if (!baseUrl || !apiKey) {
        throw new Error('Missing Dify configuration. Please check your environment variables.');
      }

      const response = await fetch(`${baseUrl}/v1/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: optimizedPrompt, // Send the optimized prompt
          response_mode: 'blocking',
          conversation_id: conversationId || '',
          user: 'dashboard-user'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      const botMsg = { 
        type: 'bot', 
        content: data.answer || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error('Dify API error:', error);
      const errorMsg = { 
        type: 'bot', 
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Reset conversation when page changes
  useEffect(() => {
    setConversationId('');
    const context = getPageContext();
    console.log('Page context updated:', context.pageType);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Monitor for modal changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if new modals were added or removed
        if (mutation.type === 'childList') {
          const hasModal = document.querySelector('[role="dialog"], .modal, .fixed.inset-0');
          if (hasModal) {
            console.log('Modal detected, context updated');
            // Optionally update context or trigger re-render
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#1C64F2',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(28, 100, 242, 0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        💬
      </button>

      {/* Chat window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '400px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            backgroundColor: '#1C64F2',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                width: '24px',
                height: '24px'
              }}
            >
              ×
            </button>
          </div>

          {/* Context indicator */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            fontSize: '12px',
            color: '#6b7280',
            borderBottom: '1px solid #e5e7eb'
          }}>
            📍 {getPageContext().contextInfo}
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
                marginTop: '20px'
              }}>
                Hi! I'm your AI assistant. I can help you with anything related to your current page: <strong>{getPageContext().pageType}</strong>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={msg.id || idx} style={{
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '12px',
                backgroundColor: msg.type === 'user' ? '#1C64F2' : '#f3f4f6',
                color: msg.type === 'user' ? 'white' : '#374151',
                borderRadius: '12px',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {/* Updated to render HTML content */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderMessageContent(msg.content)
                  }}
                  style={{
                    wordBreak: 'break-word'
                  }}
                />
              </div>
            ))}
            
            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '12px',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Thinking...
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  resize: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  minHeight: '20px',
                  maxHeight: '80px',
                  backgroundColor: isLoading ? '#f3f4f6' : 'white'
                }}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{
                  padding: '12px 16px',
                  backgroundColor: isLoading || !input.trim() ? '#d1d5db' : '#1C64F2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DifyChatbot;