"use client";

import { useContext } from 'react';
import { AssessmentContext } from '@/context/AssessmentContext';
import type { AssessmentContextState } from '@/types';

export const useAssessment = (): AssessmentContextState => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
