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
  recommendation: z.string().describe('A highly detailed, comprehensive, actionable, and professional recommendation for the organization to improve, aligned with UN HACT principles and donor expectations, including examples and step-by-step guidance, specifically tailored to the provided question and answer.'),
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

You will be provided with a specific HACT assessment question, the organization's answer, the associated risk assessment, and the ideal state for that question. Your task is to generate a **unique, highly detailed, comprehensive, and actionable** recommendation **specifically tailored** to address the identified gap for **this particular question**.

Details for the current question:
- HACT Assessment Question: '{{questionText}}'
- Organization's Answer: '{{userAnswer}}'
- Assessed Risk: '{{riskAssessment}}'
- Ideal State/Best Practice: '{{idealState}}'

Based **only** on the specific information provided above for this question, provide a recommendation for Community Health Services (CMS). The recommendation must:
1.  Clearly explain the specific gap or weakness identified from the organization's answer in relation to the '{{questionText}}' and its '{{riskAssessment}}'.
2.  Provide specific, step-by-step guidance on how CMS can address this particular gap and improve their capacity to manage donor funds effectively, directly relating to '{{questionText}}'.
3.  Ensure the guidance aligns with UN HACT principles and the expectations of donors like UNDP, UNICEF, and UNFPA, as they apply to '{{questionText}}'.
4.  Include **concrete examples** relevant to '{{questionText}}' of what CMS should do or what a good implementation looks like. For instance, if a policy is needed *for this specific area*, suggest key sections or elements of that policy with detailed content. If a process needs improvement *related to this question*, describe the improved process steps with specifics. If controls are weak, suggest specific controls to implement.
5.  Reference specific HACT guidelines or common best practices directly applicable to '{{questionText}}' where possible.
6.  The recommendation must be professional, thorough, and written to be easily understood and implemented by CMS. Do not limit the length; provide as much detail as necessary to be truly helpful for this specific issue.
7.  **Crucially, ensure your recommendation is not generic. It must directly address the nuances of '{{questionText}}' and '{{userAnswer}}' and not be applicable to other unrelated HACT questions.** Your response should be distinct and highly contextualized.`,
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
