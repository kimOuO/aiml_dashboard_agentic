"use client";

import { useState, useEffect, useRef } from 'react';
import StepProgressBar from './StepProgressBar';

interface Step {
  type: string;
  label: string;
  description: string;
  wait_for_user_action: boolean;
  action_type?: 'navigation' | 'click' | 'wait' | 'confirm' | 'input';
  target_selector?: string;
  target_url?: string;
  confirmation_text?: string;
  auto_execute?: boolean;
  validation_selector?: string;
  timeout?: number;
}

const GlobalStepAssistant = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0 });
  const dragRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  // Track step progress from StepProgressBar - but don't persist
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Define handleHideSteps at component level so it can be used anywhere
  const handleHideSteps = () => {
    setIsVisible(false);
    // Trigger event to restore chatbox
    window.dispatchEvent(new CustomEvent('stepAssistantHidden'));
  };

  // Listen for global step assistant requests
  useEffect(() => {
    const handleShowSteps = (event: CustomEvent) => {
      const { steps: newSteps, title: stepTitle } = event.detail;
      setSteps(newSteps);
      setTitle(stepTitle || 'Step-by-Step Guide');
      setIsVisible(true);
      setIsExpanded(true);
      
      // Always start fresh - no progress restoration
      setCurrentStep(0);
      setCompletedSteps([]);
      
      // Trigger event to minimize chatbox
      window.dispatchEvent(new CustomEvent('stepAssistantShown'));
    };

    window.addEventListener('showStepAssistant' as any, handleShowSteps);
    window.addEventListener('hideStepAssistant' as any, handleHideSteps);

    return () => {
      window.removeEventListener('showStepAssistant' as any, handleShowSteps);
      window.removeEventListener('hideStepAssistant' as any, handleHideSteps);
    };
  }, []);

  // Handle horizontal dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Prevent text selection during drag
      e.preventDefault();
      
      const deltaX = e.clientX - startX.current;
      const maxLeft = window.innerWidth - 600;
      const newX = Math.max(0, Math.min(maxLeft, deltaX));
      
      setPosition({ x: newX });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        // Prevent any click events from firing after drag
        e.preventDefault();
        e.stopPropagation();
      }
      setIsDragging(false);
    };

    if (isDragging) {
      // Disable text selection globally during drag
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp, true); // Use capture phase
      
      return () => {
        // Re-enable text selection
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp, true);
      };
    }
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default to stop text selection
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    startX.current = e.clientX - position.x;
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Don't clear any localStorage since we're not saving step progress
    // Trigger completion event - this will restore chatbox
    window.dispatchEvent(new CustomEvent('stepAssistantCompleted'));
  };

  const handleSkip = () => {
    setIsVisible(false);
    // Don't clear any localStorage since we're not saving step progress
    // Trigger skip event - this will restore chatbox
    window.dispatchEvent(new CustomEvent('stepAssistantSkipped'));
  };

  const handleReactivate = () => {
    setIsVisible(true);
    setIsExpanded(true);
  };

  // Handle step progress updates from StepProgressBar - but don't persist
  const handleStepProgress = (newCurrentStep: number, newCompletedSteps: number[]) => {
    setCurrentStep(newCurrentStep);
    setCompletedSteps(newCompletedSteps);
    // Remove: No localStorage saving
  };

  // Calculate progress percentage - using actual state
  const progressPercentage = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;

  if (!isVisible || steps.length === 0) {
    return null;
  }

  return (
    <div
      ref={dragRef}
      style={{
        position: 'fixed',
        bottom: 0,
        left: position.x,
        width: '600px',
        maxWidth: 'calc(100vw - 120px)',
        backgroundColor: 'white',
        borderRadius: isExpanded ? '12px 12px 0 0' : '8px 8px 0 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        zIndex: 10000,
        border: '1px solid #e5e7eb',
        borderBottom: 'none',
        overflow: 'hidden',
        transition: isDragging ? 'none' : 'all 0.3s ease',
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {/* Header - Remove progress restoration indicator */}
      <div
        style={{
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          minHeight: '40px',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {/* Left Side - Title and Progress */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          flex: 1,
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}>
          <span style={{ fontSize: '14px' }}>🎯</span>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
            {title}
          </span>
          
          {/* Mini Progress Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '4px 8px',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}>
            <div style={{
              width: '60px',
              height: '3px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                backgroundColor: 'white',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontSize: '11px', opacity: 0.9 }}>
              Step {currentStep + 1}/{steps.length}
            </span>
          </div>
        </div>

        {/* Right Side - Controls */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* Quick Position Buttons */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPosition({ x: 0 });
            }}
            onMouseDown={(e) => {
              e.stopPropagation(); // Prevent drag start on button clicks
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '3px',
              padding: '2px 6px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
            title="Move to left"
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPosition({ x: (window.innerWidth - 600) / 2 });
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '3px',
              padding: '2px 6px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
            title="Move to center"
          >
            ⬤
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPosition({ x: window.innerWidth - 720 });
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '3px',
              padding: '2px 6px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
            title="Move to right"
          >
            →
          </button>

          {/* Expand/Collapse */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isExpanded ? '−' : '+'}
          </button>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleHideSteps();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div style={{ 
          maxHeight: '300px', 
          overflow: 'auto'
        }}>
          <StepProgressBar
            steps={steps}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onReactivate={handleReactivate}
            onStepProgress={handleStepProgress}
            isCompleted={false}
            isSkipped={false}
            initialCurrentStep={currentStep} // Pass current state instead of 0
            initialCompletedSteps={completedSteps} // Pass current state instead of []
            layout="horizontal"
          />
        </div>
      )}

      {/* Drag Handle Indicator */}
      <div style={{
        position: 'absolute',
        top: '2px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '30px',
        height: '3px',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: '2px',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

// Helper functions remain the same
export const showStepAssistant = (steps: Step[], title?: string) => {
  window.dispatchEvent(new CustomEvent('showStepAssistant', {
    detail: { steps, title }
  }));
};

export const hideStepAssistant = () => {
  window.dispatchEvent(new CustomEvent('hideStepAssistant'));
};

export default GlobalStepAssistant;
