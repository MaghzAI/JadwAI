'use client';

import { useStudyWizard } from '@/contexts/StudyWizardContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Send, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WizardNavigation() {
  const {
    state,
    nextStep,
    prevStep,
    saveDraft,
    saveStudy,
    canGoNext,
    canGoPrev,
    isCurrentStepValid,
    completedStepsCount,
    totalSteps,
  } = useStudyWizard();

  const { toast } = useToast();
  const { currentStep, steps, isSaving, hasUnsavedChanges, errors } = state;
  const isLastStep = currentStep === steps.length - 1;
  const isReviewStep = steps[currentStep]?.id === 'review';
  const allStepsCompleted = completedStepsCount === totalSteps - 1; // -1 لأن Review step

  const handleSaveDraft = async () => {
    try {
      await saveDraft();
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ المسودة بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ في الحفظ',
        description: 'فشل في حفظ المسودة',
        variant: 'destructive',
      });
    }
  };

  const handleSaveStudy = async () => {
    if (!allStepsCompleted) {
      toast({
        title: 'غير مكتمل',
        description: 'يجب إكمال جميع الأقسام قبل حفظ الدراسة',
        variant: 'destructive',
      });
      return;
    }

    try {
      await saveStudy();
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ دراسة الجدوى بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ في الحفظ',
        description: 'فشل في حفظ دراسة الجدوى',
        variant: 'destructive',
      });
    }
  };

  const handleNext = () => {
    if (isCurrentStepValid || isReviewStep) {
      nextStep();
    } else {
      toast({
        title: 'بيانات غير مكتملة',
        description: 'يرجى إكمال جميع الحقول المطلوبة قبل المتابعة',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={!canGoPrev || isSaving}
          className="flex items-center gap-2"
        >
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>

        {/* Center Section - Status & Warnings */}
        <div className="flex items-center gap-4">
          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">تغييرات غير محفوظة</span>
            </div>
          )}

          {/* Current Step Info */}
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {steps[currentStep]?.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              الخطوة {currentStep + 1} من {totalSteps}
            </div>
          </div>

          {/* Save Draft Button */}
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'جارٍ الحفظ...' : 'حفظ مسودة'}
          </Button>
        </div>

        {/* Next/Finish Section */}
        <div className="flex items-center gap-3">
          {isReviewStep ? (
            /* Review Step - Final Save */
            <Button
              onClick={handleSaveStudy}
              disabled={isSaving || !allStepsCompleted}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="h-4 w-4" />
              {isSaving ? 'جارٍ الحفظ...' : 'حفظ الدراسة'}
            </Button>
          ) : (
            /* Regular Steps - Next Button */
            <Button
              onClick={handleNext}
              disabled={!canGoNext || isSaving}
              className="flex items-center gap-2"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-sm text-red-800 dark:text-red-200">
            <div className="font-medium mb-1">يرجى إصلاح الأخطاء التالية:</div>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
