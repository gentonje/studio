

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
      // Potentially reset to default if state is corrupted
      // setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData)));
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
      // Go to the last question of the previous section
      setCurrentQuestionIndexInSection(prevSection.questions.length - 1); 
      router.push(`/assessment/${prevSection.id}`);
      return prevSection.id;
    }
    toast({ title: "You are at the first section."});
    return null;
  }, [assessmentData.sections, currentSectionId, router, toast]);


  const getQuestionStatus = useCallback((questionId: string): 'answered' | 'skipped' | 'unanswered' => {
    const answer = answers[questionId];
    if (!answer || answer.value === null) return 'unanswered'; // Check for null value explicitly
    if (answer.value === 'N/A') return 'skipped'; 
    return 'answered';
  }, [answers]);

  const calculateSectionScore = useCallback((sectionId: string) => {
    setAssessmentData(prevData => {
      const sectionIndex = prevData.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return prevData;
      
      const section = prevData.sections[sectionIndex];
      let totalPoints = 0;
      let applicableQuestions = 0;

      section.questions.forEach(q => {
        const answer = answers[q.id]; 
        if (q.type === 'info_only') return; // Skip info_only questions for scoring

        if (answer && answer.value !== 'N/A' && answer.value !== null) {
          applicableQuestions++;
          const optionKey = answer.value as keyof HACTQuestion['options'];
          if (q.options && q.options[optionKey]) {
            totalPoints += q.options[optionKey]!.points;
          }
        } else if (!answer || answer.value === null) {
          // For unanswered questions that are not N/A and not info_only,
          // HACT guidelines often treat them as high risk for overall assessment,
          // but for section scoring based on *provided* answers, they don't add points.
          // We can count them as applicable if they *should* have been answered.
          applicableQuestions++; // Count as applicable if not N/A by design
        }
      });
      
      let riskScore = 0; // This is the numerical score (1-4) for the rating
      let areaRiskRating: HACTSection['areaRiskRating'] = 'Low'; // Default text rating

      const thresholds = section.scoringLogic.ratingThresholds;
      if (thresholds.length > 0) {
        // Default to the highest risk category if no lower bands are met
        // Sort thresholds by score descending to pick highest applicable. More robust if thresholds overlap.
        // However, HACT usually has distinct bands. Let's assume thresholds are ordered Low to High.
        const highestRiskThreshold = thresholds[thresholds.length - 1];
        riskScore = highestRiskThreshold.score; 
        areaRiskRating = highestRiskThreshold.rating;

        for (const threshold of thresholds) {
          if (threshold.maxPoints !== undefined && totalPoints <= threshold.maxPoints) {
            riskScore = threshold.score;
            areaRiskRating = threshold.rating;
            break; 
          }
          // If only minPoints is defined (usually for High) and we haven't broken, it applies
          if (threshold.minPoints !== undefined && threshold.maxPoints === undefined && totalPoints >= threshold.minPoints) {
            riskScore = threshold.score;
            areaRiskRating = threshold.rating;
            // Don't break, allow a more specific maxPoints later in a poorly ordered list
          }
        }
      }


      const currentSectionState = prevData.sections[sectionIndex];
      if (currentSectionState &&
          currentSectionState.totalRiskPoints === totalPoints &&
          currentSectionState.riskScore === riskScore &&
          currentSectionState.areaRiskRating === areaRiskRating &&
          currentSectionState.scoringLogic.totalApplicable === applicableQuestions) {
        return prevData; // No change
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
      
      // Example overall thresholds based on total points sum. These should be calibrated.
      // Assuming more questions now, so thresholds are higher.
      let overallRiskRatingCalc: HACTAssessment['overallRiskRating'] = 'Low';
      if (overallTotalRiskPoints >= 61) { // Adjusted example for more questions
        overallRiskRatingCalc = 'High';
      } else if (overallTotalRiskPoints >= 41) { // Adjusted example
        overallRiskRatingCalc = 'Significant';
      } else if (overallTotalRiskPoints >= 21) { // Adjusted example
        overallRiskRatingCalc = 'Moderate';
      } else {
        overallRiskRatingCalc = 'Low';
      }
      
      // The overall risk score in HACT can be complex (e.g. weighted average of section scores, or just the rating)
      // For simplicity here, we'll use the total points as the "score" that determines the rating.
      const overallRiskScoreCalc = overallTotalRiskPoints; 

      if (
        prevData.overallTotalRiskPoints === overallTotalRiskPoints &&
        prevData.overallRiskScore === overallRiskScoreCalc &&
        prevData.overallRiskRating === overallRiskRatingCalc
      ) {
        return prevData; // No change
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
    // This function is now supplemented by the more detailed static recommendations in lib/recommendations.ts
    // It can be kept for very specific, simple overrides if needed, or deprecated.
    // For now, defer to the lib/recommendations.ts which is called directly in SummaryPage.
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


    