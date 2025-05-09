// This file will contain logic for generating recommendations.
// Both rule-based and potentially helper functions for AI-enhanced recommendations.
// For now, a simple rule-based example is in AssessmentContext.tsx.

import type { HACTQuestion, Answer } from '@/types';

/**
 * Generates a rule-based recommendation for a given question and answer.
 * @param question The HACT question object.
 * @param answer The user's answer object.
 * @returns A recommendation string or null if no specific rule applies.
 */
export function getStaticRecommendation(question: HACTQuestion, answer: Answer): string | null {
  // Example rule:
  if (question.id === "1.1" && answer.value === "No") {
    return "The IP must be legally registered and compliant. Obtain and provide evidence of legal registration and compliance with all national requirements.";
  }
  if (question.id === "1.3" && answer.value === "No") {
    return "Develop a clear organizational chart reflecting current functions and reporting lines. Ensure it is approved by management and communicated to staff.";
  }
  // Add more predefined rules here based on the HACT workbook.
  
  // Generic recommendation for "No" answers to key questions if no specific rule exists
  if (question.isKeyQuestion && answer.value === "No") {
    return `Addressing the issue raised in question ${question.id} ("${question.text.substring(0, 50)}...") is critical. Develop and implement measures to meet the required standards.`;
  }
  
  return null;
}

// Functions to prepare prompts for AI or process AI responses can also go here.
