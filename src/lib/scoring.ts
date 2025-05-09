// This file will contain scoring logic for HACT assessment.
// For now, most of this logic is embedded within AssessmentContext.tsx for simplicity.
// As complexity grows, it can be refactored and moved here.

import type { HACTSection, HACTQuestion, AnswersState } from '@/types';

/**
 * Calculates the risk points for a given section based on answers.
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
      if (question.options[optionKey]) {
        totalPoints += question.options[optionKey]!.points;
      }
    }
  });
  return totalPoints;
}

/**
 * Determines the risk rating for a section based on total points and thresholds.
 * @param totalPoints Total risk points for the section.
 * @param ratingThresholds Array of rating thresholds from section's scoringLogic.
 * @returns An object containing the risk score and area risk rating.
 */
export function getSectionRating(
  totalPoints: number, 
  ratingThresholds: HACTSection['scoringLogic']['ratingThresholds']
): { riskScore: number; areaRiskRating: HACTSection['areaRiskRating'] } {
  let riskScore: number = 0;
  let areaRiskRating: HACTSection['areaRiskRating'] = 'Low'; // Default

  for (const threshold of ratingThresholds) {
    if (threshold.maxPoints !== undefined && totalPoints <= threshold.maxPoints) {
      riskScore = threshold.score;
      areaRiskRating = threshold.rating;
      break; 
    }
    if (threshold.minPoints !== undefined && totalPoints >= threshold.minPoints) {
      // This condition might be met by multiple thresholds if not careful with definition
      // The loop should find the tightest applicable range or highest applicable minPoints
      riskScore = threshold.score;
      areaRiskRating = threshold.rating;
    }
  }
  // Ensure if points exceed all maxPoints, it falls into the last category if defined by minPoints
   if (ratingThresholds.length > 0) {
        const lastThreshold = ratingThresholds[ratingThresholds.length - 1];
        if (lastThreshold.minPoints !== undefined && totalPoints >= lastThreshold.minPoints) {
            riskScore = lastThreshold.score;
            areaRiskRating = lastThreshold.rating;
        }
    }

  return { riskScore, areaRiskRating };
}

// Add more functions as needed, e.g., calculateOverallAssessmentRating.
// The context currently handles these calculations directly.
