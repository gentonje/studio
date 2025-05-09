
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
  areAllQuestionsInSectionAnswered: () => false,
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
        // Ensure assessmentData loaded from storage is deeply compared or re-initialized if structure changed
        const loadedAssessmentData = parsedState.assessmentData || JSON.parse(JSON.stringify(initialAssessmentData));
        // A simple check: if loaded data has fewer sections than initial, it might be old.
        if (loadedAssessmentData.sections.length < initialAssessmentData.sections.length) {
             setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData)));
        } else {
            setAssessmentData(loadedAssessmentData);
        }
      } else {
        // If no saved state, ensure initialAssessmentData is used.
        setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData)));
      }
    } catch (error) {
      console.error("Failed to load state from local storage:", error);
      setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData))); // Fallback to initial data on error
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
    const freshAssessmentData = JSON.parse(JSON.stringify(data)); // Use a deep copy of the provided data
    setAssessmentData(freshAssessmentData); 
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
    setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData))); // Reset with fresh initial data
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
    // N/A is a valid answer for some questions and means it's "answered" or "skipped" from a completion PoV
    // but it means the question is not applicable for scoring.
    if (answer.value === 'N/A') return 'skipped'; 
    return 'answered';
  }, [answers]);

  const areAllQuestionsInSectionAnswered = useCallback((targetSectionId: string): boolean => {
    const sectionToCheck = assessmentData.sections.find(s => s.id === targetSectionId);
    if (!sectionToCheck) return false;

    for (const q of sectionToCheck.questions) {
      if (q.type === 'info_only') continue; 
      const status = getQuestionStatus(q.id);
      // "Skipped" (answered as N/A) is considered complete for navigation.
      // The critical part is that an actual selection (Yes, No, or N/A if available) was made.
      if (status === 'unanswered') {
        return false;
      }
    }
    return true;
  }, [assessmentData.sections, getQuestionStatus]);

  const navigateToNextQuestion = useCallback(() => {
    const section = getCurrentSection();
    const currentQ = getCurrentQuestion();

    if (currentQ && currentQ.type !== 'info_only') {
        // Check if an answer has been provided.
        // N/A is a valid answer if the question supports it.
        const status = getQuestionStatus(currentQ.id);
        if (status === 'unanswered') {
             toast({
                title: "Question Unanswered",
                description: "Please select an answer for the current question before proceeding.",
                variant: "destructive",
            });
            return;
        }
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
        return currentSect.id; 
    }

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
  }, [assessmentData.sections, currentSectionId, router, getCurrentSection, areAllQuestionsInSectionAnswered, toast]);

  const navigateToPrevSection = useCallback((): string | null => {
    const currentIdx = assessmentData.sections.findIndex(s => s.id === currentSectionId);
    if (currentIdx > 0) {
      const prevSection = assessmentData.sections[currentIdx - 1];
      setCurrentSectionId(prevSection.id);
      // Navigate to the last question of the previous section
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
      let actualApplicableQuestionsCount = 0; // Count questions that received a scoreable answer (not N/A)

      section.questions.forEach(q => {
        const answer = answers[q.id]; 
        if (q.type === 'info_only') return;

        if (answer && answer.value !== null && answer.value !== '') {
            if (answer.value === 'N/A') {
                // N/A answers contribute 0 points and don't count towards actualApplicableQuestionsCount for avg calculation
            } else {
                actualApplicableQuestionsCount++;
                const optionKey = answer.value as keyof HACTQuestion['options'];
                if (q.options && q.options[optionKey]) {
                    totalPoints += q.options[optionKey]!.points;
                }
            }
        } else {
           // Unanswered questions are considered applicable for risk calculation based on HACT doc structure
           // but for average scoring, we might only count those answered.
           // The HACT document's "total applicable questions in subject area" is a fixed number.
           // We will use section.scoringLogic.totalApplicableQuestions as the denominator.
        }
      });
      
      const denominator = section.scoringLogic.totalApplicableQuestions > 0 ? section.scoringLogic.totalApplicableQuestions : 1;
      const averageRiskScore = actualApplicableQuestionsCount > 0 ? totalPoints / actualApplicableQuestionsCount : 0; // If no scoreable answers, avg is 0. Or use totalApplicableQuestions as denominator always?
                                                                                                                // Using section.scoringLogic.totalApplicableQuestions as per HACT example
      const averageScoreForRating = totalPoints / denominator;


      let numericRiskScoreCalc: HACTSection['numericRiskScore'] = 1; 
      let areaRiskRatingCalc: HACTSection['areaRiskRating'] = 'Low'; 

      const thresholds = section.scoringLogic.ratingThresholds;
      // Sort thresholds by score to ensure correct matching
      const sortedThresholds = [...thresholds].sort((a, b) => (a.maxAverageScore ?? Infinity) - (b.maxAverageScore ?? Infinity));
      
      for (const threshold of sortedThresholds) {
        if (threshold.maxAverageScore !== undefined && averageScoreForRating <= threshold.maxAverageScore) {
          numericRiskScoreCalc = threshold.numericScore;
          areaRiskRatingCalc = threshold.rating;
          break; 
        }
        if (threshold.minAverageScore !== undefined && averageScoreForRating >= threshold.minAverageScore) {
          // This handles the "High" category which might only have a minAverageScore
          numericRiskScoreCalc = threshold.numericScore;
          areaRiskRatingCalc = threshold.rating;
        }
      }
      // Ensure High risk is caught if score exceeds all maxes
      if (sortedThresholds.length > 0) {
          const highestThreshold = sortedThresholds[sortedThresholds.length -1];
          if(highestThreshold.minAverageScore !== undefined && averageScoreForRating >= highestThreshold.minAverageScore) {
            numericRiskScoreCalc = highestThreshold.numericScore;
            areaRiskRatingCalc = highestThreshold.rating;
          } else if (highestThreshold.maxAverageScore === undefined && averageScoreForRating > (sortedThresholds[sortedThresholds.length-2]?.maxAverageScore ?? 0) ) {
            // Handles case where last item is high risk defined by min only
            numericRiskScoreCalc = highestThreshold.numericScore;
            areaRiskRatingCalc = highestThreshold.rating;
          }
      }


      const currentSectionState = prevData.sections[sectionIndex];
      if (currentSectionState &&
          currentSectionState.totalRiskPoints === totalPoints &&
          currentSectionState.averageRiskScore === averageScoreForRating &&
          currentSectionState.numericRiskScore === numericRiskScoreCalc &&
          currentSectionState.areaRiskRating === areaRiskRatingCalc) {
        return prevData; // No change
      }

      const newSections = [...prevData.sections];
      newSections[sectionIndex] = { 
        ...section, 
        totalRiskPoints: totalPoints, 
        averageRiskScore: averageScoreForRating,
        numericRiskScore: numericRiskScoreCalc, 
        areaRiskRating: areaRiskRatingCalc,
      };
      
      return { ...prevData, sections: newSections };
    });
  }, [answers]); 

  const calculateOverallScore = useCallback(() => {
    setAssessmentData(prevData => {
      let overallTotalRiskPoints = 0;
      let totalApplicableQuestionsOverall = 0;

      prevData.sections.forEach(section => {
        if (section.totalRiskPoints !== undefined) { 
          overallTotalRiskPoints += section.totalRiskPoints;
        }
        totalApplicableQuestionsOverall += section.scoringLogic.totalApplicableQuestions;
      });
      
      const overallAverageRiskScoreCalc = totalApplicableQuestionsOverall > 0 ? overallTotalRiskPoints / totalApplicableQuestionsOverall : 0;
      
      let overallNumericRiskScoreCalc: HACTAssessment['overallNumericRiskScore'] = 1;
      let overallRiskRatingCalc: HACTAssessment['overallRiskRating'] = 'Low';
      const overallThresholds = prevData.overallRatingThresholds || initialAssessmentData.overallRatingThresholds || [];
      
      const sortedOverallThresholds = [...overallThresholds].sort((a, b) => (a.maxAverageScore ?? Infinity) - (b.maxAverageScore ?? Infinity));

      for (const threshold of sortedOverallThresholds) {
        if (threshold.maxAverageScore !== undefined && overallAverageRiskScoreCalc <= threshold.maxAverageScore) {
          overallNumericRiskScoreCalc = threshold.numericScore;
          overallRiskRatingCalc = threshold.rating;
          break;
        }
        if (threshold.minAverageScore !== undefined && overallAverageRiskScoreCalc >= threshold.minAverageScore) {
          overallNumericRiskScoreCalc = threshold.numericScore;
          overallRiskRatingCalc = threshold.rating;
        }
      }
        // Ensure High risk is caught if score exceeds all maxes
      if (sortedOverallThresholds.length > 0) {
          const highestThreshold = sortedOverallThresholds[sortedOverallThresholds.length -1];
          if(highestThreshold.minAverageScore !== undefined && overallAverageRiskScoreCalc >= highestThreshold.minAverageScore) {
            overallNumericRiskScoreCalc = highestThreshold.numericScore;
            overallRiskRatingCalc = highestThreshold.rating;
          } else if (highestThreshold.maxAverageScore === undefined && overallAverageRiskScoreCalc > (sortedOverallThresholds[sortedOverallThresholds.length-2]?.maxAverageScore ?? 0) ) {
             overallNumericRiskScoreCalc = highestThreshold.numericScore;
             overallRiskRatingCalc = highestThreshold.rating;
          }
      }


      if (
        prevData.overallTotalRiskPoints === overallTotalRiskPoints &&
        prevData.overallAverageRiskScore === overallAverageRiskScoreCalc &&
        prevData.overallNumericRiskScore === overallNumericRiskScoreCalc &&
        prevData.overallRiskRating === overallRiskRatingCalc
      ) {
        return prevData; // No change
      }

      return {
        ...prevData,
        overallTotalRiskPoints,
        overallAverageRiskScore: overallAverageRiskScoreCalc, 
        overallNumericRiskScore: overallNumericRiskScoreCalc,
        overallRiskRating: overallRiskRatingCalc,
      };
    });
  }, []); 

  const getRuleBasedRecommendation = useCallback((question: HACTQuestion, answer: Answer): string | null => {
    // This function can be expanded based on specific rules.
    // For now, refers to external static recommendations.
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
    areAllQuestionsInSectionAnswered,
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
};

