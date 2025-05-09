"use server";

import { generateHACTRecommendations } from '@/ai/flows/generate-hact-recommendations';
import type { GenerateHACTRecommendationsInput, GenerateHACTRecommendationsOutput } from '@/ai/flows/generate-hact-recommendations';

export async function generateHACTRecommendationAction(
  input: GenerateHACTRecommendationsInput
): Promise<GenerateHACTRecommendationsOutput> {
  try {
    // Validate input if necessary, though Zod in the flow does this.
    const result = await generateHACTRecommendations(input);
    return result;
  } catch (error) {
    console.error("Error in generateHACTRecommendationAction:", error);
    // It's better to throw a more specific error or return an error object
    // For simplicity, re-throwing. Client should handle this.
    // Or return a structured error: return { error: "Failed to generate recommendation." };
    throw new Error("Failed to generate AI recommendation.");
  }
}