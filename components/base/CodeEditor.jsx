import React, { useState, useRef, useEffect } from 'react';
import { useToastNotification } from '@/app/modalComponent';

// Import Prism.js
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-coy.css';

const CodeEditor = ({ 
  initialCode = '', 
  onSave, 
  onClose, 
  fileName = 'untitled.py',
  isOpen = false,
  isReadOnly = false
}) => {
  const [code, setCode] = useState(initialCode);
  const [isModified, setIsModified] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const textareaRef = useRef(null);
  const codeDisplayRef = useRef(null);
  const editorHighlightRef = useRef(null);
  const { showToast } = useToastNotification();
  
  // Chat-related state (only for edit mode)
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(!isReadOnly);
  const [pendingCodeSuggestion, setPendingCodeSuggestion] = useState(null);
  const chatEndRef = useRef(null);

  // Undo/Redo state (only for edit mode)
  const [history, setHistory] = useState([initialCode]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  const lastSaveTimeRef = useRef(Date.now());

  // Download function
  const handleDownload = () => {
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'code.py';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast(true, `File downloaded as ${fileName}`);
    } catch (error) {
      showToast(false, 'Failed to download file');
      console.error('Download error:', error);
    }
  };

  // Enhanced close function with unsaved changes warning
  const handleClose = () => {
    if (isModified && !isReadOnly) {
      const userConfirmed = window.confirm(
        '⚠️ You have unsaved changes!\n\nYour changes will be lost if you close without saving.\n\nClick "OK" to close anyway or "Cancel" to stay and save your work.'
      );
      
      if (!userConfirmed) {
        return; // Don't close, let user save
      }
    }
    
    onClose();
  };

  // Prevent browser tab/window close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isModified && !isReadOnly) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
        return ''; // Required for some browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isModified, isReadOnly]);

  // Highlight code using Prism.js
  const highlightCode = (code) => {
    return Prism.highlight(code, Prism.languages.python, 'python');
  };

  // Sync scroll between textarea and highlight overlay
  const handleScroll = (e) => {
    if (editorHighlightRef.current && textareaRef.current) {
      editorHighlightRef.current.scrollTop = e.target.scrollTop;
      editorHighlightRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Re-highlight when code changes in edit mode
  useEffect(() => {
    if (!isReadOnly && editorHighlightRef.current) {
      editorHighlightRef.current.innerHTML = highlightCode(code);
    }
  }, [code, isReadOnly]);

  // Re-highlight when code changes in read-only mode
  useEffect(() => {
    if (isReadOnly && codeDisplayRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        Prism.highlightElement(codeDisplayRef.current);
      }, 0);
    }
  }, [code, isReadOnly]);

  useEffect(() => {
    if (isOpen && !isReadOnly && textareaRef.current) {
      textareaRef.current.focus();
    }
    
    if (isOpen && !isReadOnly && chatMessages.length === 0) {
      setChatMessages([{
        type: 'assistant',
        content: `👋 Hi! I'm here to help you with your code. I can:
• Generate new code snippets
• Review and improve existing code
• Add comments and documentation
• Fix bugs and optimize performance
• Suggest best practices

Use Ctrl+Z to undo and Ctrl+Y to redo changes.

What would you like me to help you with?`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, isReadOnly]);

  useEffect(() => {
    setCode(initialCode);
    if (!isReadOnly) {
      setHistory([initialCode]);
      setHistoryIndex(0);
    }
  }, [initialCode, isReadOnly]);

  useEffect(() => {
    if (!isReadOnly && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isReadOnly]);

  // Add to history with debouncing
  const addToHistory = (newCode) => {
    if (isReadOnly) return;
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTimeRef.current;
    
    // Only add to history if enough time has passed (debounce) or it's a significant change
    if (timeSinceLastSave > 1000 || Math.abs(newCode.length - code.length) > 10) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newCode);
        
        // Limit history size to prevent memory issues
        if (newHistory.length > 50) {
          return newHistory.slice(-50);
        }
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);
      lastSaveTimeRef.current = now;
    }
  };

  const handleCodeChange = (newCode) => {
    if (isReadOnly) return;
    setCode(newCode);
    setIsModified(newCode !== initialCode);
    
    // Don't add to history if this is an undo/redo action
    if (!isUndoRedoAction) {
      addToHistory(newCode);
    }
  };

  const undo = () => {
    if (isReadOnly) return;
    if (historyIndex > 0) {
      setIsUndoRedoAction(true);
      const newIndex = historyIndex - 1;
      const previousCode = history[newIndex];
      setCode(previousCode);
      setHistoryIndex(newIndex);
      setIsModified(previousCode !== initialCode);
      showToast(true, 'Undo applied');
      
      // Reset flag after state update
      setTimeout(() => setIsUndoRedoAction(false), 0);
    } else {
      showToast(false, 'Nothing to undo');
    }
  };

  const redo = () => {
    if (isReadOnly) return;
    if (historyIndex < history.length - 1) {
      setIsUndoRedoAction(true);
      const newIndex = historyIndex + 1;
      const nextCode = history[newIndex];
      setCode(nextCode);
      setHistoryIndex(newIndex);
      setIsModified(nextCode !== initialCode);
      showToast(true, 'Redo applied');
      
      // Reset flag after state update
      setTimeout(() => setIsUndoRedoAction(false), 0);
    } else {
      showToast(false, 'Nothing to redo');
    }
  };

  const handleSave = () => {
    if (isReadOnly || !onSave) return;
    const blob = new Blob([code], { type: 'text/python' });
    const file = new File([blob], fileName, { type: 'text/python' });
    
    onSave(file, code);
    setIsModified(false);
    
    // Add save point to history
    addToHistory(code);
    
    showToast(true, 'Code saved successfully');
  };

  // Enhanced AI chat function
  const handleAiChat = async () => {
    if (isReadOnly) return;
    if (!aiPrompt.trim()) {
      showToast(false, 'Please enter a message');
      return;
    }

    const userMessage = {
      type: 'user',
      content: aiPrompt,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);
    
    // Clear input immediately
    const currentPrompt = aiPrompt;
    setAiPrompt('');

    try {
      // Enhanced prompt with context
      const enhancedPrompt = `
Context: I'm working on a file called "${fileName}" with the following code:

\`\`\`python
${code}
\`\`\`

User Request: ${currentPrompt}

Please provide a helpful response. If you're suggesting code changes:
1. Explain what you're suggesting and why
2. Provide the code in a clear format
3. Mention any important considerations or trade-offs

Response:`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_DIFY_BASE_URL}/v1/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: enhancedPrompt,
          response_mode: 'blocking',
          user: 'code-editor-user'
        })
      });

      if (!response.ok) throw new Error('AI request failed');
      
      const result = await response.json();
      const aiResponse = result.answer || 'Sorry, I encountered an error.';

      // Parse response for code suggestions
      const codeBlockRegex = /```(?:python)?\s*([\s\S]*?)```/g;
      const codeMatches = [...aiResponse.matchAll(codeBlockRegex)];
      
      const assistantMessage = {
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        codeBlocks: codeMatches.map(match => match[1].trim())
      };

      setChatMessages(prev => [...prev, assistantMessage]);

      // If there's code in the response, offer to apply it
      if (codeMatches.length > 0) {
        setPendingCodeSuggestion(codeMatches[0][1].trim());
      }

    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCodeSuggestion = (suggestedCode) => {
    // Add current state to history before applying suggestion
    addToHistory(code);
    
    setCode(suggestedCode);
    setIsModified(true);
    setPendingCodeSuggestion(null);
    showToast(true, 'Code suggestion applied! Use Ctrl+Z to undo if needed.');
    
    // Add to history after applying
    addToHistory(suggestedCode);
    
    // Add confirmation message to chat
    setChatMessages(prev => [...prev, {
      type: 'system',
      content: '✅ Code suggestion has been applied to the editor. You can undo this change with Ctrl+Z.',
      timestamp: new Date()
    }]);
  };

  const insertCodeAtCursor = (codeToInsert) => {
    if (textareaRef.current) {
      // Add current state to history before insertion
      addToHistory(code);
      
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newCode = code.substring(0, start) + codeToInsert + code.substring(end);
      setCode(newCode);
      setIsModified(true);
      
      // Add to history after insertion
      addToHistory(newCode);
      
      // Focus back to textarea and set cursor position
      setTimeout(() => {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + codeToInsert.length;
      }, 0);
      
      showToast(true, 'Code snippet inserted! Use Ctrl+Z to undo if needed.');
    }
  };

  const handleKeyDown = (e) => {
    // Handle undo/redo shortcuts
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
      return;
    }
    
    if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
      e.preventDefault();
      redo();
      return;
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setIsModified(true);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const formatMessageContent = (content) => {
    // Simple formatting for chat messages
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px;">$1</code>')
      .replace(/\n/g, '<br>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-lg w-[95%] h-[90%] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold">
              {isReadOnly ? '📖 Code Viewer (Read-Only)' : 'Code Editor'} - {fileName}
            </h3>
            {isReadOnly ? (
              <span className="text-sm text-blue-600 font-medium">👁️ View Mode</span>
            ) : (
              isModified && (
                <span className="text-sm text-orange-600 font-medium">
                  ● Unsaved changes
                </span>
              )
            )}
          </div>
          <div className="flex gap-2">
            {/* Download button - available in both modes */}
            <button
              onClick={handleDownload}
              className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              title="Download file to your computer"
            >
              💾 Download
            </button>
            
            {/* Show edit controls only in edit mode */}
            {!isReadOnly && (
              <>
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-gray-700"
                  title="Undo (Ctrl+Z)"
                >
                  ↶ Undo
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-gray-700"
                  title="Redo (Ctrl+Y)"
                >
                  ↷ Redo
                </button>
                <button
                  onClick={() => setIsChatVisible(!isChatVisible)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  {isChatVisible ? '📝 Hide Chat' : '💬 Show Chat'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isModified}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isModified 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                  title={isModified ? "Save your changes" : "No changes to save"}
                >
                  {isModified ? '💾 Save' : '✓ Saved'}
                </button>
              </>
            )}
            <button
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor/Viewer Section */}
          <div className={`flex flex-col ${!isReadOnly && isChatVisible ? 'w-1/2' : 'w-full'} ${!isReadOnly ? 'border-r' : ''}`}>
            {/* Code Editor/Viewer */}
            <div className="flex-1 overflow-hidden">
              {isReadOnly ? (
                // Read-only code display with syntax highlighting
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex border border-gray-300 rounded-md m-4 bg-white overflow-hidden">
                    {/* Line numbers */}
                    <div className="bg-gray-100 border-r border-gray-300 px-2 py-4 text-sm font-mono text-gray-500 select-none overflow-hidden">
                      {code.split('\n').map((_, index) => (
                        <div key={index} className="text-right pr-2 leading-6 min-h-[24px]">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    
                    {/* Code content with syntax highlighting */}
                    <div className="flex-1 overflow-auto">
                      <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words min-h-full m-0 p-4">
                        <code 
                          ref={codeDisplayRef}
                          className="language-python"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightCode(code) 
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                  
                  <div className="px-4 pb-2 text-xs text-gray-500 flex justify-between">
                    <span>📜 Scroll to view more content</span>
                    <span>🎨 Prism.js syntax highlighting</span>
                  </div>
                </div>
              ) : (
                // Enhanced editable code editor with syntax highlighting overlay
                <div className="p-4 h-full">
                  <div className="relative w-full h-full border border-gray-300 rounded-md overflow-hidden">
                    {/* Syntax highlighting overlay */}
                    <pre 
                      ref={editorHighlightRef}
                      className="absolute inset-0 font-mono text-sm leading-6 p-4 whitespace-pre-wrap break-words pointer-events-none overflow-auto"
                      style={{ 
                        margin: 0, 
                        tabSize: 4,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        zIndex: 2,
                        color: '#1f2937'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: highlightCode(code) 
                      }}
                    />
                    
                    {/* Editable textarea */}
                    <textarea
                      ref={textareaRef}
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onScroll={handleScroll}
                      className="absolute inset-0 w-full h-full font-mono text-sm leading-6 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                      placeholder="# Start writing your Python code here...
# Use the chat panel to get AI assistance
# Press Ctrl+Z to undo, Ctrl+Y to redo

def main():
    pass

if __name__ == '__main__':
    main()"
                      spellCheck={false}
                      style={{ 
                        tabSize: 4,
                        color: 'transparent',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        zIndex: 1,
                        caretColor: '#1e293b'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Clean Status Bar */}
            <div className="px-4 py-2 bg-gray-50 border-t text-sm text-gray-600 flex justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <span>Lines: {code.split('\n').length} | Characters: {code.length}</span>
                {isReadOnly ? (
                  <span className="text-blue-600">Read-Only • Syntax Highlighted</span>
                ) : (
                  <span className="text-green-600">Live Syntax Highlighting</span>
                )}
                <button
                  onClick={handleDownload}
                  className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                  title="Download current code"
                >
                  💾 Download
                </button>
              </div>
              {!isReadOnly && (
                <div className="text-xs flex items-center gap-4">
                  <span>History: {historyIndex + 1}/{history.length}</span>
                  <span>Ctrl+Z: Undo | Ctrl+Y: Redo</span>
                </div>
              )}
            </div>
          </div>

          {/* Chat Panel - only show in edit mode */}
          {!isReadOnly && isChatVisible && (
            <div className="w-1/2 flex flex-col bg-gray-50">
              {/* Chat Header */}
              <div className="p-3 border-b bg-blue-100">
                <h4 className="font-semibold text-blue-800">🤖 AI Assistant</h4>
                <p className="text-xs text-blue-600">Ask questions, get code suggestions, and review before applying</p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : message.type === 'system'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      {message.type === 'assistant' && message.codeBlocks ? (
                        <div>
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: formatMessageContent(message.content.replace(/```(?:python)?\s*[\s\S]*?```/g, '')) 
                            }} 
                          />
                          {message.codeBlocks.map((codeBlock, codeIndex) => (
                            <div key={codeIndex} className="mt-3 bg-gray-100 rounded-md">
                              <div className="flex justify-between items-center p-2 bg-gray-200 rounded-t-md">
                                <span className="text-xs font-medium text-gray-600">Code Suggestion</span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => applyCodeSuggestion(codeBlock)}
                                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                  >
                                    ✓ Apply
                                  </button>
                                  <button
                                    onClick={() => insertCodeAtCursor(codeBlock)}
                                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                                  >
                                    + Insert
                                  </button>
                                </div>
                              </div>
                              <pre className="p-3 text-sm font-mono overflow-x-auto">{codeBlock}</pre>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: formatMessageContent(message.content) 
                          }} 
                        />
                      )}
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        <span>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-3 pt-3 bg-white border-t">
                <div className="text-xs text-gray-600 mb-2">Quick actions:</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {[
                    'Review this code',
                    'Add comments',
                    'Optimize performance',
                    'Add error handling',
                    'Create unit tests'
                  ].map((action) => (
                    <button
                      key={action}
                      onClick={() => setAiPrompt(action)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Chat Input */}
              <div className="p-3 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask AI about your code or request help..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                  />
                  <button
                    onClick={handleAiChat}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
                  >
                    {isGenerating ? '🔄' : '💬'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;