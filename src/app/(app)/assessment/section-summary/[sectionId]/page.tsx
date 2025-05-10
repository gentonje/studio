"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowRight, CheckCheck, AlertTriangle, CheckCircle2, HelpCircle, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { getStaticRecommendation } from '@/lib/recommendations';
import { generateHACTRecommendationAction } from '@/app/actions'; // Assuming this is still used
import type { HACTQuestion, Answer, HACTQuestionOption, HACTSection } from '@/types';

interface RecommendationItem {
  questionId: string;
  questionText: string;
  userAnswer: string;
  risk: string;
  recommendation: string;
  isAIR: boolean;
}

export default function SectionSummaryPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params.sectionId as string;
  const { toast } = useToast();

  const {
    organizationName,
    assessmentData,
    answers,
    getQuestionStatus,
    calculateSectionScore, // Ensure this is called for the current section
    navigateToNextSection, // To navigate to the next actual assessment section
  } = useAssessment();

  const [currentSection, setCurrentSection] = useState<HACTSection | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    if (!organizationName) {
      router.push('/');
      return;
    }
    if (sectionId && assessmentData?.sections) {
      const foundSection = assessmentData.sections.find(s => s.id === sectionId);
      if (foundSection) {
        // Ensure the score for this section is up-to-date
        calculateSectionScore(sectionId);
        setCurrentSection(foundSection);
        fetchSectionRecommendations(foundSection);
      } else {
        toast({ title: "Error", description: "Section not found.", variant: "destructive" });
        router.push('/'); // Or to the main assessment page
      }
    }
    setIsLoadingPage(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationName, sectionId, assessmentData, router, calculateSectionScore]);


  const fetchSectionRecommendations = async (sec: HACTSection) => {
    if (!sec) return;
    setIsLoadingRecs(true);
    const sectionRecs: RecommendationItem[] = [];

    for (const question of sec.questions) {
      const answer = answers[question.id];
      if (getQuestionStatus(question.id) === 'unanswered' && question.type !== 'info_only') {
        // Potentially skip or note unanswered questions for this section's summary
        continue;
      }

      let shouldGenerateRecommendation = false;
      const risk = answer?.value === 'N/A' ? 'N/A' : (question.options?.[answer?.value as 'Yes' | 'No']?.riskAssessment || 'N/A');

      if (answer && answer.value !== 'N/A') {
        if (answer.value === "No") {
          shouldGenerateRecommendation = true;
        } else if (answer.value === "Yes" && (risk === "Significant" || risk === "High")) {
          shouldGenerateRecommendation = true;
        } else if ((question.type === "yes_no_explain" || question.type === "yes_no_multi_explain" || question.type === "text_input") &&
                    answer.explanation && answer.explanation.length > 10 &&
                    (risk === "Moderate" || risk === "Significant" || risk === "High")) {
          shouldGenerateRecommendation = true;
        }
      }

      if (answer && shouldGenerateRecommendation && answer.value !== 'N/A') {
        let recText = getStaticRecommendation(question, answer);
        let isAIR = false;
        const fullUserAnswer = `${answer.value}${answer.explanation ? (': ' + answer.explanation) : ''}`;
        const requiresDetailedAIR = (risk === 'High' || risk === 'Significant') ||
                                    (risk === 'Moderate' && answer.explanation && answer.explanation.length > 20) ||
                                    (question.isKeyQuestion && risk !== 'Low' && (!recText || recText.length < 100));

        if (requiresDetailedAIR) {
          try {
            const aiResult = await generateHACTRecommendationAction({
              questionText: question.text,
              userAnswer: fullUserAnswer,
              riskAssessment: risk,
              idealState: question.options?.Yes
                ? `The ideal state involves Community Health Services (CMS) demonstrating practices aligned with a 'Yes' answer...` // Truncated for brevity
                : `The ideal state for "${question.text}" involves...`, // Truncated for brevity
            });
            if (aiResult.recommendation) {
              recText = aiResult.recommendation;
              isAIR = true;
            }
          } catch (error) {
            console.error("Error fetching AI recommendation for section summary:", error);
            // Use static if AI fails
          }
        }
        if (recText) {
          sectionRecs.push({
            questionId: question.id,
            questionText: question.text,
            userAnswer: `${answer.value}${answer.explanation ? ` (${answer.explanation.substring(0, 50)}...)` : ''}`,
            risk: risk,
            recommendation: recText,
            isAIR: isAIR,
          });
        }
      }
    }
    setRecommendations(sectionRecs.sort((a, b) => {
      const riskOrder = { 'High': 1, 'Significant': 2, 'Moderate': 3, 'Low': 4, 'N/A': 5 };
      return (riskOrder[a.risk as keyof typeof riskOrder] || 5) - (riskOrder[b.risk as keyof typeof riskOrder] || 5);
    }));
    setIsLoadingRecs(false);
  };

  const handleProceed = () => {
    const nextSectionTargetId = navigateToNextSection(); // This function from context should handle logic
    if (!nextSectionTargetId) { // null might indicate it was the last section, and navigateToNextSection already routed to summary
        // If navigateToNextSection doesn't auto-route to final summary, do it here:
        // router.push('/assessment/summary');
    }
    // If navigateToNextSection returned a sectionId, it means it already navigated there.
  };

  // Helper for styling risk badges (can be imported or defined locally)
  const getRiskColorClasses = (rating?: 'Low' | 'Moderate' | 'Significant' | 'High' | 'N/A') => {
    switch (rating) {
      case 'Low': return 'text-green-700 bg-green-100 border-green-300 dark:text-green-300 dark:bg-green-900/50 dark:border-green-700';
      case 'Moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-300 dark:text-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-700';
      case 'Significant': return 'text-orange-700 bg-orange-100 border-orange-300 dark:text-orange-300 dark:bg-orange-900/50 dark:border-orange-700';
      case 'High': return 'text-red-700 bg-red-100 border-red-300 dark:text-red-300 dark:bg-red-900/50 dark:border-red-700';
      default: return 'text-gray-700 bg-gray-100 border-gray-300 dark:text-gray-300 dark:bg-gray-700/50 dark:border-gray-600';
    }
  };
   const getRiskIcon = (rating?: 'Low' | 'Moderate' | 'Significant' | 'High' | 'N/A') => {
    switch (rating) {
      case 'Low': return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'Moderate': return <HelpCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'Significant': return <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'High': return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default: return <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };


  if (isLoadingPage || !currentSection) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg">Loading section summary...</p></div>;
  }

  const isLastSection = assessmentData.sections.findIndex(s => s.id === sectionId) === assessmentData.sections.length - 1;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-secondary">
          <CardTitle className="text-2xl md:text-3xl text-primary">Section Summary: {currentSection.title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Review of your answers and risk assessment for this section.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Section Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div className={`p-3 rounded-lg shadow-sm border ${getRiskColorClasses(currentSection.areaRiskRating)}`}>
                <div className="text-2xl font-bold">{currentSection.totalRiskPoints?.toFixed(0) ?? 'N/A'}</div>
                <div className="text-xs">Total Risk Points</div>
              </div>
              <div className={`p-3 rounded-lg shadow-sm border ${getRiskColorClasses(currentSection.areaRiskRating)}`}>
                <div className="text-2xl font-bold">{currentSection.averageRiskScore?.toFixed(2) ?? 'N/A'}</div>
                <div className="text-xs">Avg. Risk Score</div>
              </div>
              <div className={`p-3 rounded-lg shadow-sm border col-span-2 flex flex-col items-center justify-center ${getRiskColorClasses(currentSection.areaRiskRating)}`}>
                {getRiskIcon(currentSection.areaRiskRating)}
                <div className="text-lg font-semibold mt-1">{currentSection.areaRiskRating ?? 'N/A'}</div>
                <div className="text-xs">Area Risk Rating (Score: {currentSection.numericRiskScore ?? 'N/A'})</div>
              </div>
            </CardContent>
          </Card>

          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Key Recommendations for this Section</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRecs && <div className="flex items-center"><Loader2 className="h-6 w-6 animate-spin mr-2" /><span>Loading recommendations...</span></div>}
                {!isLoadingRecs && (
                  <ul className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <li key={`${rec.questionId}-${index}`} className="p-3 border rounded-md bg-background/50 dark:border-gray-700">
                        <h4 className="font-semibold text-primary text-md">{rec.questionId}. {rec.questionText}</h4>
                        <p className="text-xs text-muted-foreground">Your Answer: {rec.userAnswer} (Risk: {rec.risk})</p>
                        <div className="mt-1 text-sm prose prose-sm max-w-none">
                           <strong className="block">Recommendation:</strong>
                           <div dangerouslySetInnerHTML={{ __html: rec.recommendation.replace(/\n/g, '<br />') }} />
                        </div>
                        {rec.isAIR && <Badge variant="outline" className="mt-2 text-xs border-accent text-accent bg-accent/10"><BrainCircuit size={12} className="mr-1"/> AI Enhanced</Badge>}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
           {!isLoadingRecs && recommendations.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-4">No specific high-risk areas identified requiring recommendations in this section, or all questions were low risk.</p>
           )}
        </CardContent>
        <CardFooter className="p-6 border-t flex justify-end">
          <Button onClick={handleProceed} size="lg">
            {isLastSection ? "View Full Summary" : "Next Section"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
