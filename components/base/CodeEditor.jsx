import React, { useState, useRef, useEffect } from 'react';
import { useToastNotification } from '@/app/modalComponent';

const CodeEditor = ({ 
  initialCode = '', 
  onSave, 
  onClose, 
  fileName = 'untitled.py',
  isOpen = false 
}) => {
  const [code, setCode] = useState(initialCode);
  const [isModified, setIsModified] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const textareaRef = useRef(null);
  const { showToast } = useToastNotification();

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setIsModified(newCode !== initialCode);
  };

  const handleSave = () => {
    // Create a blob and simulate file for compatibility with existing file handlers
    const blob = new Blob([code], { type: 'text/python' });
    const file = new File([blob], fileName, { type: 'text/python' });
    
    onSave(file, code);
    setIsModified(false);
    showToast(true, 'Code saved successfully');
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      showToast(false, 'Please enter a prompt for AI code generation');
      return;
    }

    setIsGenerating(true);
    try {
      // This would integrate with your DifyChatbot or AI service
      const response = await fetch('/api/ai-code-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          existingCode: code,
          fileName: fileName,
          context: 'pipeline'
        })
      });

      if (!response.ok) throw new Error('AI generation failed');
      
      const result = await response.json();
      const generatedCode = result.code || result.answer;
      
      if (generatedCode) {
        setCode(generatedCode);
        setIsModified(true);
        showToast(true, 'AI code generated successfully');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      showToast(false, 'Failed to generate AI code');
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  const handleKeyDown = (e) => {
    // Tab handling for code indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setIsModified(true);
      
      // Reset cursor position
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Debug logging - removed the problematic references
  console.log('CodeEditor rendering with isOpen:', isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-lg w-5/6 h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold">Code Editor - {fileName}</h3>
            {isModified && (
              <span className="text-sm text-orange-600 font-medium">● Unsaved changes</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!isModified}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="p-4 border-b bg-blue-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask AI to generate or modify your code..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
            />
            <button
              onClick={handleAiGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
            >
              {isGenerating ? 'Generating...' : '🤖 Generate'}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            💡 Try: "Create a data preprocessing function", "Add error handling", "Optimize this code"
          </p>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-4">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full font-mono text-sm border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="# Start writing your Python code here...
# You can use the AI assistant above to help generate code

def main():
    pass

if __name__ == '__main__':
    main()"
            spellCheck={false}
          />
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 bg-gray-50 border-t text-sm text-gray-600 rounded-b-lg">
          Lines: {code.split('\n').length} | Characters: {code.length}
          {isModified && <span className="ml-4 text-orange-600">Unsaved changes</span>}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;