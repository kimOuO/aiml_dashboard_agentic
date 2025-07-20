// components/base/DifyChatbot.tsx
"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { PromptBuilder } from '@/utils/prompts/promptBuilder';
import StepProgressBar from './StepProgressBar';

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
  hasActiveSteps?: boolean;
  stepsCompleted?: boolean;
  stepsSkipped?: boolean;
  currentStepIndex?: number; // Add this to track current step
  completedStepIndices?: number[]; // Add this to track completed steps
}

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
           item.type === 'instruction' &&
           typeof item.label === 'string' &&
           typeof item.description === 'string' &&
           typeof item.wait_for_user_action === 'boolean'
         );
};

const extractJsonFromText = (text: string): { json: any | null; cleanText: string } => {
  try {
    // First try to parse the entire text as JSON
    const parsed = JSON.parse(text);
    return { json: parsed, cleanText: '' };
  } catch (e) {
    // Try to find and extract JSON array with more comprehensive matching
    const jsonMatch = text.match(/```json\s*(\[\s*\{[\s\S]*?\}\s*\])\s*```|(\[\s*\{[\s\S]*?\}\s*\])/);
    
    if (jsonMatch) {
      try {
        // Use the captured group (either from code block or standalone)
        const jsonString = jsonMatch[1] || jsonMatch[2];
        const parsed = JSON.parse(jsonString);
        
        // More aggressive cleanup - remove the entire match and surrounding whitespace
        let cleanText = text.replace(jsonMatch[0], '').trim();
        
        // Remove common artifacts
        cleanText = cleanText
          .replace(/\bjson\b/gi, '') // Remove "json" keyword
          .replace(/```/g, '') // Remove any remaining code blocks
          .replace(/^\s*\n+/gm, '') // Remove empty lines at start
          .replace(/\n+\s*$/gm, '') // Remove empty lines at end
          .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [activeStepsMessageIndex, setActiveStepsMessageIndex] = useState<number | null>(null);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Use the simplified prompt builder
    const optimizedPrompt = PromptBuilder.buildIntelligentPrompt(userMessage);

    // Log for monitoring
    const estimatedTokens = PromptBuilder.estimateTokens(optimizedPrompt);
    console.log(`Intelligent prompt (${estimatedTokens} tokens):`);
    console.log(optimizedPrompt);

    const userMsg: Message = { type: 'user', content: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

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
          response_mode: 'blocking',
          conversation_id: conversationId || '',
          user: 'dashboard-user'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      const botResponse = data.answer || 'Sorry, I encountered an error.';
      
      // Try to extract JSON from the response text
      let steps: Step[] | null = null;
      let displayContent = botResponse;
      
      console.log('Bot response:', botResponse);
      
      const { json: extractedJson, cleanText: textWithoutJson } = extractJsonFromText(botResponse);
      if (extractedJson && isValidStepsArray(extractedJson)) {
        steps = extractedJson;
        
        // If there's meaningful text left, use it; otherwise use a default message
        if (textWithoutJson && textWithoutJson.length > 10) {
          displayContent = textWithoutJson;
        } else {
          displayContent = `I've prepared a step-by-step guide to help you with this task. You can follow the interactive steps below:`;
        }
        
        console.log('Extracted steps:', steps);
        console.log('Display content:', displayContent);
      } else {
        console.log('No valid steps found in response');
      }

      const botMsg: Message = { 
        type: 'bot', 
        content: displayContent,
        timestamp: new Date(),
        steps: steps || undefined,
        hasActiveSteps: steps ? true : false,
        currentStepIndex: 0, // Initialize current step
        completedStepIndices: [] // Initialize completed steps
      };

      setMessages(prev => {
        const newMessages = [...prev, botMsg];
        if (steps) {
          // Set this message as having active steps
          setActiveStepsMessageIndex(newMessages.length - 1);
        }
        return newMessages;
      });

    } catch (error) {
      console.error('API error:', error);
      const errorMsg: Message = { 
        type: 'bot', 
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepsComplete = () => {
    // Update the message to mark steps as completed
    setMessages(prev => prev.map((msg, idx) => 
      idx === activeStepsMessageIndex 
        ? { ...msg, stepsCompleted: true }
        : msg
    ));
    setActiveStepsMessageIndex(null);
    
    // Add a completion message
    const completionMsg: Message = {
      type: 'bot',
      content: '✅ Great! You\'ve completed all the steps. Is there anything else I can help you with?',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, completionMsg]);
  };

  const handleStepsSkip = () => {
    // Update the message to mark steps as skipped
    setMessages(prev => prev.map((msg, idx) => 
      idx === activeStepsMessageIndex 
        ? { ...msg, stepsSkipped: true }
        : msg
    ));
    setActiveStepsMessageIndex(null);
    
    // Add a skip message
    const skipMsg: Message = {
      type: 'bot',
      content: '⏭️ Steps skipped. Feel free to ask if you need help with anything else!',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, skipMsg]);
  };

  const handleStepProgress = (messageIndex: number, currentStep: number, completedSteps: number[]) => {
    // Update the message with current step progress
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex 
        ? { 
            ...msg, 
            currentStepIndex: currentStep,
            completedStepIndices: completedSteps
          }
        : msg
    ));
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
            <button onClick={() => setIsOpen(false)} style={{
              background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer'
            }}>×</button>
          </div>

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
                </div>
                
                {/* Render step progress bar if this message has steps and they're still active */}
                {msg.steps && msg.hasActiveSteps !== false && (
                  <StepProgressBar
                    steps={msg.steps}
                    onComplete={handleStepsComplete}
                    onSkip={handleStepsSkip}
                    onReactivate={() => {
                      // Set the current message as active when reactivating
                      setActiveStepsMessageIndex(idx);
                      // Reset completion states for this specific message
                      setMessages(prev => prev.map((m, i) => 
                        i === idx 
                          ? { ...m, stepsCompleted: false, stepsSkipped: false, hasActiveSteps: true }
                          : m
                      ));
                    }}
                    onStepProgress={(currentStep, completedSteps) => handleStepProgress(idx, currentStep, completedSteps)}
                    isCompleted={msg.stepsCompleted || false}
                    isSkipped={msg.stepsSkipped || false}
                    initialCurrentStep={msg.currentStepIndex || 0}
                    initialCompletedSteps={msg.completedStepIndices || []}
                  />
                )}
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