// use server'
'use server';

/**
 * @fileOverview Generates tailored recommendations using the Gemini API for sub-optimal HACT assessment answers.
 *
 * - generateHACTRecommendations - A function that generates HACT recommendations.
 * - GenerateHACTRecommendationsInput - The input type for the generateHACTRecommendations function.
 * - GenerateHACTRecommendationsOutput - The return type for the generateHACTRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHACTRecommendationsInputSchema = z.object({
  questionText: z.string().describe('The text of the HACT assessment question.'),
  userAnswer: z.string().describe('The user\u2019s answer to the question.'),
  riskAssessment: z.string().describe('The risk assessment associated with the answer (e.g., Low, Moderate, High).'),
  idealState: z.string().describe('The ideal/expected answer or best practice for the question.'),
});
export type GenerateHACTRecommendationsInput = z.infer<typeof GenerateHACTRecommendationsInputSchema>;

const GenerateHACTRecommendationsOutputSchema = z.object({
  recommendation: z.string().describe('A concise, actionable, and professional recommendation for the organization to improve, aligned with UN HACT principles and donor expectations.'),
});
export type GenerateHACTRecommendationsOutput = z.infer<typeof GenerateHACTRecommendationsOutputSchema>;

export async function generateHACTRecommendations(input: GenerateHACTRecommendationsInput): Promise<GenerateHACTRecommendationsOutput> {
  return generateHACTRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHACTRecommendationsPrompt',
  input: {schema: GenerateHACTRecommendationsInputSchema},
  output: {schema: GenerateHACTRecommendationsOutputSchema},
  prompt: `You are an expert financial consultant specializing in reviewing organizations' capacity to handle Donor funds (e.g., from UNDP, UNICEF, UNFPA) according to their guidelines and the Harmonized Approach to Cash Transfers (HACT) framework.
An organization is undergoing a UN HACT micro-assessment.
For the HACT assessment question: '{{questionText}}'
The organization's answer was: '{{userAnswer}}'
This answer has an associated risk assessment of: '{{riskAssessment}}'
The ideal state or best practice for this question is: '{{idealState}}'
Based on this information, provide a concise, actionable, and professional recommendation (max 2-3 sentences) for the organization. The recommendation should help them improve their capacity to manage donor funds effectively and align with UN HACT principles and the expectations of donors like UNDP, UNICEF, and UNFPA. Focus on practical steps the organization can take.`,
});

const generateHACTRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateHACTRecommendationsFlow',
    inputSchema: GenerateHACTRecommendationsInputSchema,
    outputSchema: GenerateHACTRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

```