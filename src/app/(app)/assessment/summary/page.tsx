"use client";

import React, { useEffect, useRef } from 'react'; 
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateHACTRecommendationAction } from '@/app/actions';
import type { HACTQuestion, Answer } from '@/types';
import { Loader2, Download, Printer, RotateCcw, AlertTriangle, CheckCircle2, HelpCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge'; 

interface RecommendationItem {
  questionText: string;
  userAnswer: string;
  risk: string;
  recommendation: string;
  isAIR: boolean; // Is AI Recommendation
}

export default function SummaryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    organizationName, 
    assessmentData, 
    answers,
    calculateOverallScore,
    calculateSectionScore, 
    getRuleBasedRecommendation,
    resetAssessment 
  } = useAssessment();

  const [recommendations, setRecommendations] = React.useState<RecommendationItem[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = React.useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!organizationName) {
      router.push('/');
    } else {
      assessmentData.sections.forEach(section => calculateSectionScore(section.id));
      calculateOverallScore();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationName, router]); 

  const fetchRecommendations = async () => {
    setIsLoadingRecs(true);
    const allRecs: RecommendationItem[] = [];

    for (const section of assessmentData.sections) {
      for (const question of section.questions) {
        const answer = answers[question.id];
        if (answer && (answer.value === "No" || (answer.value === "Yes" && question.options?.Yes?.riskAssessment !== "Low") )) { 
          let recText = getRuleBasedRecommendation(question, answer);
          let isAIR = false;

          const risk = question.options?.[answer.value as 'Yes'|'No']?.riskAssessment || 'N/A';

          if ((!recText && (risk === 'High' || risk === 'Significant')) || (question.type === 'yes_no_explain' && answer.explanation && answer.explanation.length > 10)) {
            try {
              const aiResult = await generateHACTRecommendationAction({
                questionText: question.text,
                userAnswer: `${answer.value}${answer.explanation ? ': ' + answer.explanation : ''}`,
                riskAssessment: risk,
                idealState: `Ideal state for "${question.text}" is typically the opposite of a high-risk answer or involves having documented procedures, policies, and controls in place aligned with UN agency requirements.`, 
              });
              if (aiResult.recommendation) {
                recText = aiResult.recommendation;
                isAIR = true;
              }
            } catch (error) {
              console.error("Error fetching AI recommendation:", error);
              toast({ title: "AI Recommendation Error", description: `Could not fetch AI tip for "${question.text.substring(0,30)}...".`, variant: "destructive" });
            }
          }
          
          if (recText) {
            allRecs.push({
              questionText: question.text,
              userAnswer: `${answer.value}${answer.explanation ? ` (${answer.explanation.substring(0,50)}...)` : ''}`,
              risk: risk,
              recommendation: recText,
              isAIR: isAIR,
            });
          }
        }
      }
    }
    setRecommendations(allRecs);
    setIsLoadingRecs(false);
  };
  
  useEffect(() => {
      if (organizationName) {
          fetchRecommendations();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationName, assessmentData.sections, answers]); 

  if (!organizationName) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg">Loading summary...</p></div>;
  }

  const handlePrintOrDownload = () => {
    window.print();
  };
  
  const getRiskColorClasses = (rating?: 'Low' | 'Moderate' | 'Significant' | 'High' | 'N/A') => {
    switch (rating) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Significant': return 'text-orange-600 bg-orange-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
   const getRiskIcon = (rating?: 'Low' | 'Moderate' | 'Significant' | 'High' | 'N/A') => {
    switch (rating) {
      case 'Low': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'Moderate': return <HelpCircle className="h-5 w-5 text-yellow-600" />; 
      case 'Significant': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'High': return <AlertTriangle className="h-5 w-5 text-red-600" />; 
      default: return <HelpCircle className="h-5 w-5 text-gray-600" />;
    }
  };


  return (
    <div className="max-w-5xl mx-auto py-8 print-summary-report" ref={reportRef}>
      <Card className="shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
          <CardTitle className="text-3xl md:text-4xl">Assessment Summary Report</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Organization: {organizationName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Overall Assessment Results</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className={`p-4 rounded-lg shadow ${getRiskColorClasses(assessmentData.overallRiskRating)}`}>
                <div className="text-3xl font-bold">{assessmentData.overallTotalRiskPoints ?? 'N/A'}</div>
                <div className="text-sm">Total Risk Points</div>
              </div>
               <div className={`p-4 rounded-lg shadow ${getRiskColorClasses(assessmentData.overallRiskRating)}`}>
                <div className="text-3xl font-bold">{assessmentData.overallRiskScore ?? 'N/A'}</div>
                <div className="text-sm ">Overall Risk Score</div>
              </div>
              <div className={`p-4 rounded-lg shadow flex flex-col items-center justify-center ${getRiskColorClasses(assessmentData.overallRiskRating)}`}>
                {getRiskIcon(assessmentData.overallRiskRating)}
                <div className="text-xl font-semibold mt-1">{assessmentData.overallRiskRating ?? 'N/A'}</div>
                <div className="text-sm ">Overall Risk Rating</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Section Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {assessmentData.sections.map((section) => (
                  <AccordionItem value={section.id} key={section.id}>
                    <AccordionTrigger className={`text-lg font-semibold hover:bg-muted/50 p-4 rounded-md ${getRiskColorClasses(section.areaRiskRating)} data-[state=open]:bg-muted/60`}>
                      <div className="flex items-center justify-between w-full">
                        <span>{section.title}</span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRiskColorClasses(section.areaRiskRating)} border`}>
                          {section.areaRiskRating || 'N/A'} ({section.totalRiskPoints || 0} pts)
                        </span>
                      </div>
                    </AccordionTrigger>
                    <div className="accordion-content-wrapper"> {/* Wrapper for print styling */}
                      <AccordionContent className="p-4 space-y-2 text-base">
                        <p><strong>Risk Points:</strong> {section.totalRiskPoints ?? 'Not calculated'}</p>
                        <p><strong>Risk Score:</strong> {section.riskScore ?? 'Not calculated'}</p>
                        <p><strong>Area Risk Rating:</strong> {section.areaRiskRating ?? 'Not calculated'}</p>
                        <p><strong>Applicable Questions:</strong> {section.scoringLogic.totalApplicable ?? section.questions.length}</p>
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Recommendations</CardTitle>
              <CardDescription>Actionable insights based on the assessment findings.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecs && <div className="flex items-center justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-3 text-lg">Generating recommendations...</p></div>}
              {!isLoadingRecs && recommendations.length === 0 && <p className="text-muted-foreground">No specific recommendations generated, or all areas are compliant.</p>}
              {!isLoadingRecs && recommendations.length > 0 && (
                <ul className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="p-4 border rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow">
                      <p className="font-semibold text-primary">{rec.questionText}</p>
                      <p className="text-sm text-muted-foreground">Your Answer: <span className="font-medium">{rec.userAnswer}</span> (Risk: <span className={`font-medium ${getRiskColorClasses(rec.risk as any).split(' ')[0]}`}>{rec.risk}</span>)</p>
                      <p className="mt-2 text-foreground"><strong>Recommendation:</strong> {rec.recommendation}</p>
                      {rec.isAIR && <Badge variant="outline" className="mt-1 border-accent text-accent">AI Enhanced</Badge>}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

        </CardContent>
        <CardFooter className="p-6 border-t flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 no-print">
          <Button variant="outline" onClick={resetAssessment}>
            <RotateCcw className="mr-2 h-4 w-4" /> Start New Assessment
          </Button>
          <Button variant="outline" onClick={handlePrintOrDownload}>
            <Printer className="mr-2 h-4 w-4" /> Print Report
          </Button>
          <Button onClick={handlePrintOrDownload}>
            <FileText className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

```