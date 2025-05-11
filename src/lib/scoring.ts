// This file will contain scoring logic for HACT assessment.
// For now, most of this logic is embedded within AssessmentContext.tsx for simplicity.
// As complexity grows, it can be refactored and moved here.

import type { HACTAssessment, HACTSection, HACTQuestion, AnswersState, RatingThreshold, SectionOverallRating } from '@/types';

/**
 * Calculates the risk points for a given question based on the answer.
 * @param question The HACT question object.
 * @param answer The answer object for the question.
 * @returns The risk points for the question, or 0 if not applicable or answer not found.
 */
function getQuestionPoints(question: HACTQuestion, answer: AnswersState[string] | undefined): number {
  if (answer && answer.value && question.options && question.options[answer.value as keyof typeof question.options]) {
    if (answer.value === 'N/A') {
      return 0; // N/A answers contribute 0 points
    }
    return question.options[answer.value as keyof typeof question.options]!.points;
  }
  return 0;
}

/**
 * Calculates the score and rating for a given section based on answers.
 * @param section The HACT section object.
 * @param answers The current set of answers for the assessment.
 * @returns An object containing the total points, applicable questions count, average score, numeric score, and rating for the section.
 */
export function calculateSectionScoreAndRating(section: HACTSection, answers: AnswersState): {
  totalPoints: number;
  applicableQuestions: number;
  averageScore: number;
  numericScore: number;
  rating: SectionOverallRating;
} {
  let totalPoints = 0;
  let applicableQuestions = 0;

  section.questions.forEach(question => {
    const answer = answers[question.id];
    if (answer && answer.value !== 'N/A') {
      totalPoints += getQuestionPoints(question, answer);
      applicableQuestions++;
    } else if (answer && answer.value === 'N/A' && question.type.endsWith('_na')) {
      // N/A answered, not counted in applicable for average score based on points logic
    } else if (!answer && !question.type.endsWith('_na')) {
      // Unanswered non-N/A question: for now, count as applicable as per original logic
      applicableQuestions++; 
    } else if (!answer && question.type.endsWith('_na')){
      // Unanswered N/A-possible question: not yet applicable
    }
  });

  const finalApplicableQuestions = applicableQuestions > 0 ? applicableQuestions : (section.scoringLogic.totalApplicableQuestions || section.questions.length);
  const averageScore = finalApplicableQuestions > 0 ? totalPoints / finalApplicableQuestions : 0;

  // New logic based on user request
  const numericScore = averageScore;
  let rating: SectionOverallRating;

  if (averageScore < 1.5) {
    rating = "Low";
  } else if (averageScore < 2.5) {
    rating = "Medium";
  } else {
    rating = "High";
  }
  
  // Removed old logic that used section.scoringLogic.ratingThresholds

  return {
    totalPoints,
    applicableQuestions: finalApplicableQuestions,
    averageScore,
    numericScore,
    rating
  };
}

/**
 * Calculates the overall assessment score and rating based on all section scores.
 * @param assessment The full HACT assessment data structure.
 * @param answers The current set of answers for the entire assessment.
 * @returns An object containing the overall total points, total applicable questions, overall average score, overall numeric score, and overall rating.
 */
export function calculateOverallScoreAndRating(assessment: HACTAssessment, answers: AnswersState): {
  overallTotalPoints: number;
  overallApplicableQuestions: number;
  overallAverageScore: number;
  overallNumericScore: number;
  overallRating: SectionOverallRating;
} {
  let overallTotalPoints = 0;
  let overallApplicableQuestions = 0;

  assessment.sections.forEach(section => {
    const sectionResult = calculateSectionScoreAndRating(section, answers);
    overallTotalPoints += sectionResult.totalPoints;
    overallApplicableQuestions += sectionResult.applicableQuestions; 
  });

  const overallAverageScore = overallApplicableQuestions > 0 ? overallTotalPoints / overallApplicableQuestions : 0;

  // New logic based on user request
  const overallNumericScore = overallAverageScore;
  let overallRating: SectionOverallRating;

  if (overallAverageScore < 1.5) {
    overallRating = "Low";
  } else if (overallAverageScore < 2.5) {
    overallRating = "Medium";
  } else {
    overallRating = "High";
  }

  // Removed old logic that used assessment.overallRatingThresholds

  return {
    overallTotalPoints,
    overallApplicableQuestions,
    overallAverageScore,
    overallNumericScore,
    overallRating
  };
}


// --- Existing functions (potentially for removal or refactor if new ones cover all needs) ---

/**
 * Calculates the risk points for a given section based on answers. (Legacy or specific use)
 * @param section The HACT section object.
 * @param answers The current set of answers.
 * @returns The total risk points for the section.
 */
export function calculateSectionRiskPoints(section: HACTSection, answers: AnswersState): number {
  let totalPoints = 0;
  section.questions.forEach(question => {
    const answer = answers[question.id];
    if (answer && question.options) {
      const optionKey = answer.value as keyof HACTQuestion['options'];
      if (question.options[optionKey] && answer.value !== 'N/A') { // Ensure N/A doesn't add points here either
        totalPoints += question.options[optionKey]!.points;
      }
    }
  });
  return totalPoints;
}

/**
 * Determines the risk rating for a section based on total points and thresholds (using min/maxPoints).
 * Potentially deprecated if all ratings move to average score based.
 * @param totalPoints Total risk points for the section.
 * @param ratingThresholds Array of rating thresholds from section's scoringLogic (expected to use minPoints/maxPoints).
 * @returns An object containing the risk score and area risk rating.
 */
export function getSectionRating(
  totalPoints: number, 
  ratingThresholds: Array<{ score: number; rating: SectionOverallRating; minPoints?: number; maxPoints?: number; }>
): { riskScore: number; areaRiskRating: SectionOverallRating } {
  let riskScore: number = 0;
  let areaRiskRating: SectionOverallRating = 'Low'; // Default

  for (const threshold of ratingThresholds) {
    if (threshold.maxPoints !== undefined && totalPoints <= threshold.maxPoints) {
      if (threshold.minPoints === undefined || totalPoints >= threshold.minPoints) {
          riskScore = threshold.score;
          areaRiskRating = threshold.rating;
          break; 
      }
    }
    if (threshold.minPoints !== undefined && totalPoints >= threshold.minPoints && threshold.maxPoints === undefined) {
      riskScore = threshold.score;
      areaRiskRating = threshold.rating;
    }
  }
   if (ratingThresholds.length > 0) {
        const lastThreshold = ratingThresholds[ratingThresholds.length - 1];
        if (lastThreshold.minPoints !== undefined && totalPoints >= lastThreshold.minPoints && lastThreshold.maxPoints === undefined) {
            riskScore = lastThreshold.score;
            areaRiskRating = lastThreshold.rating;
        }
    }

  return { riskScore, areaRiskRating };
}
