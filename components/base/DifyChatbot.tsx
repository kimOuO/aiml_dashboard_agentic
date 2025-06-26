// components/base/DifyChatbot.tsx
"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { PromptBuilder } from '@/utils/promptBuilder';
import { ContentAnalyzer } from '@/lib/contentAnalyzer';

const renderMessageContent = (content) => {
  let rendered = content;
  rendered = rendered.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/\*(.*?)\*/g, '<em>$1</em>');
  rendered = rendered.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  rendered = rendered.replace(/`(.*?)`/g, '<code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>');
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

  // Simplified context extraction using ContentAnalyzer
  const getPageContext = () => {
    try {
      const analyzedContext = ContentAnalyzer.analyzePageContent();
      
      // Add debugging
      console.log('Raw analyzed context:', {
        pageTitle: analyzedContext.pageTitle,
        mainHeading: analyzedContext.mainHeading,
        entityType: analyzedContext.semanticContext.entityType,
        entityName: analyzedContext.semanticContext.entityName,
        action: analyzedContext.semanticContext.action,
        section: analyzedContext.semanticContext.section,
        primaryActions: analyzedContext.primaryActions,
        navigationContext: analyzedContext.navigationContext.slice(0, 3) // First 3 for debugging
      });
      
      return {
        pageType: `${analyzedContext.semanticContext.entityType}-${analyzedContext.semanticContext.action}`,
        contextInfo: `User is on ${analyzedContext.pageTitle}${analyzedContext.semanticContext.entityName ? ` for ${analyzedContext.semanticContext.entityName}` : ''}`,
        capabilities: analyzedContext.semanticContext.capabilities,
        navigationLinks: analyzedContext.navigationContext,
        primaryActions: analyzedContext.primaryActions,
        formContext: analyzedContext.formContext,
        dataContext: analyzedContext.dataContext
      };
    } catch (error) {
      console.warn('Context analysis failed, using fallback:', error);
      return {
        pageType: 'unknown',
        contextInfo: 'User is on an unknown page',
        capabilities: [],
        navigationLinks: [],
        primaryActions: [],
        formContext: [],
        dataContext: { tables: [], lists: [], cards: [], pagination: null }
      };
    }
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Use the intelligent prompt builder
    const optimizedPrompt = PromptBuilder.buildIntelligentPrompt(userMessage);

    // Log for monitoring
    const estimatedTokens = PromptBuilder.estimateTokens(optimizedPrompt);
    console.log(`Intelligent prompt (${estimatedTokens} tokens):`);
    console.log(optimizedPrompt);

    const userMsg = { type: 'user', content: userMessage, timestamp: new Date() };
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

      const botMsg = { 
        type: 'bot', 
        content: data.answer || 'Sorry, I encountered an error.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error('API error:', error);
      const errorMsg = { 
        type: 'bot', 
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    setConversationId('');
    console.log('Page context updated:', getPageContext());
  }, [pathname, searchParams]);

  return (
    <>
      {/* Your existing UI remains the same */}
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
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            fontSize: '12px',
            color: '#6b7280',
            borderBottom: '1px solid #e5e7eb'
          }}>
            📍 {getPageContext().contextInfo}
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
              <div key={idx} style={{
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '12px',
                backgroundColor: msg.type === 'user' ? '#1C64F2' : '#f3f4f6',
                color: msg.type === 'user' ? 'white' : '#374151',
                borderRadius: '12px',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderMessageContent(msg.content)
                  }}
                  style={{ wordBreak: 'break-word' }}
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