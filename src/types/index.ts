
export interface HACTQuestionOption {
  riskAssessment: 'Low' | 'Moderate' | 'Significant' | 'High' | 'N/A';
  points: number;
  defaultExplanationPlaceholder?: string;
  promptForDetails?: string;
}

export type QuestionType = 'yes_no_na' | 'yes_no_explain' | 'yes_no_multi_explain' | 'text_input' | 'info_only';

export interface HACTQuestion {
  id: string;
  text: string;
  isKeyQuestion: boolean;
  type: QuestionType;
  options?: {
    Yes?: HACTQuestionOption;
    No?: HACTQuestionOption;
    'N/A'?: HACTQuestionOption;
  };
  exampleComment?: string;
  infoContent?: string; // For info_only type
}

export interface HACTSectionScoringLogic {
  totalQuestions: number;
  totalApplicableQuestions: number; 
  totalKey: number;
  ratingThresholds: Array<{ 
    minAverageScore?: number; 
    maxAverageScore?: number; 
    numericScore: number; 
    rating: 'Low' | 'Moderate' | 'Significant' | 'High';
  }>;
}

export interface HACTSection {
  id: string;
  title: string;
  responsibleDepartment: string;
  questions: HACTQuestion[];
  scoringLogic: HACTSectionScoringLogic;
  totalRiskPoints?: number; 
  averageRiskScore?: number; 
  numericRiskScore?: number; 
  areaRiskRating?: 'Low' | 'Moderate' | 'Significant' | 'High'; 
}

// New interface for individual section summaries in the final report
export interface SectionSummary {
  sectionId: string;
  sectionTitle: string;
  totalRiskPoints?: number; // Using existing field from HACTSection
  areaRiskRating?: 'Low' | 'Moderate' | 'Significant' | 'High'; // Using existing field from HACTSection
}

export interface HACTAssessment {
  assessmentTitle: string;
  sections: HACTSection[];
  overallTotalRiskPoints?: number; 
  overallAverageRiskScore?: number; 
  overallNumericRiskScore?: number; 
  overallRiskRating?: 'Low' | 'Moderate' | 'Significant' | 'High'; 
  overallRatingThresholds?: HACTSectionScoringLogic['ratingThresholds']; 
  sectionSummaries?: SectionSummary[]; // Added field for storing section summaries
}

export interface Answer {
  questionId: string;
  value: 'Yes' | 'No' | 'N/A' | string | null;
  explanation?: string;
}

export type AnswersState = Record<string, Answer>; // Keyed by questionId

export interface AssessmentContextState {
  organizationName: string | null;
  currentSectionId: string | null;
  currentQuestionIndexInSection: number;
  answers: AnswersState;
  assessmentData: HACTAssessment;
  setOrganizationName: (name: string) => void;
  startAssessment: (data: HACTAssessment, firstSectionId: string) => void;
  answerQuestion: (questionId: string, value: Answer['value'], explanation?: string) => void;
  navigateToNextQuestion: () => void;
  navigateToPrevQuestion: () => void;
  navigateToNextSection: () => string | null; 
  navigateToPrevSection: () => string | null; 
  getCurrentSection: () => HACTSection | undefined;
  getCurrentQuestion: () => HACTQuestion | undefined;
  getQuestionStatus: (questionId: string) => 'answered' | 'unanswered'; // N/A is considered 'answered' for navigation
  calculateSectionScore: (sectionId: string) => void;
  calculateOverallScore: () => void;
  resetAssessment: () => void;
  areAllQuestionsInSectionAnswered: (sectionId: string) => boolean;
}

