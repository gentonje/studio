
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
    setAssessmentData(prevData => {
      const section = prevData.sections.find(s => s.id === sectionId);
      if (!section) return prevData;

      let totalPoints = 0;
      let applicableQuestions = 0;

      section.questions.forEach(q => {
        const answer = answers[q.id]; 
        if (answer && answer.value !== 'N/A' && q.type !== 'info_only') {
          applicableQuestions++;
          const optionKey = answer.value as keyof HACTQuestion['options'];
          if (q.options && q.options[optionKey]) {
            totalPoints += q.options[optionKey]!.points;
          }
        } else if (!answer && q.type !== 'info_only') {
          // Unanswered actionable questions could be considered high risk by default,
          // but for scoring based on *provided* answers, they don't add points.
          // They will be highlighted as 'Not Answered' in the summary.
        }
      });
      
      let riskScore = 0;
      let areaRiskRating: HACTSection['areaRiskRating'] = 'Low'; // Default

      // Assuming ratingThresholds are ordered from lowest risk (lowest points) to highest risk.
      // The last threshold might be defined by minPoints for "High" risk.
      if (section.scoringLogic.ratingThresholds.length > 0) {
        // Default to the highest risk category defined if no lower bands are met
        const highestRiskThreshold = section.scoringLogic.ratingThresholds[section.scoringLogic.ratingThresholds.length - 1];
        riskScore = highestRiskThreshold.score;
        areaRiskRating = highestRiskThreshold.rating;

        for (const threshold of section.scoringLogic.ratingThresholds) {
          if (threshold.maxPoints !== undefined && totalPoints <= threshold.maxPoints) {
            riskScore = threshold.score;
            areaRiskRating = threshold.rating;
            break; // Found the correct band, exit
          }
          // If a threshold is defined by minPoints (e.g. for "High"), 
          // and we haven't broken from a maxPoints match, this implies totalPoints is above previous maxPoints.
          // This will correctly catch the "High" category if it's defined with minPoints and is the last one.
          if (threshold.minPoints !== undefined && totalPoints >= threshold.minPoints) {
             // This condition primarily serves to confirm the rating if points fall into an open-ended high category
            riskScore = threshold.score;
            areaRiskRating = threshold.rating;
            // Do not break here if thresholds are structured such that a minPoints threshold might precede a more specific maxPoints one.
            // However, for typical HACT (Low, Mod, Sig defined by maxPoints, High by minPoints), this order is fine.
          }
        }
      }


      const currentSectionState = prevData.sections.find(s => s.id === sectionId);
      if (currentSectionState &&
          currentSectionState.totalRiskPoints === totalPoints &&
          currentSectionState.riskScore === riskScore &&
          currentSectionState.areaRiskRating === areaRiskRating &&
          currentSectionState.scoringLogic.totalApplicable === applicableQuestions) {
        return prevData; 
      }

      const newSections = prevData.sections.map(s => 
        s.id === sectionId ? { ...s, totalRiskPoints: totalPoints, riskScore, areaRiskRating, scoringLogic: {...s.scoringLogic, totalApplicable: applicableQuestions} } : s
      );
      return { ...prevData, sections: newSections };
    });
  }, [answers]); 

  const calculateOverallScore = useCallback(() => {
    setAssessmentData(prevData => {
      let overallTotalRiskPoints = 0;
      prevData.sections.forEach(section => {
        if (section.totalRiskPoints !== undefined) { // Ensure points are calculated
          overallTotalRiskPoints += section.totalRiskPoints;
        }
      });
      
      // Define overall risk rating based on HACT common practice or specific guidelines for micro-assessment.
      // Example thresholds (these should be validated against HACT guidelines):
      let overallRiskRatingCalc: HACTAssessment['overallRiskRating'] = 'Low';
      if (overallTotalRiskPoints >= 101) { // Example: Derived from a sum of section max points leading to "High"
        overallRiskRatingCalc = 'High';
      } else if (overallTotalRiskPoints >= 51) { // Example
        overallRiskRatingCalc = 'Significant';
      } else if (overallTotalRiskPoints >= 21) { // Example
        overallRiskRatingCalc = 'Moderate';
      } else {
        overallRiskRatingCalc = 'Low';
      }
      
      // Overall Risk Score might be an average or weighted score, or simply not applicable / same as points.
      // For now, let's keep it simple or as a placeholder if specific logic isn't defined.
      const overallRiskScoreCalc = 0; // Placeholder: Actual calculation method needs definition if it's not just total points.

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
