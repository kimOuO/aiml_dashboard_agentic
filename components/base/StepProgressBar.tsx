"use client";

import { useState, useEffect } from 'react';

interface Step {
  type: string;
  label: string;
  description: string;
  wait_for_user_action: boolean;
}

interface StepProgressBarProps {
  steps: Step[];
  onComplete: () => void;
  onSkip: () => void;
  onReactivate?: () => void;
  onStepProgress?: (currentStep: number, completedSteps: number[]) => void; // Add this callback
  isCompleted?: boolean;
  isSkipped?: boolean;
  initialCurrentStep?: number; // Add this prop
  initialCompletedSteps?: number[]; // Add this prop
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
  initialCompletedSteps = []
}: StepProgressBarProps) => {
  const [currentStep, setCurrentStep] = useState(initialCurrentStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialCompletedSteps);
  const [isExpanded, setIsExpanded] = useState(true);
  const [localCompleted, setLocalCompleted] = useState(false);
  const [localSkipped, setLocalSkipped] = useState(false);

  // Update parent component when step progress changes
  useEffect(() => {
    if (onStepProgress) {
      onStepProgress(currentStep, completedSteps);
    }
  }, [currentStep, completedSteps, onStepProgress]);

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

  const handleNext = () => {
    const newCompletedSteps = [...completedSteps, currentStep];
    setCompletedSteps(newCompletedSteps);
    
    if (currentStep < steps.length - 1) {
      const newCurrentStep = currentStep + 1;
      setCurrentStep(newCurrentStep);
    } else {
      setLocalCompleted(true);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newCurrentStep = currentStep - 1;
      const newCompletedSteps = completedSteps.filter(step => step !== newCurrentStep);
      setCurrentStep(newCurrentStep);
      setCompletedSteps(newCompletedSteps);
    }
  };

  const handleSkipStep = () => {
    const newCompletedSteps = [...completedSteps, currentStep];
    setCompletedSteps(newCompletedSteps);
    
    if (currentStep < steps.length - 1) {
      const newCurrentStep = currentStep + 1;
      setCurrentStep(newCurrentStep);
    } else {
      setLocalCompleted(true);
      onComplete();
    }
  };

  const handleSkipAll = () => {
    setLocalSkipped(true);
    onSkip();
  };

  const handleGoToStep = (stepIndex: number) => {
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
  };

  const progressPercentage = (isCompleted || localCompleted) ? 100 : ((completedSteps.length) / steps.length) * 100;

  const getHeaderColor = () => {
    if (isCompleted || localCompleted) return '#10b981'; // green
    if (isSkipped || localSkipped) return '#6b7280'; // gray
    return '#4f46e5'; // blue (active)
  };

  const getHeaderText = () => {
    if (isCompleted || localCompleted) return '✅ Steps Completed';
    if (isSkipped || localSkipped) return '⏭️ Steps Skipped';
    return `📋 Step-by-Step Guide (${completedSteps.length}/${steps.length})`;
  };

  // Override the completed state detection to prioritize local state
  const isInCompletedState = (localCompleted || localSkipped) || 
                            ((isCompleted || isSkipped) && !localCompleted && !localSkipped);

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      margin: '12px 0',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
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
          onClick={() => setIsExpanded(!isExpanded)}
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
                  onClick={() => handleGoToStep(index)}
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
                onClick={handlePrevious}
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
                onClick={handleSkipStep}
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
              onClick={handleNext}
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
                  onClick={() => handleGoToStep(index)}
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