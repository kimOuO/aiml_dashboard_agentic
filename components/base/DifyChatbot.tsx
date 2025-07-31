// components/base/DifyChatbot.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { PromptBuilder } from '@/utils/prompts/promptBuilder';
import { showStepAssistant, hideStepAssistant } from './GlobalStepAssistant';
import { navigationService, NavigationStep, NavigationTarget } from '@/services/navigationRoutingService';

interface Step {
  type: string;
  label: string;
  description: string;
  wait_for_user_action: boolean;
}

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  steps?: Step[];
  navigationTarget?: NavigationTarget;
  hasActiveSteps?: boolean;
  stepsCompleted?: boolean;
  stepsSkipped?: boolean;
  stepsRejected?: boolean;
  awaitingStepConfirmation?: boolean;
  currentStepIndex?: number;
  completedStepIndices?: number[];
}

// Storage keys
const STORAGE_KEYS = {
  CHAT_HISTORY: 'dify_chat_history',
  CONVERSATION_ID: 'dify_conversation_id',
  SCROLL_POSITION: 'dify_chat_scroll_position' // Add scroll position storage
};

// Helper functions for localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects for messages
      if (key === STORAGE_KEYS.CHAT_HISTORY && Array.isArray(parsed)) {
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
  return defaultValue;
};

const clearStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
};

const renderMessageContent = (content) => {
  let rendered = content;
  rendered = rendered.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/\*(.*?)\*/g, '<em>$1</em>');
  rendered = rendered.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  rendered = rendered.replace(/`(.*?)`/g, '<code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>');
  rendered = rendered.replace(/\n/g, '<br>');
  return rendered;
};

const isValidStepsArray = (data: any): data is Step[] => {
  return Array.isArray(data) && 
         data.length > 0 && 
         data.every(item => 
           typeof item === 'object' &&
           ['navigate', 'action', 'wait', 'instruction'].includes(item.type) &&
           typeof item.label === 'string' &&
           typeof item.description === 'string' &&
           typeof item.wait_for_user_action === 'boolean'
         );
};

const isValidNavigationTarget = (data: any): data is NavigationTarget => {
  return typeof data === 'object' &&
         data !== null &&
         typeof data.destination === 'string' &&
         (data.action === undefined || typeof data.action === 'string') &&
         (data.entity_ids === undefined || typeof data.entity_ids === 'object');
};

const extractJsonFromText = (text: string): { json: any | null; cleanText: string } => {
  try {
    const parsed = JSON.parse(text);
    return { json: parsed, cleanText: '' };
  } catch (e) {
    const jsonMatch = text.match(/```json\s*(\{[\s\S]*?\}|\[\s*\{[\s\S]*?\}\s*\])\s*```|(\{[\s\S]*?\}|\[\s*\{[\s\S]*?\}\s*\])/);
    
    if (jsonMatch) {
      try {
        const jsonString = jsonMatch[1] || jsonMatch[2];
        const parsed = JSON.parse(jsonString);
        
        let cleanText = text.replace(jsonMatch[0], '').trim();
        cleanText = cleanText
          .replace(/\bjson\b/gi, '')
          .replace(/```/g, '')
          .replace(/^\s*\n+/gm, '')
          .replace(/\n+\s*$/gm, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        
        return { json: parsed, cleanText };
      } catch (parseError) {
        return { json: null, cleanText: text };
      }
    }
    
    return { json: null, cleanText: text };
  }
};

const DifyChatbot = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [wasOpenBeforeSteps, setWasOpenBeforeSteps] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [activeStepsMessageIndex, setActiveStepsMessageIndex] = useState<number | null>(null);
  
  // Add refs for scroll management
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true); // Track if we should auto-scroll
  const savedScrollPositionRef = useRef(0); // Store scroll position when closing

  // Load persisted data on component mount
  useEffect(() => {
    const savedMessages = loadFromStorage(STORAGE_KEYS.CHAT_HISTORY, []);
    const savedConversationId = loadFromStorage(STORAGE_KEYS.CONVERSATION_ID, '');
    const savedScrollPosition = loadFromStorage(STORAGE_KEYS.SCROLL_POSITION, 0);
    
    setMessages(savedMessages);
    setConversationId(savedConversationId);
    savedScrollPositionRef.current = savedScrollPosition;

    // Check if there are any active steps to restore - but don't restore progress
    const activeStepIndex = savedMessages.findIndex(msg => 
      msg.steps && msg.hasActiveSteps !== false && !msg.stepsCompleted && !msg.stepsSkipped
    );
    
    if (activeStepIndex !== -1) {
      setActiveStepsMessageIndex(activeStepIndex);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive or when opening chatbox
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      if (shouldAutoScrollRef.current) {
        // Auto-scroll to bottom for new messages
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      } else {
        // Restore saved scroll position when reopening
        messagesContainerRef.current.scrollTop = savedScrollPositionRef.current;
        shouldAutoScrollRef.current = true; // Reset flag after restoring position
      }
    }
  }, [messages, isOpen]);

  // Handle scroll events to detect if user manually scrolled
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10; // 10px threshold
      
      // Only auto-scroll if user is at or near the bottom
      shouldAutoScrollRef.current = isAtBottom;
      
      // Save current scroll position
      savedScrollPositionRef.current = container.scrollTop;
      saveToStorage(STORAGE_KEYS.SCROLL_POSITION, container.scrollTop);
    }
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveToStorage(STORAGE_KEYS.CHAT_HISTORY, messages);
    }
  }, [messages]);

  // Save conversation ID to localStorage whenever it changes
  useEffect(() => {
    if (conversationId) {
      saveToStorage(STORAGE_KEYS.CONVERSATION_ID, conversationId);
    }
  }, [conversationId]);

  // Listen for step assistant events to auto-minimize/restore chatbox
  useEffect(() => {
    const handleStepAssistantShown = () => {
      if (isOpen) {
        setWasOpenBeforeSteps(true);
        handleMinimize(); // Use minimize instead of direct setIsOpen
      }
    };

    const handleStepAssistantCompleted = () => {
      if (wasOpenBeforeSteps) {
        handleReopen(); // Use reopen to restore scroll position
        setWasOpenBeforeSteps(false);
      }
      handleStepsComplete();
    };

    const handleStepAssistantSkipped = () => {
      if (wasOpenBeforeSteps) {
        handleReopen(); // Use reopen to restore scroll position
        setWasOpenBeforeSteps(false);
      }
      handleStepsSkip();
    };

    const handleStepAssistantHidden = () => {
      if (wasOpenBeforeSteps) {
        handleReopen(); // Use reopen to restore scroll position
        setWasOpenBeforeSteps(false);
      }
    };

    window.addEventListener('stepAssistantShown', handleStepAssistantShown);
    window.addEventListener('stepAssistantCompleted', handleStepAssistantCompleted);
    window.addEventListener('stepAssistantSkipped', handleStepAssistantSkipped);
    window.addEventListener('hideStepAssistant', handleStepAssistantHidden);

    return () => {
      window.removeEventListener('stepAssistantShown', handleStepAssistantShown);
      window.removeEventListener('stepAssistantCompleted', handleStepAssistantCompleted);
      window.removeEventListener('stepAssistantSkipped', handleStepAssistantSkipped);
      window.removeEventListener('hideStepAssistant', handleStepAssistantHidden);
    };
  }, [isOpen, wasOpenBeforeSteps]);

  // Handle minimize - save scroll position
  const handleMinimize = () => {
    if (messagesContainerRef.current) {
      savedScrollPositionRef.current = messagesContainerRef.current.scrollTop;
      saveToStorage(STORAGE_KEYS.SCROLL_POSITION, messagesContainerRef.current.scrollTop);
    }
    setIsOpen(false);
    shouldAutoScrollRef.current = false; // Don't auto-scroll when reopening
  };

  // Handle reopen - restore scroll position
  const handleReopen = () => {
    setIsOpen(true);
    shouldAutoScrollRef.current = false; // Will restore saved position instead of auto-scrolling
  };

  // Toggle chatbox with proper scroll handling
  const handleToggle = () => {
    if (isOpen) {
      handleMinimize();
    } else {
      handleReopen();
    }
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Ensure auto-scroll for new messages
    shouldAutoScrollRef.current = true;

    const optimizedPrompt = PromptBuilder.buildIntelligentPrompt(userMessage);
    const estimatedTokens = PromptBuilder.estimateTokens(optimizedPrompt);
    console.log(`Intelligent prompt (${estimatedTokens} tokens):`);
    console.log(optimizedPrompt);

    const userMsg: Message = { type: 'user', content: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Add placeholder bot message for streaming
    const botMsgIndex = messages.length + 1; // Index where bot message will be
    const placeholderBotMsg: Message = { 
      type: 'bot', 
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, placeholderBotMsg]);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
      
      if (!baseUrl || !apiKey) {
        throw new Error('Missing Dify configuration.');
      }

      const response = await fetch(`${baseUrl}/v1/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: optimizedPrompt,
          response_mode: 'streaming', // Changed from 'blocking' to 'streaming'
          conversation_id: conversationId || '',
          user: 'dashboard-user'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let finalConversationId = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // Remove 'data: ' prefix
              
              if (data === '[DONE]') {
                break;
              }

              try {
                const parsedData = JSON.parse(data);
                
                // Handle different event types
                if (parsedData.event === 'message') {
                  accumulatedContent += parsedData.answer || '';
                  
                  // Update the bot message in real-time
                  setMessages(prev => prev.map((msg, idx) => 
                    idx === botMsgIndex ? { 
                      ...msg, 
                      content: accumulatedContent 
                    } : msg
                  ));

                  // Ensure auto-scroll during streaming
                  shouldAutoScrollRef.current = true;
                }
                
                // Capture conversation ID
                if (parsedData.conversation_id) {
                  finalConversationId = parsedData.conversation_id;
                }

              } catch (parseError) {
                console.warn('Failed to parse SSE data:', data);
              }
            }
          }
        }
      }

      // Set conversation ID after streaming is complete
      if (finalConversationId) {
        setConversationId(finalConversationId);
      }

      // Process the complete response for steps extraction
      let steps: Step[] | null = null;
      let navigationTarget: NavigationTarget | null = null;
      let displayContent = accumulatedContent;
      
      const { json: extractedJson, cleanText: textWithoutJson } = extractJsonFromText(accumulatedContent);
      
      if (extractedJson) {
        if (isValidStepsArray(extractedJson)) {
          // Original step array format
          steps = extractedJson;
          
          if (textWithoutJson && textWithoutJson.length > 10) {
            displayContent = textWithoutJson;
          } else {
            displayContent = `I've prepared a step-by-step guide to help you with this task. You can follow the interactive steps below:`;
          }
          
          console.log('Extracted steps:', steps);
        } else if (isValidNavigationTarget(extractedJson)) {
          // New navigation target format
          navigationTarget = extractedJson;
          
          if (textWithoutJson && textWithoutJson.length > 10) {
            displayContent = textWithoutJson;
          } else {
            displayContent = `I can help you navigate to that location. Would you like me to guide you step-by-step?`;
          }
          
          console.log('Extracted navigation target:', navigationTarget);
        }
      }

      // Update the final message with steps/navigation target and clean content
      setMessages(prev => prev.map((msg, idx) => 
        idx === botMsgIndex ? { 
          ...msg, 
          content: displayContent,
          steps: steps || undefined,
          navigationTarget: navigationTarget || undefined,
          hasActiveSteps: (steps || navigationTarget) ? true : false,
          currentStepIndex: 0
        } : msg
      ));

      // Show step assistant if steps were extracted or navigation target found - but ask user first
      if (steps || navigationTarget) {
        setActiveStepsMessageIndex(botMsgIndex);
        
        // Update message to show step availability with user choice
        setMessages(prev => prev.map((msg, idx) => 
          idx === botMsgIndex ? { 
            ...msg, 
            content: displayContent,
            steps: steps,
            navigationTarget: navigationTarget,
            hasActiveSteps: true,
            awaitingStepConfirmation: true,
            currentStepIndex: 0
          } : msg
        ));
      }

    } catch (error) {
      console.error('API error:', error);
      
      // Update the placeholder message with error
      setMessages(prev => prev.map((msg, idx) => 
        idx === botMsgIndex ? { 
          ...msg, 
          content: `Sorry, I encountered an error: ${error.message}`
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepsComplete = () => {
    setMessages(prev => prev.map((msg, idx) => 
      idx === activeStepsMessageIndex 
        ? { ...msg, stepsCompleted: true }
        : msg
    ));
    setActiveStepsMessageIndex(null);
    
    const completionMsg: Message = {
      type: 'bot',
      content: '✅ Great! You\'ve completed all the steps. Is there anything else I can help you with?',
      timestamp: new Date()
    };
    
    // Ensure auto-scroll for completion message
    shouldAutoScrollRef.current = true;
    setMessages(prev => [...prev, completionMsg]);
  };

  const handleStepsSkip = () => {
    setMessages(prev => prev.map((msg, idx) => 
      idx === activeStepsMessageIndex 
        ? { ...msg, stepsSkipped: true }
        : msg
    ));
    setActiveStepsMessageIndex(null);
    
    const skipMsg: Message = {
      type: 'bot',
      content: '⏭️ Steps skipped. Feel free to ask if you need help with anything else!',
      timestamp: new Date()
    };
    
    // Ensure auto-scroll for skip message
    shouldAutoScrollRef.current = true;
    setMessages(prev => [...prev, skipMsg]);
  };

  // Add function to reopen steps
  const reopenSteps = (messageIndex: number) => {
    const message = messages[messageIndex];
    if (message && message.steps) {
      setActiveStepsMessageIndex(messageIndex);
      showStepAssistant(message.steps, 'Step-by-Step Guide');
    } else if (message && message.navigationTarget) {
      // Re-trigger the confirmation flow for navigation targets
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex 
          ? { ...msg, awaitingStepConfirmation: true, stepsRejected: false }
          : msg
      ));
    }
  };

  // Add function to handle user's step confirmation
  const handleStepConfirmation = async (messageIndex: number, confirmed: boolean) => {
    if (!confirmed) {
      // Handle rejection
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex 
          ? { ...msg, awaitingStepConfirmation: false, stepsRejected: true }
          : msg
      ));
      
      const rejectionMsg: Message = {
        type: 'bot',
        content: '👍 No problem! Feel free to ask if you need help with anything else.',
        timestamp: new Date()
      };
      
      shouldAutoScrollRef.current = true;
      setMessages(prev => [...prev, rejectionMsg]);
      return;
    }

    const message = messages[messageIndex];
    
    // Handle existing step arrays (original format)
    if (message.steps) {
      // Update message to show confirmed steps
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex 
          ? { ...msg, awaitingStepConfirmation: false }
          : msg
      ));

      setActiveStepsMessageIndex(messageIndex);
      showStepAssistant(message.steps, 'Step-by-Step Guide');
      return;
    }

    // Handle navigation targets (new format)
    if (message.navigationTarget) {
      try {
        // Generate steps using routing service
        const currentPath = window.location.pathname;
        const currentParams = Object.fromEntries(new URLSearchParams(window.location.search));
        
        const generatedSteps = navigationService.generateNavigationSteps(
          currentPath,
          currentParams,
          message.navigationTarget
        );

        console.log('Generated steps:', generatedSteps);

        // Update message with generated steps
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex 
            ? { 
                ...msg, 
                awaitingStepConfirmation: false, 
                steps: generatedSteps,
                navigationTarget: undefined // Clear navigation target after converting to steps
              }
            : msg
        ));

        setActiveStepsMessageIndex(messageIndex);
        showStepAssistant(generatedSteps, 'Navigation Guide');
        
      } catch (error) {
        console.error('Failed to generate navigation steps:', error);
        // Show error message
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex 
            ? { ...msg, awaitingStepConfirmation: false, stepsRejected: true }
            : msg
        ));
        
        const errorMsg: Message = {
          type: 'bot',
          content: '❌ Sorry, I encountered an error generating the navigation steps. Please try asking again.',
          timestamp: new Date()
        };
        
        shouldAutoScrollRef.current = true;
        setMessages(prev => [...prev, errorMsg]);
      }
      return;
    }

    // Fallback if neither steps nor navigationTarget found
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex 
        ? { ...msg, awaitingStepConfirmation: false, stepsRejected: true }
        : msg
    ));
  };

  // Clear chat history function
  const clearChatHistory = () => {
    setMessages([]);
    setConversationId('');
    setActiveStepsMessageIndex(null);
    clearStorage(STORAGE_KEYS.CHAT_HISTORY);
    clearStorage(STORAGE_KEYS.CONVERSATION_ID);
    clearStorage(STORAGE_KEYS.SCROLL_POSITION); // Clear saved scroll position
    
    // Reset scroll refs
    savedScrollPositionRef.current = 0;
    shouldAutoScrollRef.current = true;
    
    // Hide any active step assistant
    hideStepAssistant();
  };

  const handleSend = () => sendMessage(input);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
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
      >
        💬
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '450px',
          height: '650px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header with Clear History Button */}
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Clear History Button */}
              <button 
                onClick={clearChatHistory}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'}
                title="Clear chat history"
              >
                🗑️ Clear
              </button>
              {/* Minimize Button (changed from Close) */}
              <button 
                onClick={handleMinimize}
                style={{
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  fontSize: '16px', 
                  cursor: 'pointer',
                  padding: '2px 6px'
                }}
                title="Minimize chat"
              >
                −
              </button>
            </div>
          </div>

          {/* Messages Container with scroll handling */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              scrollBehavior: 'smooth'
            }}
          >
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
                marginTop: '20px'
              }}>
                Hi! I can help you with this page. What would you like to know?
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div style={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: msg.type === 'user' ? 'fit-content' : '85%',
                  padding: '12px',
                  backgroundColor: msg.type === 'user' ? '#1C64F2' : '#f3f4f6',
                  color: msg.type === 'user' ? 'white' : '#374151',
                  borderRadius: '12px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  marginLeft: msg.type === 'user' ? 'auto' : '0',
                  marginRight: msg.type === 'user' ? '0' : 'auto'
                }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderMessageContent(msg.content)
                    }}
                    style={{ wordBreak: 'break-word' }}
                  />
                  {/* Show timestamp for better context */}
                  <div style={{
                    fontSize: '10px',
                    opacity: 0.7,
                    marginTop: '4px',
                    textAlign: msg.type === 'user' ? 'right' : 'left'
                  }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {/* Render step progress indicator - Updated with confirmation flow */}
                {(msg.steps || msg.navigationTarget) ? (
                  <div style={{
                    backgroundColor: msg.stepsCompleted ? '#dcfce7' : 
                                   msg.stepsSkipped ? '#fef3c7' : 
                                   msg.stepsRejected ? '#fef2f2' :
                                   msg.awaitingStepConfirmation ? '#f0f9ff' : '#e0f2fe',
                    border: `1px solid ${msg.stepsCompleted ? '#16a34a' : 
                                        msg.stepsSkipped ? '#f59e0b' : 
                                        msg.stepsRejected ? '#ef4444' :
                                        msg.awaitingStepConfirmation ? '#0ea5e9' : '#0369a1'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    margin: '8px 0',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      color: msg.stepsCompleted ? '#16a34a' : 
                             msg.stepsSkipped ? '#f59e0b' : 
                             msg.stepsRejected ? '#ef4444' :
                             msg.awaitingStepConfirmation ? '#0ea5e9' : '#0369a1', 
                      fontWeight: 'bold' 
                    }}>
                      {msg.stepsCompleted ? '✅ Steps completed' : 
                       msg.stepsSkipped ? '⏭️ Steps skipped' : 
                       msg.stepsRejected ? '❌ Steps declined' :
                       msg.awaitingStepConfirmation ? '🎯 Would you like me to guide you through this step-by-step?' :
                       '📋 Step-by-step guide is available at the bottom of your screen'}
                    </div>
                    
                    {/* Show confirmation buttons or reopen button */}
                    {msg.awaitingStepConfirmation ? (
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        justifyContent: 'center', 
                        marginTop: '8px' 
                      }}>
                        <button
                          onClick={() => handleStepConfirmation(idx, true)}
                          style={{
                            backgroundColor: '#0ea5e9',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Yes, guide me
                        </button>
                        <button
                          onClick={() => handleStepConfirmation(idx, false)}
                          style={{
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          No, thanks
                        </button>
                      </div>
                    ) : !msg.stepsRejected && (
                      <button
                        onClick={() => reopenSteps(idx)}
                        style={{
                          backgroundColor: msg.stepsCompleted ? '#16a34a' : 
                                         msg.stepsSkipped ? '#f59e0b' : '#0369a1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          marginTop: '8px'
                        }}
                      >
                        {msg.stepsCompleted ? 'Reopen Steps' : 
                         msg.stepsSkipped ? 'Reopen Steps' : 
                         'Show Steps Again'}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          
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
                  fontWeight: 'bold'
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