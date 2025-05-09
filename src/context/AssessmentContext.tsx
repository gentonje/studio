
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
  areAllQuestionsInSectionAnswered: () => false, // Added default
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

  const getQuestionStatus = useCallback((questionId: string): 'answered' | 'skipped' | 'unanswered' => {
    const answer = answers[questionId];
    if (!answer || answer.value === null || answer.value === '') return 'unanswered';
    if (answer.value === 'N/A') return 'skipped'; 
    return 'answered';
  }, [answers]);

  const areAllQuestionsInSectionAnswered = useCallback((targetSectionId: string): boolean => {
    const sectionToCheck = assessmentData.sections.find(s => s.id === targetSectionId);
    if (!sectionToCheck) return false; // Should not happen if targetSectionId is valid

    for (const q of sectionToCheck.questions) {
      if (q.type === 'info_only') continue; // Info_only questions don't need an answer
      const status = getQuestionStatus(q.id);
      if (status === 'unanswered') {
        return false; // Found an unanswered question
      }
    }
    return true; // All answerable questions are answered or skipped
  }, [assessmentData.sections, getQuestionStatus]);

  const navigateToNextQuestion = useCallback(() => {
    const section = getCurrentSection();
    const currentQ = getCurrentQuestion();
    if (currentQ && currentQ.type !== 'info_only' && getQuestionStatus(currentQ.id) === 'unanswered') {
      toast({
        title: "Question Unanswered",
        description: "Please answer the current question before proceeding.",
        variant: "destructive",
      });
      return;
    }
    if (section && currentQuestionIndexInSection < section.questions.length - 1) {
      setCurrentQuestionIndexInSection(prev => prev + 1);
    }
  }, [currentQuestionIndexInSection, getCurrentSection, getCurrentQuestion, getQuestionStatus, toast]);

  const navigateToPrevQuestion = useCallback(() => {
    if (currentQuestionIndexInSection > 0) {
      setCurrentQuestionIndexInSection(prev => prev - 1);
    }
  }, [currentQuestionIndexInSection]);

  const navigateToNextSection = useCallback((): string | null => {
    const currentSect = getCurrentSection();
    if (currentSect && !areAllQuestionsInSectionAnswered(currentSect.id)) {
         toast({
            title: "Section Incomplete",
            description: `Please answer all questions in section "${currentSect.title}" before proceeding.`,
            variant: "destructive",
          });
        return currentSect.id; // Stay on current section
    }

    const currentIdx = assessmentData.sections.findIndex(s => s.id === currentSectionId);
    if (currentIdx !== -1 && currentIdx < assessmentData.sections.length - 1) {
      const nextSection = assessmentData.sections[currentIdx + 1];
      setCurrentSectionId(nextSection.id);
      setCurrentQuestionIndexInSection(0);
      router.push(`/assessment/${nextSection.id}`);
      return nextSection.id;
    }
    // If it's the last section, go to summary
    router.push('/assessment/summary');
    return null; 
  }, [assessmentData.sections, currentSectionId, router, getCurrentSection, areAllQuestionsInSectionAnswered, toast]);

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

  const calculateSectionScore = useCallback((sectionId: string) => {
    setAssessmentData(prevData => {
      const sectionIndex = prevData.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return prevData;
      
      const section = prevData.sections[sectionIndex];
      let totalPoints = 0;
      let applicableQuestions = 0;

      section.questions.forEach(q => {
        const answer = answers[q.id]; 
        if (q.type === 'info_only') return;

        if (answer && answer.value !== 'N/A' && answer.value !== null && answer.value !== '') {
          applicableQuestions++;
          const optionKey = answer.value as keyof HACTQuestion['options'];
          if (q.options && q.options[optionKey]) {
            totalPoints += q.options[optionKey]!.points;
          }
        } else if (!answer || answer.value === null || answer.value === '') {
          // If question is mandatory (not N/A by design and not info_only) it counts as applicable
          applicableQuestions++;
        }
      });
      
      let riskScore = 0; 
      let areaRiskRating: HACTSection['areaRiskRating'] = 'Low'; 

      const thresholds = section.scoringLogic.ratingThresholds;
      if (thresholds.length > 0) {
        const highestRiskThreshold = thresholds[thresholds.length - 1];
        riskScore = highestRiskThreshold.score; 
        areaRiskRating = highestRiskThreshold.rating;

        for (const threshold of thresholds) {
          if (threshold.maxPoints !== undefined && totalPoints <= threshold.maxPoints) {
            riskScore = threshold.score;
            areaRiskRating = threshold.rating;
            break; 
          }
          if (threshold.minPoints !== undefined && threshold.maxPoints === undefined && totalPoints >= threshold.minPoints) {
            riskScore = threshold.score;
            areaRiskRating = threshold.rating;
          }
        }
      }

      const currentSectionState = prevData.sections[sectionIndex];
      if (currentSectionState &&
          currentSectionState.totalRiskPoints === totalPoints &&
          currentSectionState.riskScore === riskScore &&
          currentSectionState.areaRiskRating === areaRiskRating &&
          currentSectionState.scoringLogic.totalApplicable === applicableQuestions) {
        return prevData;
      }

      const newSections = [...prevData.sections];
      newSections[sectionIndex] = { 
        ...section, 
        totalRiskPoints: totalPoints, 
        riskScore: riskScore, 
        areaRiskRating: areaRiskRating, 
        scoringLogic: {...section.scoringLogic, totalApplicable: applicableQuestions} 
      };
      
      return { ...prevData, sections: newSections };
    });
  }, [answers]); 

  const calculateOverallScore = useCallback(() => {
    setAssessmentData(prevData => {
      let overallTotalRiskPoints = 0;
      prevData.sections.forEach(section => {
        if (section.totalRiskPoints !== undefined) { 
          overallTotalRiskPoints += section.totalRiskPoints;
        }
      });
      
      let overallRiskRatingCalc: HACTAssessment['overallRiskRating'] = 'Low';
      if (overallTotalRiskPoints >= 61) { 
        overallRiskRatingCalc = 'High';
      } else if (overallTotalRiskPoints >= 41) { 
        overallRiskRatingCalc = 'Significant';
      } else if (overallTotalRiskPoints >= 21) { 
        overallRiskRatingCalc = 'Moderate';
      } else {
        overallRiskRatingCalc = 'Low';
      }
      
      const overallRiskScoreCalc = overallTotalRiskPoints; 

      if (
        prevData.overallTotalRiskPoints === overallTotalRiskPoints &&
        prevData.overallRiskScore === overallRiskScoreCalc &&
        prevData.overallRiskRating === overallRiskRatingCalc
      ) {
        return prevData;
      }

      return {
        ...prevData,
        overallTotalRiskPoints,
        overallRiskScore: overallRiskScoreCalc, 
        overallRiskRating: overallRiskRatingCalc,
      };
    });
  }, []); 

  const getRuleBasedRecommendation = useCallback((question: HACTQuestion, answer: Answer): string | null => {
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
    areAllQuestionsInSectionAnswered, // Added
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
};
