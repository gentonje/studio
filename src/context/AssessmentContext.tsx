
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
        
        const loadedAssessmentData = parsedState.assessmentData || JSON.parse(JSON.stringify(initialAssessmentData));
        // Basic validation: check if sections exist and match somewhat with initial data structure
        if (loadedAssessmentData.sections && loadedAssessmentData.sections.length > 0 && 
            initialAssessmentData.sections.every(initSection => 
                loadedAssessmentData.sections.find((loadedSection: HACTSection) => loadedSection.id === initSection.id)
            )
        ) {
            // If structure seems fine, merge answers into potentially updated question structures
            const mergedAssessmentData = JSON.parse(JSON.stringify(initialAssessmentData)); // Start with fresh template
            mergedAssessmentData.sections.forEach((section: HACTSection) => {
                const loadedSection = loadedAssessmentData.sections.find((ls: HACTSection) => ls.id === section.id);
                if (loadedSection) {
                    section.totalRiskPoints = loadedSection.totalRiskPoints;
                    section.averageRiskScore = loadedSection.averageRiskScore;
                    section.numericRiskScore = loadedSection.numericRiskScore;
                    section.areaRiskRating = loadedSection.areaRiskRating;
                }
            });
            mergedAssessmentData.overallTotalRiskPoints = loadedAssessmentData.overallTotalRiskPoints;
            mergedAssessmentData.overallAverageRiskScore = loadedAssessmentData.overallAverageRiskScore;
            mergedAssessmentData.overallNumericRiskScore = loadedAssessmentData.overallNumericRiskScore;
            mergedAssessmentData.overallRiskRating = loadedAssessmentData.overallRiskRating;

            setAssessmentData(mergedAssessmentData);
        } else {
            setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData)));
        }

      } else {
        setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData)));
      }
    } catch (error) {
      console.error("Failed to load state from local storage:", error);
      setAssessmentData(JSON.parse(JSON.stringify(initialAssessmentData))); 
    }
  }, []); // Load once on mount

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
    const freshAssessmentData = JSON.parse(JSON.stringify(data)); 
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

 const getQuestionStatus = useCallback((questionId: string): 'answered' | 'unanswered' => {
    const answer = answers[questionId];
    const question = assessmentData.sections.flatMap(s => s.questions).find(q => q.id === questionId);

    if (!answer || answer.value === null || answer.value === '') {
        return 'unanswered';
    }
    
    // For 'yes_no_na', 'N/A' is a valid answer.
    if (question?.type === 'yes_no_na' && answer.value === 'N/A') {
        return 'answered'; 
    }
    
    // For 'yes_no_explain' and 'yes_no_multi_explain', if 'Yes' or 'No' is selected, it's answered
    // The explanation part might be optional for just being 'answered' from a navigation perspective,
    // but could be mandatory for proceeding based on specific question logic.
    // For now, if a value is selected (Yes/No), it's considered answered.
    if ((question?.type === 'yes_no_explain' || question?.type === 'yes_no_multi_explain') && (answer.value === 'Yes' || answer.value === 'No')) {
        return 'answered';
    }

    // For text_input, any non-empty string means it's answered.
    if (question?.type === 'text_input' && typeof answer.value === 'string' && answer.value.trim() !== '') {
        return 'answered';
    }
    
    // If it's not 'info_only' and has a value that's not just an empty string (for text inputs that might default to ""), it's answered.
    if (question?.type !== 'info_only' && answer.value !== null && (typeof answer.value !== 'string' || answer.value.trim() !== '')) {
        return 'answered';
    }
    
    return 'unanswered';
  }, [answers, assessmentData.sections]);

  const areAllQuestionsInSectionAnswered = useCallback((targetSectionId: string): boolean => {
    const sectionToCheck = assessmentData.sections.find(s => s.id === targetSectionId);
    if (!sectionToCheck) return false;

    for (const q of sectionToCheck.questions) {
      if (q.type === 'info_only') continue; 
      const status = getQuestionStatus(q.id);
      if (status === 'unanswered') {
        toast({
          title: "Question Unanswered",
          description: `Please answer question ${q.id} ("${q.text.substring(0, 50)}...") in section "${sectionToCheck.title}" to proceed.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  }, [assessmentData.sections, getQuestionStatus, toast]);

  const navigateToNextQuestion = useCallback(() => {
    const section = getCurrentSection();
    const currentQ = getCurrentQuestion();

    if (currentQ && currentQ.type !== 'info_only') {
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
        // Toast is handled by areAllQuestionsInSectionAnswered now
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
    // If it's the last section, navigate to summary
    if (currentIdx === assessmentData.sections.length - 1) {
        router.push('/assessment/summary');
        return null; // Indicates navigation to summary
    }
    
    // Fallback if something unexpected happens
    toast({ title: "Navigation Error", description: "Could not determine next section."});
    return currentSectionId; 
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
      let questionsAnsweredForScoring = 0; 

      section.questions.forEach(q => {
        const answer = answers[q.id]; 
        if (q.type === 'info_only') return;

        if (answer && answer.value !== null && answer.value !== '') {
            if (answer.value === 'N/A' && q.options?.['N/A']) {
                totalPoints += q.options['N/A'].points; // N/A option usually has 0 points
                // N/A answers are typically excluded from the average calculation denominator
                // if the denominator is dynamic (questionsContributingToAverage).
                // For HACT's fixed "totalApplicableQuestions", they are included.
            } else {
                const optionKey = answer.value as keyof HACTQuestion['options'];
                if (q.options && q.options[optionKey]) {
                    totalPoints += q.options[optionKey]!.points;
                    questionsAnsweredForScoring++;
                }
            }
        } else {
           // HACT: Unanswered non-N/A questions usually take points of the highest risk option (e.g., "No").
           // This logic should ideally only apply at the *final* calculation, not during answering.
           // For live feedback during assessment, it might be too punitive.
           // Let's assume for now, if not answered, it doesn't contribute to points *until summary*.
           // However, the `totalApplicableQuestions` in `scoringLogic` should be used as the denominator.
        }
      });
      
      const denominator = section.scoringLogic.totalApplicableQuestions > 0 ? section.scoringLogic.totalApplicableQuestions : 1;
      const averageScoreForRating = totalPoints / denominator;

      let numericRiskScoreCalc: HACTSection['numericRiskScore'] = 1; 
      let areaRiskRatingCalc: HACTSection['areaRiskRating'] = 'Low'; 

      const thresholds = section.scoringLogic.ratingThresholds;
      const sortedThresholds = [...thresholds].sort((a, b) => (a.minAverageScore ?? -Infinity) - (b.minAverageScore ?? -Infinity));
      
      let matched = false;
      for (const threshold of sortedThresholds) {
        const min = threshold.minAverageScore ?? -Infinity;
        const max = threshold.maxAverageScore ?? Infinity;
        if (averageScoreForRating >= min && averageScoreForRating <= max) {
          numericRiskScoreCalc = threshold.numericScore;
          areaRiskRatingCalc = threshold.rating;
          matched = true;
          break;
        }
      }
      
      // Fallback if no exact match (e.g. score is exactly on a boundary missed by <=, or out of all defined ranges)
      if (!matched && sortedThresholds.length > 0) {
         if (averageScoreForRating > (sortedThresholds[sortedThresholds.length-1].maxAverageScore ?? Infinity) ) {
              // If score is higher than the highest max, assign to the highest category
              numericRiskScoreCalc = sortedThresholds[sortedThresholds.length-1].numericScore;
              areaRiskRatingCalc = sortedThresholds[sortedThresholds.length-1].rating;
         } else if (averageScoreForRating < (sortedThresholds[0].minAverageScore ?? -Infinity)) {
             // If score is lower than the lowest min, assign to the lowest category
              numericRiskScoreCalc = sortedThresholds[0].numericScore;
              areaRiskRatingCalc = sortedThresholds[0].rating;
         } else {
            // If in between but no exact match (e.g. gaps in thresholds), find closest lower bound
            for (let i = sortedThresholds.length - 1; i >= 0; i--) {
                if (averageScoreForRating >= (sortedThresholds[i].minAverageScore ?? -Infinity)) {
                    numericRiskScoreCalc = sortedThresholds[i].numericScore;
                    areaRiskRatingCalc = sortedThresholds[i].rating;
                    break;
                }
            }
         }
      }


      const currentSectionState = prevData.sections[sectionIndex];
      if (currentSectionState &&
          currentSectionState.totalRiskPoints === totalPoints &&
          currentSectionState.averageRiskScore?.toFixed(3) === averageScoreForRating.toFixed(3) && // Compare with precision
          currentSectionState.numericRiskScore === numericRiskScoreCalc &&
          currentSectionState.areaRiskRating === areaRiskRatingCalc) {
        return prevData; 
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
      
      const sortedOverallThresholds = [...overallThresholds].sort((a, b) => (a.minAverageScore ?? -Infinity) - (b.minAverageScore ?? -Infinity));

      let matched = false;
      for (const threshold of sortedOverallThresholds) {
        const min = threshold.minAverageScore ?? -Infinity;
        const max = threshold.maxAverageScore ?? Infinity;
        if (overallAverageRiskScoreCalc >= min && overallAverageRiskScoreCalc <= max) {
          overallNumericRiskScoreCalc = threshold.numericScore;
          overallRiskRatingCalc = threshold.rating;
          matched = true;
          break;
        }
      }
      
      if (!matched && sortedOverallThresholds.length > 0) {
         if (overallAverageRiskScoreCalc > (sortedOverallThresholds[sortedOverallThresholds.length-1].maxAverageScore ?? Infinity) ) {
              overallNumericRiskScoreCalc = sortedOverallThresholds[sortedOverallThresholds.length-1].numericScore;
              overallRiskRatingCalc = sortedOverallThresholds[sortedOverallThresholds.length-1].rating;
         } else if (overallAverageRiskScoreCalc < (sortedOverallThresholds[0].minAverageScore ?? -Infinity)) {
              overallNumericRiskScoreCalc = sortedOverallThresholds[0].numericScore;
              overallRiskRatingCalc = sortedOverallThresholds[0].rating;
         } else {
            for (let i = sortedOverallThresholds.length - 1; i >= 0; i--) {
                if (overallAverageRiskScoreCalc >= (sortedOverallThresholds[i].minAverageScore ?? -Infinity)) {
                    overallNumericRiskScoreCalc = sortedOverallThresholds[i].numericScore;
                    overallRiskRatingCalc = sortedOverallThresholds[i].rating;
                    break;
                }
            }
         }
      }


      if (
        prevData.overallTotalRiskPoints === overallTotalRiskPoints &&
        prevData.overallAverageRiskScore?.toFixed(3) === overallAverageRiskScoreCalc.toFixed(3) &&
        prevData.overallNumericRiskScore === overallNumericRiskScoreCalc &&
        prevData.overallRiskRating === overallRiskRatingCalc
      ) {
        return prevData; 
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
    resetAssessment,
    areAllQuestionsInSectionAnswered,
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
};
