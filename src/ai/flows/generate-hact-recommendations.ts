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
  riskAssessment: z.string().describe('The risk assessment associated with the answer.'),
  idealState: z.string().describe('The ideal/expected answer or best practice.'),
});
export type GenerateHACTRecommendationsInput = z.infer<typeof GenerateHACTRecommendationsInputSchema>;

const GenerateHACTRecommendationsOutputSchema = z.object({
  recommendation: z.string().describe('A concise, actionable recommendation for the organization to improve.'),
});
export type GenerateHACTRecommendationsOutput = z.infer<typeof GenerateHACTRecommendationsOutputSchema>;

export async function generateHACTRecommendations(input: GenerateHACTRecommendationsInput): Promise<GenerateHACTRecommendationsOutput> {
  return generateHACTRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHACTRecommendationsPrompt',
  input: {schema: GenerateHACTRecommendationsInputSchema},
  output: {schema: GenerateHACTRecommendationsOutputSchema},
  prompt: `An organization is undergoing a UN HACT micro-assessment.
For the question: '{{questionText}}'
The organization answered: '{{userAnswer}}'
The observed risk assessment for this answer is: '{{riskAssessment}}'
The ideal/expected answer or best practice implies: '{{idealState}}'
Provide a concise, actionable recommendation (max 2-3 sentences) for the organization to improve in this specific area, considering it's for a UN partner.`,
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
