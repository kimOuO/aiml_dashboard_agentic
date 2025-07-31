"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { uiInteractionService } from '@/services/uiInteractionService';

interface Step {
  type: 'navigate' | 'wait' | 'action' | 'instruction';
  label: string;
  description: string;
  wait_for_user_action: boolean;
  target_url?: string;
  target_element?: string;
  action?: string;
  confirmation?: string;
  selection_required?: boolean;
  entity_type?: string;
  timeout?: number;
  validation_selector?: string;
}

interface StepProgressBarProps {
  steps: Step[];
  onComplete: () => void;
  onSkip: () => void;
  onReactivate?: () => void;
  onStepProgress?: (currentStep: number, completedSteps: number[]) => void;
  isCompleted?: boolean;
  isSkipped?: boolean;
  initialCurrentStep?: number;
  initialCompletedSteps?: number[];
  layout?: 'vertical' | 'horizontal';
}

const StepProgressBar = ({ 
  steps, 
  onComplete, 
  onSkip, 
  onReactivate, 
  onStepProgress,
  isCompleted = false, 
  isSkipped = false,
  initialCurrentStep = 0,
  initialCompletedSteps = [],
  layout = 'vertical'
}: StepProgressBarProps) => {
  const [currentStep, setCurrentStep] = useState(initialCurrentStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialCompletedSteps);
  const [isExpanded, setIsExpanded] = useState(true);
  const [localCompleted, setLocalCompleted] = useState(false);
  const [localSkipped, setLocalSkipped] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<string>('');
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [pendingNavigation, setPendingNavigation] = useState(false);
  const prevPathRef = useRef(pathname);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Memoize the onStepProgress callback to prevent unnecessary re-renders
  const memoizedOnStepProgress = useCallback(onStepProgress, []);

  // Update parent component when step progress changes
  useEffect(() => {
    if (memoizedOnStepProgress) {
      memoizedOnStepProgress(currentStep, completedSteps);
    }
  }, [currentStep, completedSteps, memoizedOnStepProgress]);

  // Restore state from props when they change
  useEffect(() => {
    setCurrentStep(initialCurrentStep);
    setCompletedSteps(initialCompletedSteps);
  }, [initialCurrentStep, initialCompletedSteps]);

  // Auto-minimize when completed or skipped
  useEffect(() => {
    if (isCompleted || isSkipped || localCompleted || localSkipped) {
      setIsExpanded(false);
    }
  }, [isCompleted, isSkipped, localCompleted, localSkipped]);

  // Fixed highlightElement function
  const highlightElement = useCallback((selector: string): Element | null => {
    try {
      // Use the service to find the element with smart fallbacks
      const element = uiInteractionService.findElement(selector);
      if (element) {
        // Remove existing highlights
        document.querySelectorAll('.step-highlight').forEach(el => {
          el.classList.remove('step-highlight');
          // Remove temp attributes
          if (el.hasAttribute('data-temp-highlight')) {
            el.removeAttribute('data-temp-highlight');
          }
        });

        // Add highlight style
        element.classList.add('step-highlight');
        
        // Scroll into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });

        // Add CSS for highlighting if not exists
        if (!document.querySelector('#step-highlight-style')) {
          const style = document.createElement('style');
          style.id = 'step-highlight-style';
          style.textContent = `
            .step-highlight {
              outline: 3px solid #4f46e5 !important;
              outline-offset: 2px !important;
              box-shadow: 0 0 10px rgba(79, 70, 229, 0.5) !important;
              animation: pulse-highlight 2s infinite !important;
              position: relative !important;
              z-index: 9999 !important;
            }
            
            @keyframes pulse-highlight {
              0% { box-shadow: 0 0 10px rgba(79, 70, 229, 0.5); }
              50% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.8); }
              100% { box-shadow: 0 0 10px rgba(79, 70, 229, 0.5); }
            }
            
            .step-highlight::before {
              content: '👆 Click here';
              position: absolute;
              top: -35px;
              left: 50%;
              transform: translateX(-50%);
              background: #4f46e5;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              z-index: 10000;
              pointer-events: none;
              white-space: nowrap;
            }
          `;
          document.head.appendChild(style);
        }

        return element;
      }
    } catch (error) {
      console.error('Error highlighting element:', error);
    }
    return null;
  }, []);

  // Fixed navigation function using Next.js router
  const executeNavigationStep = useCallback(async (step: Step): Promise<boolean> => {
    if (!step.target_url) return false;

    try {
      setExecutionStatus('Navigating...');
      
      // Use Next.js router for proper navigation
      router.push(step.target_url);
      
      // Wait for navigation to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setExecutionStatus('Navigation completed');
      return true;
    } catch (error) {
      setExecutionStatus('Navigation failed');
      return false;
    }
  }, [router]);

  const executeActionStep = useCallback(async (step: Step): Promise<boolean> => {
    if (!step.target_element) return false;

    try {
      setExecutionStatus('Looking for element...');
      
      const success = await uiInteractionService.interactWithElement(
        step.target_element,
        (step.action as 'click' | 'hover' | 'focus') || 'click',
        {
          waitTimeout: 3000,
          retryCount: 1, // Only retry once
          scrollIntoView: true
        }
      );

      if (success) {
        setExecutionStatus('Action completed successfully');
        removeHighlight();
        return true;
      } else {
        setExecutionStatus('Element not found - please proceed manually');
        return true; // Return true to prevent loop
      }
    } catch (error) {
      setExecutionStatus('Action failed - please proceed manually');
      removeHighlight();
      return true; // Return true to prevent loop
    }
  }, []);

  // Highlight multiple elements and attach click handler for auto-advance
  const highlightMultipleElements = useCallback((elements: Element[]) => {
    document.querySelectorAll('.step-highlight').forEach(el => {
      el.classList.remove('step-highlight');
    });

    if (!document.querySelector('#step-highlight-style')) {
      const style = document.createElement('style');
      style.id = 'step-highlight-style';
      style.textContent = `
        .step-highlight {
          outline: 3px solid #4f46e5 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 10px rgba(79, 70, 229, 0.5) !important;
          animation: pulse-highlight 2s infinite !important;
          position: relative !important;
          z-index: 9999 !important;
        }
        @keyframes pulse-highlight {
          0% { box-shadow: 0 0 10px rgba(79, 70, 229, 0.5); }
          50% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.8); }
          100% { box-shadow: 0 0 10px rgba(79, 70, 229, 0.5); }
        }
      `;
      document.head.appendChild(style);
    }

    elements.forEach(element => {
      element.classList.add('step-highlight');
      // Attach click handler for auto-advance
      element.addEventListener('click', () => {
        setPendingNavigation(true);
      }, { once: true });
    });

    if (elements.length > 0) {
      elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Enhanced removeHighlight function
  const removeHighlight = useCallback(() => {
    document.querySelectorAll('.step-highlight').forEach(el => {
      el.classList.remove('step-highlight');
      // Clean up temp attributes
      if (el.hasAttribute('data-temp-highlight')) {
        el.removeAttribute('data-temp-highlight');
      }
    });
    setHighlightedElement(null);
  }, []);

  const handleNext = useCallback(() => {
    removeHighlight();
    const newCompletedSteps = [...completedSteps, currentStep];
    setCompletedSteps(newCompletedSteps);
    
    if (currentStep < steps.length - 1) {
      const newCurrentStep = currentStep + 1;
      setCurrentStep(newCurrentStep);
      setExecutionStatus('');
    } else {
      setLocalCompleted(true);
      onComplete();
    }
  }, [completedSteps, currentStep, steps.length, onComplete, removeHighlight]);

  // Listen for route change and auto-advance if pendingNavigation is true
  useEffect(() => {
    if (pendingNavigation && prevPathRef.current !== pathname) {
      setPendingNavigation(false);
      handleNext();
    }
    prevPathRef.current = pathname;
  }, [pathname, pendingNavigation, handleNext]);

  // Enhanced executeWaitStep with better element detection
  const executeWaitStep = useCallback(async (step: Step): Promise<boolean> => {
    try {
      setExecutionStatus('Looking for elements...');
      
      // Use the simplified service to find elements based on description
      const elements = uiInteractionService.findElementsByDescription(step.description);
      
      if (elements.length > 0) {
        // Highlight ALL found elements
        highlightMultipleElements(elements);
        setExecutionStatus(`Found ${elements.length} element(s) - waiting for user action`);
        return true;
      } else {
        setExecutionStatus('Waiting for user action...');
        return true;
      }
    } catch (error) {
      console.error('Wait step failed:', error);
      setExecutionStatus('Wait step failed');
      return false;
    }
  }, [highlightMultipleElements]);

  // Enhanced executeCurrentStep with better error handling
  const executeCurrentStep = useCallback(async () => {
    const step = steps[currentStep];
    if (!step || isExecuting) return;

    // Prevent double navigation for 'navigate' steps
    if (step.type === 'navigate' && hasNavigated) return;

    setIsExecuting(true);
    setExecutionStatus('');

    try {
      let success = false;

      switch (step.type) {
        case 'navigate':
          setHasNavigated(true); // Mark navigation as triggered
          success = await executeNavigationStep(step);
          break;
        case 'action':
          success = await executeActionStep(step);
          break;
        case 'wait':
          success = await executeWaitStep(step);
          break;
        case 'instruction':
          setExecutionStatus('Please follow the instruction');
          success = true;
          break;
        default:
          setExecutionStatus('Unknown step type');
          success = true; // Don't loop on unknown types
      }

      // Auto-advance only for navigate and instruction types
      if (success && (step.type === 'navigate' || step.type === 'instruction')) {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    } catch (error) {
      setExecutionStatus('Step execution failed');
    } finally {
      setIsExecuting(false);
    }
  }, [currentStep, steps, isExecuting, executeNavigationStep, executeActionStep, executeWaitStep, hasNavigated]);

  const handlePrevious = useCallback(() => {
    removeHighlight();
    setExecutionStatus('');
    if (currentStep > 0) {
      const newCurrentStep = currentStep - 1;
      const newCompletedSteps = completedSteps.filter(step => step !== newCurrentStep);
      setCurrentStep(newCurrentStep);
      setCompletedSteps(newCompletedSteps);
    }
  }, [currentStep, completedSteps, removeHighlight]);

  const handleSkipStep = useCallback(() => {
    removeHighlight();
    const newCompletedSteps = [...completedSteps, currentStep];
    setCompletedSteps(newCompletedSteps);
    
    if (currentStep < steps.length - 1) {
      const newCurrentStep = currentStep + 1;
      setCurrentStep(newCurrentStep);
      setExecutionStatus('');
    } else {
      setLocalCompleted(true);
      onComplete();
    }
  }, [completedSteps, currentStep, steps.length, onComplete, removeHighlight]);

  const handleSkipAll = useCallback(() => {
    removeHighlight();
    setLocalSkipped(true);
    onSkip();
  }, [onSkip, removeHighlight]);

  const handleGoToStep = useCallback((stepIndex: number) => {
    removeHighlight();
    setExecutionStatus('');
    const newCurrentStep = stepIndex;
    const newCompletedSteps = completedSteps.filter(step => step < stepIndex);
    
    setCurrentStep(newCurrentStep);
    setCompletedSteps(newCompletedSteps);
    
    // Reset completion states
    setLocalCompleted(false);
    setLocalSkipped(false);
    setIsExpanded(true);
    
    // Notify parent component that steps are reactivated
    if (onReactivate) {
      onReactivate();
    }
  }, [completedSteps, onReactivate, removeHighlight]);

  // Auto-execute non-wait steps when they become active
  useEffect(() => {
    const step = steps[currentStep];
    if (step && !isExecuting && !localCompleted && !localSkipped) {
      if (step.type === 'navigate' || step.type === 'instruction' || step.type === 'wait') {
        const timer = setTimeout(() => {
          executeCurrentStep();
        }, 300);
        return () => clearTimeout(timer);
      }
      // Don't auto-execute action steps
    }
  }, [currentStep, steps, isExecuting, localCompleted, localSkipped]); // Removed executeCurrentStep dependency

  // Cleanup highlights when component unmounts
  useEffect(() => {
    return () => {
      removeHighlight();
    };
  }, [removeHighlight]);

  // Highlight elements only after render is complete and step is a wait step
  useEffect(() => {
    const step = steps[currentStep];
    if (
      step &&
      step.type === 'wait' &&
      !isExecuting &&
      !localCompleted &&
      !localSkipped
    ) {
      // Find and highlight after render
      const elements = uiInteractionService.findElementsByDescription(step.description);
      if (elements.length > 0) {
        highlightMultipleElements(elements);
        setExecutionStatus(`Found ${elements.length} element(s) - waiting for user action`);
      } else {
        setExecutionStatus('Waiting for user action...');
      }
    }
    // Remove highlight when leaving wait step
    return () => {
      removeHighlight();
    };
  }, [currentStep, isExecuting, localCompleted, localSkipped, steps, highlightMultipleElements, removeHighlight]);

  // Fix progress calculation to use current step position instead of completed steps count
  const progressPercentage = (isCompleted || localCompleted) ? 100 : 
    ((currentStep + 1) / steps.length) * 100;

  const getHeaderColor = () => {
    if (isCompleted || localCompleted) return '#10b981';
    if (isSkipped || localSkipped) return '#6b7280';
    return '#4f46e5';
  };

  const getHeaderText = () => {
    if (isCompleted || localCompleted) return '✅ Steps Completed';
    if (isSkipped || localSkipped) return '⏭️ Steps Skipped';
    return `📋 Step-by-Step Guide (${completedSteps.length}/${steps.length})`;
  };

  // Override the completed state detection to prioritize local state
  const isInCompletedState = (localCompleted || localSkipped) || 
                            ((isCompleted || isSkipped) && !localCompleted && !localSkipped);

  // Prevent event bubbling to background elements
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const getCurrentStepStatus = () => {
    const step = steps[currentStep];
    if (!step) return '';
    
    if (isExecuting) {
      return executionStatus || 'Executing...';
    }
    
    if (step.type === 'wait') {
      return executionStatus || 'Waiting for your action...';
    }
    
    return executionStatus;
  };

  // Horizontal Layout (updated with execution status)
  if (layout === 'horizontal') {
    return (
      <div style={{ padding: '16px' }} onClick={handleContainerClick}>
        {/* Horizontal Progress Line with Step Indicators */}
        <div style={{
          position: 'relative',
          marginBottom: '16px'
        }}>
          {/* Progress Line */}
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#e5e7eb',
            borderRadius: '2px',
            position: 'relative'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: getHeaderColor(),
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Step Indicators */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => handleGoToStep(index)}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: completedSteps.includes(index) ? '#10b981' : 
                                 index === currentStep ? (isExecuting ? '#f59e0b' : '#4f46e5') : '#e5e7eb',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  border: index === currentStep ? '2px solid #c7d2fe' : 'none',
                  animation: index === currentStep && isExecuting ? 'pulse 2s infinite' : 'none'
                }}>
                  {completedSteps.includes(index) ? '✓' : 
                   index === currentStep && isExecuting ? '⟳' : 
                   index + 1}
                </div>
                <span style={{
                  fontSize: '10px',
                  color: completedSteps.includes(index) ? '#10b981' : 
                         index === currentStep ? '#4f46e5' : '#9ca3af',
                  maxWidth: '60px',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {step.label.length > 8 ? step.label.substring(0, 8) + '...' : step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Info - Compact Horizontal with Execution Status */}
        {!isInCompletedState && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: '#f8fafc',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            {/* Step Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                Step {currentStep + 1}: {steps[currentStep]?.label}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                lineHeight: '1.3',
                marginBottom: '4px'
              }}>
                {steps[currentStep]?.description}
              </div>
              
              {/* Execution Status */}
              {getCurrentStepStatus() && (
                <div style={{
                  fontSize: '11px',
                  color: isExecuting ? '#f59e0b' : '#4f46e5',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {isExecuting && <span className="spinner">⟳</span>}
                  {getCurrentStepStatus()}
                </div>
              )}
            </div>

            {/* Action Buttons - Updated with Execute button for wait steps */}
            <div style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                style={{
                  backgroundColor: currentStep === 0 ? '#e5e7eb' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Prev
              </button>
              
              {/* Execute button for manual steps */}
              {steps[currentStep]?.type === 'wait' && !isExecuting && (
                <button
                  onClick={executeCurrentStep}
                  style={{
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  🎯 Show
                </button>
              )}
              
              <button
                onClick={handleSkipStep}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                disabled={isExecuting}
                style={{
                  backgroundColor: isExecuting ? '#e5e7eb' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: isExecuting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {currentStep === steps.length - 1 ? 'Complete ✓' : 'Next →'}
              </button>
            </div>
          </div>
        )}

        {/* Add CSS for spinner animation */}
        <style jsx>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          .spinner {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Completion State - Horizontal */}
        {isInCompletedState && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #dcfce7',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '13px',
              color: '#16a34a',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              {(isCompleted || localCompleted) ? 
                '🎉 All steps completed successfully!' : 
                '⏭️ Steps were skipped.'}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              flexWrap: 'wrap'
            }}>
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => handleGoToStep(index)}
                  style={{
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    color: '#4b5563'
                  }}
                  title={`Redo: ${step.label}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        margin: '12px 0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'auto'
      }}
      onClick={handleContainerClick}
    >
      {/* Header */}
      <div style={{
        backgroundColor: getHeaderColor(),
        color: 'white',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {getHeaderText()}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
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
      </div>

      {/* Progress Bar */}
      <div style={{
        backgroundColor: '#e2e8f0',
        height: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: (isCompleted || localCompleted) ? '#10b981' : (isSkipped || localSkipped) ? '#6b7280' : '#10b981',
          height: '100%',
          width: `${progressPercentage}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>

      {isExpanded && !isInCompletedState && (
        <div style={{ padding: '16px' }}>
          {/* Current Step */}
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #4f46e5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <div style={{
                backgroundColor: '#4f46e5',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {currentStep + 1}
              </div>
              <h4 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1f2937'
              }}>
                {steps[currentStep]?.label}
              </h4>
            </div>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#4b5563',
              lineHeight: '1.5'
            }}>
              {steps[currentStep]?.description}
            </p>
          </div>

          {/* Step Overview */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <h5 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#6b7280'
            }}>
              All Steps:
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {steps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: completedSteps.includes(index) ? '#10b981' : 
                           index === currentStep ? '#4f46e5' : '#9ca3af',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoToStep(index);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: completedSteps.includes(index) ? '#10b981' : 
                                   index === currentStep ? '#4f46e5' : '#e5e7eb',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {completedSteps.includes(index) ? '✓' : index + 1}
                  </div>
                  <span style={{
                    textDecoration: completedSteps.includes(index) ? 'line-through' : 'none'
                  }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                disabled={currentStep === 0}
                style={{
                  backgroundColor: currentStep === 0 ? '#e5e7eb' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                ← Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkipStep();
                }}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                Skip Step
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              {currentStep === steps.length - 1 ? 'Complete ✓' : 'Next Step →'}
            </button>
          </div>
        </div>
      )}

      {/* Minimized completed/skipped state with navigation */}
      {isExpanded && isInCompletedState && (
        <div style={{ padding: '16px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              {(isCompleted || localCompleted) ? 
                'All steps have been completed successfully!' : 
                'Steps were skipped.'}
            </p>
            
            {/* Quick Navigation to Steps */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center'
            }}>
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoToStep(index);
                  }}
                  style={{
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    color: '#4b5563',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                    e.currentTarget.style.color = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#4b5563';
                  }}
                  title={`Go back to: ${step.label}`}
                >
                  {index + 1}. {step.label.length > 15 ? step.label.substring(0, 15) + '...' : step.label}
                </button>
              ))}
            </div>
            
            <div style={{
              marginTop: '12px',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                Click any step above to review or redo it
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepProgressBar;