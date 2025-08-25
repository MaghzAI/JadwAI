'use client';

import { useStudyWizard } from '@/contexts/StudyWizardContext';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WizardProgress() {
  const { state, setStep, progressPercentage, completedStepsCount, totalSteps } = useStudyWizard();
  const { currentStep, steps } = state;

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            تقدم دراسة الجدوى
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedStepsCount} من {totalSteps} مكتملة
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
          {progressPercentage}%
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = step.completed;
          const isValid = step.valid;
          const hasError = !isValid && index <= currentStep;

          return (
            <button
              key={step.id}
              onClick={() => setStep(index)}
              className={cn(
                "w-full flex items-center p-3 rounded-lg transition-all duration-200",
                "border text-right hover:shadow-sm",
                isActive && "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
                !isActive && isCompleted && "border-green-300 bg-green-50 dark:bg-green-900/20",
                !isActive && !isCompleted && hasError && "border-red-300 bg-red-50 dark:bg-red-900/20",
                !isActive && !isCompleted && !hasError && "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
              disabled={index > currentStep + 1 && !isCompleted}
            >
              {/* Icon */}
              <div className="ml-3">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : hasError ? (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                ) : isActive ? (
                  <Circle className="h-5 w-5 text-blue-600 dark:text-blue-400 fill-current" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium truncate",
                  isActive && "text-blue-900 dark:text-blue-100",
                  isCompleted && "text-green-900 dark:text-green-100",
                  hasError && "text-red-900 dark:text-red-100",
                  !isActive && !isCompleted && !hasError && "text-gray-900 dark:text-gray-100"
                )}>
                  {step.title}
                </div>
                <div className={cn(
                  "text-sm mt-1 truncate",
                  isActive && "text-blue-700 dark:text-blue-300",
                  isCompleted && "text-green-700 dark:text-green-300",
                  hasError && "text-red-700 dark:text-red-300",
                  !isActive && !isCompleted && !hasError && "text-gray-500 dark:text-gray-400"
                )}>
                  {step.description}
                </div>
              </div>

              {/* Step Number */}
              <div className={cn(
                "mr-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                isActive && "bg-blue-600 text-white",
                isCompleted && "bg-green-600 text-white",
                hasError && "bg-red-600 text-white",
                !isActive && !isCompleted && !hasError && "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
              )}>
                {index + 1}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
