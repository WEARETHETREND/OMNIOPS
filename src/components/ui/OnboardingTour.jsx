import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const defaultSteps = [
  {
    target: '[data-tour="dashboard"]',
    title: 'Welcome to OmniOps!',
    content: 'This is your command center. View key metrics, alerts, and workflows at a glance.',
    position: 'bottom'
  },
  {
    target: '[data-tour="search"]',
    title: 'Quick Search',
    content: 'Press ⌘K anytime to search across workflows, integrations, and alerts.',
    position: 'bottom'
  },
  {
    target: '[data-tour="workflows"]',
    title: 'Workflows',
    content: 'Create and manage automated workflows to streamline your operations.',
    position: 'right'
  },
  {
    target: '[data-tour="integrations"]',
    title: 'Integrations',
    content: 'Connect your favorite tools and services to sync data automatically.',
    position: 'right'
  },
  {
    target: '[data-tour="alerts"]',
    title: 'Alerts',
    content: 'Stay informed with real-time alerts and notifications.',
    position: 'right'
  }
];

export default function OnboardingTour({ steps = defaultSteps, storageKey = 'omniops-tour-completed' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isVisible) return;

    const step = steps[currentStep];
    const target = document.querySelector(step.target);
    
    if (target) {
      const rect = target.getBoundingClientRect();
      let top, left;

      switch (step.position) {
        case 'bottom':
          top = rect.bottom + 12;
          left = rect.left + rect.width / 2;
          break;
        case 'top':
          top = rect.top - 12;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 12;
          break;
        case 'right':
        default:
          top = rect.top + rect.height / 2;
          left = rect.right + 12;
          break;
      }

      setPosition({ top, left });
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-slate-900/50 z-[100]" onClick={handleSkip} />
      
      {/* Tooltip */}
      <div
        className={cn(
          "fixed z-[101] w-80 bg-white rounded-xl shadow-2xl border border-slate-200",
          step.position === 'bottom' && '-translate-x-1/2',
          step.position === 'top' && '-translate-x-1/2 -translate-y-full',
          step.position === 'left' && '-translate-x-full -translate-y-1/2',
          step.position === 'right' && '-translate-y-1/2'
        )}
        style={{ top: position.top, left: position.left }}
      >
        {/* Arrow */}
        <div className={cn(
          "absolute w-3 h-3 bg-white border-slate-200 rotate-45",
          step.position === 'bottom' && '-top-1.5 left-1/2 -translate-x-1/2 border-l border-t',
          step.position === 'top' && '-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b',
          step.position === 'left' && '-right-1.5 top-1/2 -translate-y-1/2 border-t border-r',
          step.position === 'right' && '-left-1.5 top-1/2 -translate-y-1/2 border-b border-l'
        )} />

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-slate-900">{step.title}</h3>
            </div>
            <button onClick={handleSkip} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">{step.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    i === currentStep ? "bg-slate-900" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" onClick={handlePrev}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              <Button size="sm" onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function resetTour(storageKey = 'omniops-tour-completed') {
  localStorage.removeItem(storageKey);
  window.location.reload();
}