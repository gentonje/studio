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

const LOCAL_STORAGE_KEY = 'hactNavigatorState';

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
        // assessmentData is initialized from initialAssessmentData and then potentially updated with scores
        // For now, we'll just re-initialize it. If scores were persisted, this would need more logic.
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
        assessmentData, // Persisting full data including scores
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
    setAssessmentData(JSON.parse(JSON.stringify(data))); // Deep copy
    setCurrentSectionId(firstSectionId);
    setCurrentQuestionIndexInSection(0);
    setAnswers({}); // Reset answers
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
    // Last section, navigate to summary
    router.push('/assessment/summary');
    return null; 
  }, [assessmentData.sections, currentSectionId, router]);

  const navigateToPrevSection = useCallback((): string | null => {
    const currentIdx = assessmentData.sections.findIndex(s => s.id === currentSectionId);
    if (currentIdx > 0) {
      const prevSection = assessmentData.sections[currentIdx - 1];
      setCurrentSectionId(prevSection.id);
      setCurrentQuestionIndexInSection(prevSection.questions.length - 1); // Go to last question of prev section
      router.push(`/assessment/${prevSection.id}`);
      return prevSection.id;
    }
    // First section, cannot go back further with this logic
    toast({ title: "You are at the first section."});
    return null;
  }, [assessmentData.sections, currentSectionId, router, toast]);


  const getQuestionStatus = useCallback((questionId: string): 'answered' | 'skipped' | 'unanswered' => {
    const answer = answers[questionId];
    if (!answer) return 'unanswered';
    if (answer.value === 'N/A') return 'skipped'; // Or however you define skipped
    return 'answered';
  }, [answers]);

  const calculateSectionScore = useCallback((sectionId: string) => {
    // Basic scoring logic, can be expanded
    const section = assessmentData.sections.find(s => s.id === sectionId);
    if (!section) return;

    let totalPoints = 0;
    let applicableQuestions = 0;

    section.questions.forEach(q => {
      const answer = answers[q.id];
      if (answer && answer.value !== 'N/A') {
        applicableQuestions++;
        const optionKey = answer.value as keyof HACTQuestion['options'];
        if (q.options && q.options[optionKey]) {
          totalPoints += q.options[optionKey]!.points;
        }
      } else if (!answer && q.type !== 'info_only') {
        // Handle unanswered questions if needed, e.g. assign max points or specific penalty
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
            // Don't break, continue to check if higher thresholds are met
        }
    }
    // If totalPoints exceed all maxPoints, it might fall into the last category defined by minPoints
     if (section.scoringLogic.ratingThresholds.length > 0) {
        const lastThreshold = section.scoringLogic.ratingThresholds[section.scoringLogic.ratingThresholds.length - 1];
        if (lastThreshold.minPoints !== undefined && totalPoints >= lastThreshold.minPoints) {
            riskScore = lastThreshold.score;
            areaRiskRating = lastThreshold.rating;
        }
    }


    setAssessmentData(prevData => {
      const newSections = prevData.sections.map(s => 
        s.id === sectionId ? { ...s, totalRiskPoints: totalPoints, riskScore, areaRiskRating, scoringLogic: {...s.scoringLogic, totalApplicable: applicableQuestions} } : s
      );
      return { ...prevData, sections: newSections };
    });

  }, [answers, assessmentData.sections]);

  const calculateOverallScore = useCallback(() => {
    // Placeholder for overall score calculation
    let overallTotalRiskPoints = 0;
    assessmentData.sections.forEach(section => {
      if (section.totalRiskPoints) {
        overallTotalRiskPoints += section.totalRiskPoints;
      }
    });
    // This needs proper logic based on HACT guidelines for overall rating
    const overallRiskRating: HACTAssessment['overallRiskRating'] = overallTotalRiskPoints > 50 ? 'High' : overallTotalRiskPoints > 20 ? 'Moderate' : 'Low';
    
    setAssessmentData(prevData => ({
      ...prevData,
      overallTotalRiskPoints,
      // overallRiskScore and overallRiskRating need to be determined by HACT rules
      overallRiskScore: 0, // Placeholder
      overallRiskRating: overallRiskRating, // Placeholder
    }));
  }, [assessmentData.sections]);

  const getRuleBasedRecommendation = useCallback((question: HACTQuestion, answer: Answer): string | null => {
    // Example rule-based recommendation
    if (question.id === "1.1" && answer.value === "No") {
      return "The organization should ensure it is legally registered and compliant with all registration requirements. Provide documentation of legal status and registration date.";
    }
    // Add more rules here
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
