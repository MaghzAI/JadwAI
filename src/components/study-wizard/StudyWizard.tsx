'use client';

import { useStudyWizard } from '@/contexts/StudyWizardContext';
import WizardProgress from './WizardProgress';
import WizardNavigation from './WizardNavigation';
import ExecutiveSummaryStep from './steps/ExecutiveSummaryStep';
import MarketAnalysisStep from './steps/MarketAnalysisStep';
import FinancialAnalysisStep from './steps/FinancialAnalysisStep';
import TechnicalAnalysisStep from './steps/TechnicalAnalysisStep';
import RiskAssessmentStep from './steps/RiskAssessmentStep';
import ReviewStep from './steps/ReviewStep';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function StudyWizard() {
  const context = useStudyWizard();
  const { state, updateData } = context;
  const { currentStep, steps, isLoading, errors } = state;
  const { executiveSummary, marketAnalysis, financialAnalysis, technicalAnalysis, riskAssessment } = state.data;

  const handleAISuggestionApply = (type: string, data: any) => {
    switch (type) {
      case 'executive_summary':
        if (typeof data === 'string') {
          updateData({
            executiveSummary: {
              projectName: data.split('\n')[0] || '',
              objectives: data.split('\n').filter(line => line.trim()).slice(1).join('\n')
            }
          });
        }
        break;
      case 'market_analysis':
        if (data && typeof data === 'object') {
          updateData({
            marketAnalysis: {
              marketSize: data.marketSize || '',
              growthRate: data.growthRate || '',
              marketTrends: data.marketTrends || data.keyTrends || [],
              targetMarket: data.targetMarket || '',
              customerSegments: data.customerSegments || []
            }
          });
        }
        break;
      case 'risk_assessment':
        if (data && typeof data === 'object') {
          updateData({
            riskAssessment: data
          });
        }
        break;
    }
  };

  const getCurrentStepData = () => {
    return {
      currentStep: steps[currentStep]?.id,
      executiveSummary,
      marketAnalysis,
      financialAnalysis,
      technicalAnalysis,
      riskAssessment
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">جارٍ تحميل دراسة الجدوى...</p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    const stepId = steps[currentStep]?.id;

    switch (stepId) {
      case 'executive-summary':
        return <ExecutiveSummaryStep />;
      case 'market-analysis':
        return <MarketAnalysisStep />;
      case 'financial-analysis':
        return <FinancialAnalysisStep />;
      case 'technical-analysis':
        return <TechnicalAnalysisStep />;
      case 'risk-assessment':
        return <RiskAssessmentStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              خطوة غير متوفرة: {stepId}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar - Progress */}
        <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 min-h-screen">
          <WizardProgress />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {steps[currentStep]?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {steps[currentStep]?.description}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* General Errors */}
              {errors.general && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Step Content Card */}
              <Card>
                <CardContent className="p-6">
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <WizardNavigation />
        </div>

        {/* AI Assistant */}
        <AIAssistant 
          currentStep={steps[currentStep]?.id}
          studyData={getCurrentStepData()}
          onSuggestionApply={handleAISuggestionApply}
        />
      </div>
    </div>
  );
}
