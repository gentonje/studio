"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAssessment } from '@/hooks/useAssessment';
import QuestionRenderer from '@/components/assessment/QuestionRenderer';
import QuestionNavigation from '@/components/assessment/QuestionNavigation';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, UserCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label'; // Added import for Label

export default function AssessmentSectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params.sectionId as string;

  const { 
    organizationName, 
    currentSectionId,
    assessmentData, 
    getCurrentSection, 
    getCurrentQuestion,
    calculateSectionScore,
    currentQuestionIndexInSection,
    answers
  } = useAssessment();

  useEffect(() => {
    if (!organizationName) {
      router.push('/'); // Redirect to welcome if no org name
    }
  }, [organizationName, router]);
  
  // Effect to calculate section score when moving away or answers change for the current section
  useEffect(() => {
    if (currentSectionId) {
      calculateSectionScore(currentSectionId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, currentSectionId, calculateSectionScore]);


  const section = getCurrentSection();
  const question = getCurrentQuestion();

  if (!organizationName) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading assessment...</p>
      </div>
    );
  }
  
  if (!section || !question) {
    // This might happen if sectionId is invalid or context is not ready
    // Or if navigating directly to a section without starting assessment
    // A robust solution would involve checking currentSectionId in context and redirecting if mismatched
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Assessment section or question not found. Please start the assessment from the beginning.
        </AlertDescription>
      </Alert>
    );
  }
  
  const progressPercentage = section.questions.length > 0 ? ((currentQuestionIndexInSection + 1) / section.questions.length) * 100 : 0;
  const overallProgress = assessmentData.sections.length > 0 ? ((assessmentData.sections.findIndex(s => s.id === section.id) + 1) / assessmentData.sections.length) * 100 : 0;


  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="mb-8 shadow-md">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-2xl md:text-3xl text-primary">{section.title}</CardTitle>
                <div className="text-sm text-muted-foreground font-medium px-3 py-1.5 bg-secondary rounded-md">
                    Overall Progress: {assessmentData.sections.findIndex(s => s.id === section.id) + 1} of {assessmentData.sections.length} sections
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Organization: {organizationName}</h3>
            </div>
            <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-700">
                <UserCheck className="h-5 w-5 text-blue-500" />
                <AlertTitle className="font-semibold text-blue-800">Responsible Department(s)</AlertTitle>
                <AlertDescription className="text-blue-700">
                {section.responsibleDepartment}
                </AlertDescription>
            </Alert>
            <div className="space-y-2">
                <Label htmlFor="section-progress" className="text-sm text-muted-foreground">
                Section Progress: Question {currentQuestionIndexInSection + 1} of {section.questions.length}
                </Label>
                <Progress value={progressPercentage} id="section-progress" className="w-full h-3" />
            </div>
        </CardContent>
      </Card>

      <QuestionRenderer question={question} />
      <QuestionNavigation />
    </div>
  );
}
