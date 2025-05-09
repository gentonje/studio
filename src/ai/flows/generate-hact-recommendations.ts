
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
  userAnswer: z.string().describe('The user’s answer to the question, including any explanation provided.'),
  riskAssessment: z.string().describe('The risk assessment associated with the answer (e.g., Low, Moderate, Significant, High).'),
  idealState: z.string().describe('The ideal/expected answer or best practice for the question.'),
});
export type GenerateHACTRecommendationsInput = z.infer<typeof GenerateHACTRecommendationsInputSchema>;

const GenerateHACTRecommendationsOutputSchema = z.object({
  recommendation: z.string().describe('A highly detailed, comprehensive, actionable, and professional recommendation for the organization to improve, aligned with UN HACT principles and donor expectations (UNDP, UNICEF, UNFPA), including concrete examples and step-by-step guidance, specifically tailored to the provided question and answer for Community Health Services (CMS).'),
});
export type GenerateHACTRecommendationsOutput = z.infer<typeof GenerateHACTRecommendationsOutputSchema>;

export async function generateHACTRecommendations(input: GenerateHACTRecommendationsInput): Promise<GenerateHACTRecommendationsOutput> {
  return generateHACTRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHACTRecommendationsPrompt',
  input: {schema: GenerateHACTRecommendationsInputSchema},
  output: {schema: GenerateHACTRecommendationsOutputSchema},
  prompt: `You are an expert financial consultant specializing in reviewing Community Health Services (CMS)'s capacity to handle Donor funds (e.g., from UNDP, UNICEF, UNFPA) according to their guidelines and the Harmonized Approach to Cash Transfers (HACT) framework.
An organization, Community Health Services (CMS), is undergoing a UN HACT micro-assessment.

You will be provided with a specific HACT assessment question, CMS's answer (which may include an explanation), the associated risk assessment, and the ideal state for that question. Your task is to generate a **unique, highly detailed, comprehensive, and actionable** recommendation **specifically tailored** to address the identified gap for **this particular question and for CMS**.

Details for the current question:
- HACT Assessment Question: '{{questionText}}'
- Community Health Services (CMS)'s Answer: '{{userAnswer}}'
- Assessed Risk: '{{riskAssessment}}'
- Ideal State/Best Practice: '{{idealState}}'

Based **only** on the specific information provided above for this question, provide a recommendation for Community Health Services (CMS). The recommendation must:
1.  **Structure:** Organize your recommendation clearly. Consider using headings like:
    *   **Identified Gap:** Clearly explain the specific gap or weakness CMS exhibits based on their answer in relation to the '{{questionText}}' and its '{{riskAssessment}}'.
    *   **Risk Implication:** Briefly state the potential negative impact on CMS's operations, compliance, or funding.
    *   **Detailed Action Plan:** Provide specific, step-by-step guidance on how CMS can address this particular gap and improve their capacity. This should be the core of your recommendation.
    *   **Specific Examples for CMS:** Illustrate with practical, concrete examples relevant to '{{questionText}}' and CMS's potential context. For instance, if a policy is needed, suggest key sections or elements with detailed content examples. If a process needs improvement, describe the improved process steps with specifics. If controls are weak, suggest specific controls to implement.
    *   **HACT/Donor Alignment:** Explicitly connect your advice to relevant UN HACT principles and common expectations of donors like UNDP, UNICEF, and UNFPA, as they apply to '{{questionText}}'.
2.  **Content Quality:**
    *   Be extremely detailed and practical. Generic advice is not helpful.
    *   Provide step-by-step guidance where appropriate.
    *   Include concrete examples tailored to what CMS might need to do.
    *   Reference specific HACT guidelines or common best practices directly applicable to '{{questionText}}' where possible.
    *   The recommendation must be professional, thorough, and written to be easily understood and implemented by CMS. Do not limit the length; provide as much detail as necessary to be truly helpful for this specific issue.
3.  **Contextual Relevance:**
    *   **Crucially, ensure your recommendation is not generic. It must directly address the nuances of '{{questionText}}' and '{{userAnswer}}' as answered by CMS, and not be applicable to other unrelated HACT questions.** Your response should be distinct and highly contextualized.
    *   Focus solely on the information provided for *this* question. Do not make assumptions about CMS beyond what is implied by the question and answer.

Generate the recommendation.
`,
});

const generateHACTRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateHACTRecommendationsFlow',
    inputSchema: GenerateHACTRecommendationsInputSchema,
    outputSchema: GenerateHACTRecommendationsOutputSchema,
    config: {
      // Loosen safety settings slightly if needed for detailed financial/governance advice, but be cautious.
      // Example:
      // safetySettings: [
      //   { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      //   { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      // ],
    }
  },
  async input => {
    const {output} = await prompt(input);
    // Potentially add post-processing here if needed, e.g., formatting markdown.
    return output!;
  }
);


    