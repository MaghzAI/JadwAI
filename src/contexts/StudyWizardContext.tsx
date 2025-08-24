'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

// أنواع البيانات للمعالج
export interface StudyWizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  valid: boolean;
}

export interface StudyWizardData {
  projectId: string;
  studyId?: string;
  executiveSummary?: Partial<ExecutiveSummary>;
  marketAnalysis?: Partial<MarketAnalysis>;
  financialAnalysis?: Partial<FinancialAnalysis>;
  technicalAnalysis?: Partial<TechnicalAnalysis>;
  riskAssessment?: Partial<RiskAssessment>;
  lastSaved?: Date;
  isDraft: boolean;
}

export interface StudyWizardState {
  currentStep: number;
  steps: StudyWizardStep[];
  data: StudyWizardData;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  errors: Record<string, string>;
}

// أنواع الإجراءات
type StudyWizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_DATA'; payload: Partial<StudyWizardData> }
  | { type: 'UPDATE_STEP_STATUS'; payload: { stepIndex: number; completed: boolean; valid: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'CLEAR_ALL_ERRORS' }
  | { type: 'INITIALIZE_STEPS' }
  | { type: 'RESET_WIZARD'; payload: { projectId?: string } }
  | { type: 'MARK_AS_SAVED' }
  | { type: 'LOAD_DRAFT'; payload: { data: Partial<StudyWizardData>; currentStep: number } };

// الخطوات الافتراضية للمعالج
const defaultSteps: StudyWizardStep[] = [
  {
    id: 'executive-summary',
    title: 'الملخص التنفيذي',
    description: 'نظرة عامة شاملة عن المشروع وأهدافه',
    completed: false,
    valid: false,
  },
  {
    id: 'market-analysis',
    title: 'تحليل السوق',
    description: 'دراسة السوق المستهدف والمنافسين',
    completed: false,
    valid: false,
  },
  {
    id: 'financial-analysis',
    title: 'التحليل المالي',
    description: 'التوقعات المالية والعائد على الاستثمار',
    completed: false,
    valid: false,
  },
  {
    id: 'technical-analysis',
    title: 'التحليل التقني',
    description: 'المتطلبات التقنية والتشغيلية',
    completed: false,
    valid: false,
  },
  {
    id: 'risk-assessment',
    title: 'تقييم المخاطر',
    description: 'تحديد وتقييم المخاطر المحتملة',
    completed: false,
    valid: false,
  },
  {
    id: 'review',
    title: 'المراجعة النهائية',
    description: 'مراجعة جميع البيانات والإنهاء',
    completed: false,
    valid: false,
  },
];

// الحالة الافتراضية
function createInitialState(projectId?: string): StudyWizardState {
  return {
    projectId,
    currentStep: 0,
    steps: [],
    data: { 
      projectId: projectId || '',
      isDraft: true
    },
    isLoading: false,
    isSaving: false,
    hasUnsavedChanges: false,
    errors: {},
  };
}

// Reducer للمعالج
function studyWizardReducer(state: StudyWizardState, action: StudyWizardAction): StudyWizardState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.payload, state.steps.length - 1)),
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
      };

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };

    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_STEP_STATUS':
      const updatedSteps = [...state.steps];
      updatedSteps[action.payload.stepIndex] = {
        ...updatedSteps[action.payload.stepIndex],
        completed: action.payload.completed,
        valid: action.payload.valid,
      };
      return {
        ...state,
        steps: updatedSteps,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };

    case 'SET_UNSAVED_CHANGES':
      return { ...state, hasUnsavedChanges: action.payload };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.message },
      };

    case 'CLEAR_ERROR':
      const { [action.payload]: removed, ...remainingErrors } = state.errors;
      return { ...state, errors: remainingErrors };

    case 'CLEAR_ALL_ERRORS':
      return { ...state, errors: {} };

    case 'RESET_WIZARD':
      return createInitialState(action.payload.projectId);

    case 'MARK_AS_SAVED':
      return {
        ...state,
        hasUnsavedChanges: false,
        data: { ...state.data, lastSaved: new Date() },
      };

    case 'LOAD_DRAFT':
      return {
        ...state,
        data: { ...state.data, ...action.payload.data },
        currentStep: action.payload.currentStep || state.currentStep,
      };

    default:
      return state;
  }
}

// Context
interface StudyWizardContextValue {
  state: StudyWizardState;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<StudyWizardData>) => void;
  updateStepStatus: (stepIndex: number, completed: boolean, valid: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  saveDraft: () => Promise<void>;
  saveStudy: () => Promise<void>;
  loadStudy: (studyId: string) => Promise<void>;
  resetWizard: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isCurrentStepValid: boolean;
  completedStepsCount: number;
  totalSteps: number;
  progressPercentage: number;
}

const StudyWizardContext = createContext<StudyWizardContextValue | null>(null);

// Provider
interface StudyWizardProviderProps {
  children: ReactNode;
  projectId: string;
  initialStudyId?: string;
}

export function StudyWizardProvider({ children, projectId, initialStudyId }: StudyWizardProviderProps) {
  const [state, dispatch] = useReducer(studyWizardReducer, createInitialState(projectId));

  // Actions
  const setStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(state.data).length > 0) {
        saveDraft();
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(timer);
  }, [state.data]);

  const saveDraft = () => {
    try {
      const draftData = {
        data: state.data,
        currentStep: state.currentStep,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem('studyWizardDraft', JSON.stringify(draftData));
      console.log('Draft saved automatically');
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('studyWizardDraft');
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        dispatch({ type: 'LOAD_DRAFT', payload: draftData });
        console.log('Draft loaded from localStorage');
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem('studyWizardDraft');
      console.log('Draft cleared');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

  useEffect(() => {
    // Initialize default steps
    dispatch({ type: 'INITIALIZE_STEPS' });
    
    // Load saved draft from localStorage
    loadDraft();
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const updateData = useCallback((data: Partial<StudyWizardData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  }, []);

  const updateStepStatus = useCallback((stepIndex: number, completed: boolean, valid: boolean) => {
    dispatch({ type: 'UPDATE_STEP_STATUS', payload: { stepIndex, completed, valid } });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setSaving = useCallback((saving: boolean) => {
    dispatch({ type: 'SET_SAVING', payload: saving });
  }, []);

  const setError = useCallback((field: string, message: string) => {
    dispatch({ type: 'SET_ERROR', payload: { field, message } });
  }, []);

  const clearError = useCallback((field: string) => {
    dispatch({ type: 'CLEAR_ERROR', payload: field });
  }, []);

  const clearAllErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_ERRORS' });
  }, []);

  // API Functions
  const saveDraft = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const response = await fetch(`/api/projects/${projectId}/studies/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state.data, isDraft: true }),
      });

      if (!response.ok) throw new Error('فشل في حفظ المسودة');
      
      const result = await response.json();
      dispatch({ type: 'UPDATE_DATA', payload: { studyId: result.id } });
      dispatch({ type: 'MARK_AS_SAVED' });
    } catch (error) {
      setError('general', 'فشل في حفظ المسودة. يرجى المحاولة مرة أخرى.');
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [projectId, state.data, setError]);

  const saveStudy = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const endpoint = state.data.studyId 
        ? `/api/projects/${projectId}/studies/${state.data.studyId}`
        : `/api/projects/${projectId}/studies`;
      
      const response = await fetch(endpoint, {
        method: state.data.studyId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state.data, isDraft: false }),
      });

      if (!response.ok) throw new Error('فشل في حفظ دراسة الجدوى');
      
      const result = await response.json();
      dispatch({ type: 'UPDATE_DATA', payload: { studyId: result.id, isDraft: false } });
      dispatch({ type: 'MARK_AS_SAVED' });
    } catch (error) {
      setError('general', 'فشل في حفظ دراسة الجدوى. يرجى المحاولة مرة أخرى.');
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [projectId, state.data, setError]);

  const loadStudy = useCallback(async (studyId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch(`/api/projects/${projectId}/studies/${studyId}`);
      if (!response.ok) throw new Error('فشل في تحميل دراسة الجدوى');
      
      const study = await response.json();
      dispatch({ type: 'UPDATE_DATA', payload: study });
      
      // تحديث حالة الخطوات بناءً على البيانات المحملة
      state.steps.forEach((step, index) => {
        const hasData = Boolean(study[step.id]);
        updateStepStatus(index, hasData, hasData);
      });
    } catch (error) {
      setError('general', 'فشل في تحميل دراسة الجدوى.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [projectId, state.steps, updateStepStatus, setError]);

  const resetWizard = useCallback(() => {
    dispatch({ type: 'RESET_WIZARD', payload: { projectId } });
  }, [projectId]);

  // Computed values
  const canGoNext = state.currentStep < state.steps.length - 1;
  const canGoPrev = state.currentStep > 0;
  const isCurrentStepValid = state.steps[state.currentStep]?.valid || false;
  const completedStepsCount = state.steps.filter(step => step.completed).length;
  const totalSteps = state.steps.length;
  const progressPercentage = Math.round((completedStepsCount / totalSteps) * 100);

  // Auto-save effect (سيتم تطبيقه لاحقاً)
  // useEffect(() => {
  //   if (state.hasUnsavedChanges && !state.isSaving) {
  //     const timer = setTimeout(() => {
  //       saveDraft();
  //     }, 30000); // حفظ تلقائي كل 30 ثانية
  //     return () => clearTimeout(timer);
  //   }
  // }, [state.hasUnsavedChanges, state.isSaving, saveDraft]);

  const value: StudyWizardContextValue = {
    state,
    setStep,
    nextStep,
    prevStep,
    updateData,
    updateStepStatus,
    setLoading,
    setSaving,
    setError,
    clearError,
    clearAllErrors,
    saveDraft,
    saveStudy,
    loadStudy,
    resetWizard,
    canGoNext,
    canGoPrev,
    isCurrentStepValid,
    completedStepsCount,
    totalSteps,
    progressPercentage,
  };

  return (
    <StudyWizardContext.Provider value={value}>
      {children}
    </StudyWizardContext.Provider>
  );
}

// Hook لاستخدام Context
export function useStudyWizard() {
  const context = useContext(StudyWizardContext);
  if (!context) {
    throw new Error('useStudyWizard must be used within a StudyWizardProvider');
  }
  return context;
}

export default StudyWizardContext;
