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
  userAnswer: z.string().describe('The user’s answer to the question.'),
  riskAssessment: z.string().describe('The risk assessment associated with the answer (e.g., Low, Moderate, High).'),
  idealState: z.string().describe('The ideal/expected answer or best practice for the question.'),
});
export type GenerateHACTRecommendationsInput = z.infer<typeof GenerateHACTRecommendationsInputSchema>;

const GenerateHACTRecommendationsOutputSchema = z.object({
  recommendation: z.string().describe('A highly detailed, comprehensive, actionable, and professional recommendation for the organization to improve, aligned with UN HACT principles and donor expectations, including examples and step-by-step guidance.'),
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
An organization, Community Health Services (CMS), is undergoing a UN HACT micro-assessment.
For the HACT assessment question: '{{questionText}}'
The organization's answer was: '{{userAnswer}}'
This answer has an associated risk assessment of: '{{riskAssessment}}'
The ideal state or best practice for this question is: '{{idealState}}'

Based on this information, provide a **highly detailed, comprehensive, and actionable** recommendation for Community Health Services (CMS). The recommendation should:
1.  Clearly explain the identified gap or weakness based on the user's answer and risk assessment.
2.  Provide specific, step-by-step guidance on how to address the gap and improve their capacity to manage donor funds effectively.
3.  Align with UN HACT principles and the expectations of donors like UNDP, UNICEF, and UNFPA.
4.  Include **concrete examples** of what the organization should do or what a good implementation looks like. For instance, if a policy is needed, suggest key sections or elements of that policy. If a process needs improvement, describe the improved process steps.
5.  Reference specific HACT guidelines or common best practices where applicable.
6.  The recommendation should be professional, thorough, and written to be easily understood and implemented by the organization. Do not limit the length; provide as much detail as necessary to be truly helpful.`,
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

