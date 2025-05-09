
"use client";

import React, { useEffect, useRef, useState } from 'react'; 
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateHACTRecommendationAction } from '@/app/actions';
import type { HACTQuestion, Answer, HACTQuestionOption } from '@/types';
import { Loader2, FileText, Printer, RotateCcw, AlertTriangle, CheckCircle2, HelpCircle, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge'; 
import { getStaticRecommendation } from '@/lib/recommendations';

interface RecommendationItem {
  questionId: string;
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
    resetAssessment,
    getQuestionStatus 
  } = useAssessment();

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!organizationName) {
      router.push('/');
    } else {
      assessmentData.sections.forEach(section => calculateSectionScore(section.id));
      calculateOverallScore();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationName, router, assessmentData.sections]); 

  const fetchRecommendations = async () => {
    setIsLoadingRecs(true);
    const allRecs: RecommendationItem[] = [];

    for (const section of assessmentData.sections) {
      for (const question of section.questions) {
        const answer = answers[question.id];
        
        if (getQuestionStatus(question.id) === 'unanswered' && question.type !== 'info_only') {
            toast({
                title: "Missing Answer for Recommendation",
                description: `Question ${question.id} ("${question.text.substring(0,30)}...") in section "${section.title}" was not answered. Skipping recommendation.`,
                variant: "default"
            });
            continue; 
        }
        
        let shouldGenerateRecommendation = false;
        const risk = answer?.value === 'N/A' ? 'N/A' : (question.options?.[answer?.value as 'Yes'|'No']?.riskAssessment || 'N/A');

        if (answer && answer.value !== 'N/A') { 
          if (answer.value === "No") {
            shouldGenerateRecommendation = true;
          } else if (answer.value === "Yes" && (risk === "Significant" || risk === "High")) {
            shouldGenerateRecommendation = true;
          } else if ( (question.type === "yes_no_explain" || question.type === "yes_no_multi_explain" || question.type === "text_input") && 
                      answer.explanation && answer.explanation.length > 10 && 
                      (risk === "Moderate" || risk === "Significant" || risk === "High") ) {
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
                    ? `The ideal state involves Community Health Services (CMS) demonstrating practices aligned with a 'Yes' answer, including robust policies, procedures, and controls that effectively mitigate risks related to "${question.text}". For example, having ${question.options.Yes.defaultExplanationPlaceholder || 'well-documented evidence and consistent application of best practices'}.`
                    : `The ideal state for "${question.text}" involves Community Health Services (CMS) having documented procedures, policies, and controls in place aligned with UN HACT requirements and best practices for managing donor funds effectively, thereby minimizing risks.`, 
              });
              if (aiResult.recommendation) {
                recText = aiResult.recommendation;
                isAIR = true;
              } else if (!recText) { 
                 toast({ title: "AI Recommendation Note", description: `AI could not generate a detailed tip for "${question.text.substring(0,30)}...". Using standard guidance if available.`, variant: "default" });
              }
            } catch (error) {
              console.error("Error fetching AI recommendation:", error);
              toast({ title: "AI Recommendation Error", description: `Could not fetch AI tip for "${question.text.substring(0,30)}...". Using static recommendation if available.`, variant: "destructive" });
            }
          }
          
          if (recText) {
            allRecs.push({
              questionId: question.id,
              questionText: question.text,
              userAnswer: `${answer.value}${answer.explanation ? ` (${answer.explanation.substring(0,100)}...)` : ''}`,
              risk: risk,
              recommendation: recText,
              isAIR: isAIR,
            });
          }
        }
      }
    }
    setRecommendations(allRecs.sort((a, b) => { 
      const riskOrder = { 'High': 1, 'Significant': 2, 'Moderate': 3, 'Low': 4, 'N/A': 5 };
      return (riskOrder[a.risk as keyof typeof riskOrder] || 5) - (riskOrder[b.risk as keyof typeof riskOrder] || 5);
    }));
    setIsLoadingRecs(false);
  };
  
  useEffect(() => {
      if (organizationName && assessmentData.sections.length > 0) { 
          fetchRecommendations();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationName, assessmentData, answers]); 

  if (!organizationName || !assessmentData || assessmentData.sections.length === 0) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg">Loading summary...</p></div>;
  }

  const handlePrintOrDownload = () => {
    const printContents = reportRef.current?.innerHTML;
    if (printContents) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>HACT Assessment Report for Community Health Services (CMS)</title>');
        const styles = Array.from(document.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join('');
            } catch (e) {
              console.warn('Could not read CSS rules from stylesheet:', styleSheet.href, e);
              return '';
            }
          })
          .join('');
        printWindow.document.write(`<style>${styles} @media print { body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }</style>`);
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<div class="print-summary-report">${printContents}</div>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        // Delay print to ensure all content and styles are loaded
        // Some browsers might need this, especially if styles are complex or content is dynamic
        setTimeout(() => {
            printWindow.focus(); // Focus is important for some browsers to trigger print dialog
            printWindow.print();
            // Optional: printWindow.close(); // Consider user experience, some might want to keep it open
        }, 1000); // Increased delay for potentially complex reports

      } else {
        toast({ title: "Print Error", description: "Could not open print window. Please check your browser's pop-up settings.", variant: "destructive"});
      }
    } else {
        toast({ title: "Print Error", description: "Could not get report content for printing.", variant: "destructive"});
    }
  };
  
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


  return (
    <div className="max-w-5xl mx-auto py-8">
      <div ref={reportRef} className="print-summary-report"> 
        <Card className="shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
            <CardTitle className="text-3xl md:text-4xl">HACT Micro-Assessment Summary Report</CardTitle>
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
                <div className={`p-4 rounded-lg shadow border ${getRiskColorClasses(assessmentData.overallRiskRating)}`}>
                  <div className="text-3xl font-bold">{assessmentData.overallTotalRiskPoints?.toFixed(0) ?? 'N/A'}</div>
                  <div className="text-sm">Total Risk Points</div>
                </div>
                <div className={`p-4 rounded-lg shadow border ${getRiskColorClasses(assessmentData.overallRiskRating)}`}>
                  <div className="text-3xl font-bold">{assessmentData.overallAverageRiskScore?.toFixed(2) ?? 'N/A'}</div>
                  <div className="text-sm ">Overall Average Risk Score</div>
                </div>
                <div className={`p-4 rounded-lg shadow border flex flex-col items-center justify-center ${getRiskColorClasses(assessmentData.overallRiskRating)}`}>
                  {getRiskIcon(assessmentData.overallRiskRating)}
                  <div className="text-xl font-semibold mt-1">{assessmentData.overallRiskRating ?? 'N/A'}</div>
                  <div className="text-sm ">Overall Risk Rating (Score: {assessmentData.overallNumericRiskScore ?? 'N/A'})</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Section Breakdown & Detailed Review</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full" defaultValue={assessmentData.sections.map(s => s.id)}>
                  {assessmentData.sections.map((section) => (
                    <AccordionItem value={section.id} key={section.id} className="border rounded-md mb-3 overflow-hidden dark:border-gray-700">
                      <AccordionTrigger className={`text-lg font-semibold hover:bg-muted/50 p-4 data-[state=open]:bg-muted/60 ${getRiskColorClasses(section.areaRiskRating)} dark:hover:bg-muted/20 dark:data-[state=open]:bg-muted/30`}>
                        <div className="flex items-center justify-between w-full">
                          <span>{section.title}</span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRiskColorClasses(section.areaRiskRating)}`}>
                            {section.areaRiskRating || 'N/A'} (Avg: {section.averageRiskScore?.toFixed(2) || '0.00'}, Pts: {section.totalRiskPoints || 0})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <div className="accordion-content-wrapper"> 
                        <AccordionContent className="p-4 space-y-4 text-base border-t bg-background dark:bg-card dark:border-gray-700">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                              <p><strong>Total Risk Points:</strong> {section.totalRiskPoints?.toFixed(0) ?? 'N/A'}</p>
                              <p><strong>Avg. Risk Score:</strong> {section.averageRiskScore?.toFixed(2) ?? 'N/A'}</p>
                              <p><strong>Numeric Score:</strong> {section.numericRiskScore ?? 'N/A'}</p>
                              <p><strong>Area Rating:</strong> {section.areaRiskRating ?? 'N/A'}</p>
                              <p><strong>Applicable Qs:</strong> {section.scoringLogic.totalApplicableQuestions}</p>
                          </div>
                          
                          {section.questions.length > 0 && (
                            <div className="mt-4 pt-4 border-t dark:border-gray-700">
                              <h4 className="text-md font-semibold mb-3 text-foreground">Questions in this Section:</h4>
                              <ul className="space-y-3">
                                {section.questions.map((q) => {
                                  const userAnswer = answers[q.id];
                                  const answerValue = userAnswer?.value ?? 'Not Answered';
                                  const answerExplanation = userAnswer?.explanation;
                                  
                                  let questionRiskRating: HACTQuestionOption['riskAssessment'] | 'N/A' = 'N/A';
                                  let questionRiskPoints: number | string = 'N/A';
                                  let questionRiskClasses = getRiskColorClasses('N/A');

                                  if (userAnswer && q.options && userAnswer.value) {
                                    if (userAnswer.value === 'N/A' && q.options['N/A']) {
                                        questionRiskRating = q.options['N/A'].riskAssessment;
                                        questionRiskPoints = q.options['N/A'].points;
                                        questionRiskClasses = getRiskColorClasses(q.options['N/A'].riskAssessment);
                                    } else {
                                        const optionDetails = q.options[userAnswer.value as 'Yes'|'No'];
                                        if (optionDetails) {
                                          questionRiskRating = optionDetails.riskAssessment;
                                          questionRiskPoints = optionDetails.points;
                                          questionRiskClasses = getRiskColorClasses(optionDetails.riskAssessment);
                                        }
                                    }
                                  } else if (answerValue === 'Not Answered' && q.type !== 'info_only') {
                                    questionRiskRating = 'High'; // Assume highest risk for unanswered
                                    // Find points for highest risk option (usually 'No' or a default if No isn't present)
                                    questionRiskPoints = q.options?.No?.points || q.options?.Yes?.points || (q.isKeyQuestion ? 8 : 4) ; 
                                    questionRiskClasses = getRiskColorClasses('High');
                                  }

                                  if (q.type === 'info_only') return (
                                    <li key={`${section.id}-q-${q.id}`} className="p-3 border rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 shadow-sm">
                                      <p className="font-medium text-primary dark:text-primary-light">{q.id}. {q.text}</p>
                                      <p className="text-sm mt-1 italic">{q.infoContent || "Informational item."}</p>
                                    </li>
                                  );

                                  return (
                                    <li key={`${section.id}-q-${q.id}`} className={`p-3 border rounded-md shadow-sm ${answerValue === 'Not Answered' ? 'bg-gray-50 dark:bg-gray-800' : 'bg-background dark:bg-card'} dark:border-gray-700`}>
                                      <p className="font-medium text-primary dark:text-primary-light">{q.id}. {q.text}</p>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        CMS Answer: <span className="font-semibold">{answerValue}</span>
                                        {answerExplanation && <span className="text-xs block pl-4 italic mt-0.5">Explanation: {answerExplanation}</span>}
                                        {answerValue === 'Not Answered' && <Badge variant="outline" className="ml-2 border-destructive text-destructive dark:border-red-500 dark:text-red-400">Not Answered</Badge>}
                                      </p>
                                      <p className={`text-sm mt-1`}>
                                        Assessed Risk: <Badge variant="outline" className={`px-2 py-0.5 text-xs ${questionRiskClasses.split(' ')[0]} ${questionRiskClasses.split(' ')[1]} border-current`}>{questionRiskRating}</Badge>
                                        {(answerValue !== 'N/A' && answerValue !== 'Not Answered') && ` (Points: ${questionRiskPoints})`}
                                        {answerValue === 'Not Answered' && ` (Assumed Points: ${questionRiskPoints})`}
                                      </p>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </AccordionContent>
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Key Recommendations</CardTitle>
                <CardDescription>Actionable insights for Community Health Services (CMS) based on the assessment findings. AI-enhanced recommendations provide detailed guidance where applicable.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecs && <div className="flex items-center justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-3 text-lg">Generating tailored recommendations for CMS...</p></div>}
                {!isLoadingRecs && recommendations.length === 0 && <p className="text-muted-foreground">No specific recommendations generated, or all areas are assessed as low risk. Ensure all applicable questions were answered.</p>}
                {!isLoadingRecs && recommendations.length > 0 && (
                  <ul className="space-y-6">
                    {recommendations.map((rec, index) => (
                      <li key={`${rec.questionId}-${index}`} className="p-4 border rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow dark:bg-card dark:border-gray-700 dark:hover:shadow-primary/20">
                        <h4 className="font-semibold text-primary dark:text-primary-light text-lg mb-1">{rec.questionId}. {rec.questionText}</h4>
                        <p className="text-sm text-muted-foreground mb-2">CMS Answer: <span className="font-medium">{rec.userAnswer}</span> (Risk: <span className={`font-medium ${getRiskColorClasses(rec.risk as any).split(' ')[0]}`}>{rec.risk}</span>)</p>
                        <div className="mt-2 text-foreground prose prose-sm max-w-none prose-headings:text-primary prose-strong:text-foreground dark:prose-invert dark:prose-headings:text-primary-light dark:prose-strong:text-foreground">
                          <strong className="text-lg block mb-1">Recommendation for CMS:</strong>
                          <div dangerouslySetInnerHTML={{ __html: rec.recommendation.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br />') }} />
                        </div>
                        {rec.isAIR && <Badge variant="outline" className="mt-3 border-accent text-accent bg-accent/10 flex items-center gap-1.5 dark:border-accent-dark dark:text-accent-dark dark:bg-accent-dark/20"><BrainCircuit size={14} /> AI Enhanced Detailed Guidance</Badge>}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div> {/* End of reportRef div */}

      <CardFooter className="p-6 border-t flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 no-print dark:border-gray-700">
        <Button variant="outline" onClick={resetAssessment}>
          <RotateCcw className="mr-2 h-4 w-4" /> Start New Assessment
        </Button>
        <Button variant="default" onClick={handlePrintOrDownload}>
          <Printer className="mr-2 h-4 w-4" /> Print / Download PDF
        </Button>
      </CardFooter>
    </div>
  );
}
