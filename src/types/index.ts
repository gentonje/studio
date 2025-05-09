
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
  totalApplicableQuestions: number; // From HACT document, used as denominator for average
  totalKey: number;
  ratingThresholds: Array<{ // Thresholds for AVERAGE risk points per question
    maxAverageScore?: number; // Upper bound for the average score for this rating
    minAverageScore?: number; // Lower bound for the average score for this rating
    numericScore: number; // The 1-4 score (Low=1, Mod=2, Sig=3, High=4)
    rating: 'Low' | 'Moderate' | 'Significant' | 'High';
  }>;
}

export interface HACTSection {
  id: string;
  title: string;
  responsibleDepartment: string;
  questions: HACTQuestion[];
  scoringLogic: HACTSectionScoringLogic;
  totalRiskPoints?: number; // Sum of points from answers
  averageRiskScore?: number; // totalRiskPoints / totalApplicableQuestions
  numericRiskScore?: number; // 1-4 score based on averageRiskScore and thresholds
  areaRiskRating?: 'Low' | 'Moderate' | 'Significant' | 'High'; // Derived from averageRiskScore
}

export interface HACTAssessment {
  assessmentTitle: string;
  sections: HACTSection[];
  overallTotalRiskPoints?: number; // Sum of all section totalRiskPoints
  overallAverageRiskScore?: number; // overallTotalRiskPoints / totalApplicableQuestionsOverall
  overallNumericRiskScore?: number; // 1-4 score based on overallAverageRiskScore
  overallRiskRating?: 'Low' | 'Moderate' | 'Significant' | 'High'; // Derived from overallAverageRiskScore
  overallRatingThresholds?: HACTSectionScoringLogic['ratingThresholds']; // Global thresholds for overall assessment average
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
  areAllQuestionsInSectionAnswered: (sectionId: string) => boolean;
}
