
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { AssessmentContextState, HACTAssessment, Answer, AnswersState, HACTSection, HACTQuestion } from '@/types';
import { initialAssessmentData } from '@/lib/assessmentData'; // Default data
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const defaultState: AssessmentContextState = {
  organizationName: null,
  currentSectionId: null,
  currentQuestionIndexInSection: 0,
  answers: {},
  assessmentData: JSON.parse(JSON.stringify(initialAssessmentData)), // Deep copy
  setOrganizationName: () => {},
  startAssessment: () => {},
  answerQuestion: () => {},
  navigateToNextQuestion: () => {},
  navigateToPrevQuestion: () => {},
  navigateToNextSection: () => null,
  navigateToPrevSection: () => null,
  getCurrentSection: () => undefined,
  getCurrentQuestion: () => undefined,
  getQuestionStatus: () => 'unanswered',
  calculateSectionScore: () => {},
  calculateOverallScore: () => {},
  getRuleBasedRecommendation: () => null,
  resetAssessment: () => {},
};

export const AssessmentContext = createContext<AssessmentContextState>(defaultState);

interface AssessmentProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = 'hactState';

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  const [organizationName, setOrganizationNameState] = useState<string | null>(defaultState.organizationName);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(defaultState.currentSectionId);
  const [currentQuestionIndexInSection, setCurrentQuestionIndexInSection] = useState<number>(defaultState.currentQuestionIndexInSection);
  const [answers, setAnswers] = useState<AnswersState>(defaultState.answers);
  const [assessmentData, setAssessmentData] = useState<HACTAssessment>(JSON.parse(JSON.stringify(initialAssessmentData)));
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setOrganizationNameState(parsedState.organizationName || null);
        setCurrentSectionId(parsedState.currentSectionId || null);
        setCurrentQuestionIndexInSection(parsedState.currentQuestionIndexInSection || 0);
        setAnswers(parsedState.answers || {});
        setAssessmentData(parsedState.assessmentData || JSON.parse(JSON.stringify(initialAssessmentData)));
      }
    } catch (error) {
      console.error("Failed to load state from local storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      const stateToSave = {
        organizationName,
        currentSectionId,
        currentQuestionIndexInSection,
        answers,
        assessmentData, 
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to local storage:", error);
    }
  }, [organizationName, currentSectionId, currentQuestionIndexInSection, answers, assessmentData]);


  const setOrganizationName = useCallback((name: string) => {
    setOrganizationNameState(name);
  }, []);

  const startAssessment = useCallback((data: HACTAssessment, firstSectionId: string) => {
    setAssessmentData(JSON.parse(JSON.stringify(data))); 
    setCurrentSectionId(firstSectionId);
    setCurrentQuestionIndexInSection(0);
    setAnswers({}); 
    router.push(`/assessment/${firstSectionId}`);
  }, [router]);
  
  const resetAssessment = useCallback(() => {
    setOrganizationNameState(null);
    setCurrentSectionId(null);
    setCurrentQuestionIndexInSection(0);
    setAnswers({});
    setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData)));
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    router.push('/');
  }, [router]);

  const getCurrentSection = useCallback((): HACTSection | undefined => {
    return assessmentData.sections.find(s => s.id === currentSectionId);
  }, [assessmentData.sections, currentSectionId]);

  const getCurrentQuestion = useCallback((): HACTQuestion | undefined => {
    const section = getCurrentSection();
    return section?.questions[currentQuestionIndexInSection];
  }, [getCurrentSection, currentQuestionIndexInSection]);

  const answerQuestion = useCallback((questionId: string, value: Answer['value'], explanation?: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: { questionId, value, explanation },
    }));
  }, []);

  const navigateToNextQuestion = useCallback(() => {
    const section = getCurrentSection();
    if (section && currentQuestionIndexInSection < section.questions.length - 1) {
      setCurrentQuestionIndexInSection(prev => prev + 1);
    }
  }, [currentQuestionIndexInSection, getCurrentSection]);

  const navigateToPrevQuestion = useCallback(() => {
    if (currentQuestionIndexInSection > 0) {
      setCurrentQuestionIndexInSection(prev => prev - 1);
    }
  }, [currentQuestionIndexInSection]);

  const navigateToNextSection = useCallback((): string | null => {
    const currentIdx = assessmentData.sections.findIndex(s => s.id === currentSectionId);
    if (currentIdx !== -1 && currentIdx < assessmentData.sections.length - 1) {
      const nextSection = assessmentData.sections[currentIdx + 1];
      setCurrentSectionId(nextSection.id);
      setCurrentQuestionIndexInSection(0);
      router.push(`/assessment/${nextSection.id}`);
      return nextSection.id;
    }
    router.push('/assessment/summary');
    return null; 
  }, [assessmentData.sections, currentSectionId, router]);

  const navigateToPrevSection = useCallback((): string | null => {
    const currentIdx = assessmentData.sections.findIndex(s => s.id === currentSectionId);
    if (currentIdx > 0) {
      const prevSection = assessmentData.sections[currentIdx - 1];
      setCurrentSectionId(prevSection.id);
      setCurrentQuestionIndexInSection(prevSection.questions.length - 1); 
      router.push(`/assessment/${prevSection.id}`);
      return prevSection.id;
    }
    toast({ title: "You are at the first section."});
    return null;
  }, [assessmentData.sections, currentSectionId, router, toast]);


  const getQuestionStatus = useCallback((questionId: string): 'answered' | 'skipped' | 'unanswered' => {
    const answer = answers[questionId];
    if (!answer) return 'unanswered';
    if (answer.value === 'N/A') return 'skipped'; 
    return 'answered';
  }, [answers]);

  const calculateSectionScore = useCallback((sectionId: string) => {
    // `answers` is from the closure of this useCallback. It will be fresh if `answers` state changes,
    // because this function instance will be re-created.
    setAssessmentData(prevData => {
      const section = prevData.sections.find(s => s.id === sectionId);
      if (!section) return prevData;

      let totalPoints = 0;
      let applicableQuestions = 0;

      section.questions.forEach(q => {
        const answer = answers[q.id]; // Using `answers` from the useCallback's closure
        if (answer && answer.value !== 'N/A') {
          applicableQuestions++;
          const optionKey = answer.value as keyof HACTQuestion['options'];
          if (q.options && q.options[optionKey]) {
            totalPoints += q.options[optionKey]!.points;
          }
        } else if (!answer && q.type !== 'info_only') {
          // Handle unanswered questions if needed
        }
      });
      
      let riskScore = 0;
      let areaRiskRating: HACTSection['areaRiskRating'] = 'Low';

      for (const threshold of section.scoringLogic.ratingThresholds) {
          if (threshold.maxPoints !== undefined && totalPoints <= threshold.maxPoints) {
              riskScore = threshold.score;
              areaRiskRating = threshold.rating;
              break;
          }
          if (threshold.minPoints !== undefined && totalPoints >= threshold.minPoints) {
              riskScore = threshold.score;
              areaRiskRating = threshold.rating;
          }
      }
      if (section.scoringLogic.ratingThresholds.length > 0) {
          const lastThreshold = section.scoringLogic.ratingThresholds[section.scoringLogic.ratingThresholds.length - 1];
          if (lastThreshold.minPoints !== undefined && totalPoints >= lastThreshold.minPoints) {
              riskScore = lastThreshold.score;
              areaRiskRating = lastThreshold.rating;
          }
      }

      const currentSectionState = prevData.sections.find(s => s.id === sectionId);
      if (currentSectionState &&
          currentSectionState.totalRiskPoints === totalPoints &&
          currentSectionState.riskScore === riskScore &&
          currentSectionState.areaRiskRating === areaRiskRating &&
          currentSectionState.scoringLogic.totalApplicable === applicableQuestions) {
        return prevData; // No actual change in this section's score, prevent re-render
      }

      const newSections = prevData.sections.map(s => 
        s.id === sectionId ? { ...s, totalRiskPoints: totalPoints, riskScore, areaRiskRating, scoringLogic: {...s.scoringLogic, totalApplicable: applicableQuestions} } : s
      );
      return { ...prevData, sections: newSections };
    });
  }, [answers]); // Depends only on `answers`. `setAssessmentData` is stable.

  const calculateOverallScore = useCallback(() => {
    // This function now uses the functional update form of setAssessmentData to ensure it reads the latest state
    // if it were to be called in a context where assessmentData from the outer scope might be stale.
    // However, its current direct usage of assessmentData.sections from the outer scope is fine
    // as long as this function is re-created when assessmentData.sections changes IF it were a dependency.
    // For now, let's make it use the functional update to be safer and more consistent.
    setAssessmentData(prevData => {
      let overallTotalRiskPoints = 0;
      prevData.sections.forEach(section => {
        if (section.totalRiskPoints) {
          overallTotalRiskPoints += section.totalRiskPoints;
        }
      });
      
      const overallRiskRating: HACTAssessment['overallRiskRating'] = overallTotalRiskPoints > 50 ? 'High' : overallTotalRiskPoints > 20 ? 'Moderate' : 'Low';
      
      // Placeholder for overallRiskScore, this needs to be defined by HACT rules
      const overallRiskScore = 0; 

      if (
        prevData.overallTotalRiskPoints === overallTotalRiskPoints &&
        prevData.overallRiskScore === overallRiskScore &&
        prevData.overallRiskRating === overallRiskRating
      ) {
        return prevData;
      }

      return {
        ...prevData,
        overallTotalRiskPoints,
        overallRiskScore: overallRiskScore, 
        overallRiskRating: overallRiskRating,
      };
    });
  }, []); // No dependencies needed if it always calculates from scratch based on prevData.

  const getRuleBasedRecommendation = useCallback((question: HACTQuestion, answer: Answer): string | null => {
    if (question.id === "1.1" && answer.value === "No") {
      return "The organization should ensure it is legally registered and compliant with all registration requirements. Provide documentation of legal status and registration date.";
    }
    return null;
  }, []);


  const value: AssessmentContextState = {
    organizationName,
    currentSectionId,
    currentQuestionIndexInSection,
    answers,
    assessmentData,
    setOrganizationName,
    startAssessment,
    answerQuestion,
    navigateToNextQuestion,
    navigateToPrevQuestion,
    navigateToNextSection,
    navigateToPrevSection,
    getCurrentSection,
    getCurrentQuestion,
    getQuestionStatus,
    calculateSectionScore,
    calculateOverallScore,
    getRuleBasedRecommendation,
    resetAssessment,
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
};

