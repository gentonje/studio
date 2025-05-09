
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
  totalApplicable?: number;
  totalKey: number;
  ratingThresholds: Array<{
    maxPoints?: number;
    minPoints?: number;
    score: number;
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
  riskScore?: number;
  areaRiskRating?: 'Low' | 'Moderate' | 'Significant' | 'High';
}

export interface HACTAssessment {
  assessmentTitle: string;
  sections: HACTSection[];
  overallTotalRiskPoints?: number;
  overallRiskScore?: number;
  overallRiskRating?: 'Low' | 'Moderate' | 'Significant' | 'High';
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
  navigateToNextSection: () => string | null; // Returns next section ID or null if summary
  navigateToPrevSection: () => string | null; // Returns prev section ID or null if first
  getCurrentSection: () => HACTSection | undefined;
  getCurrentQuestion: () => HACTQuestion | undefined;
  getQuestionStatus: (questionId: string) => 'answered' | 'skipped' | 'unanswered';
  calculateSectionScore: (sectionId: string) => void;
  calculateOverallScore: () => void;
  getRuleBasedRecommendation: (question: HACTQuestion, answer: Answer) => string | null;
  resetAssessment: () => void;
  areAllQuestionsInSectionAnswered: (sectionId: string) => boolean; // Added
}

