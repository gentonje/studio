"use client";

import { Button } from '@/components/ui/button';
import { useAssessment } from '@/hooks/useAssessment';
import { ChevronLeft, ChevronRight, CheckSquare, ListChecks } from 'lucide-react';

interface QuestionNavigationProps {
  onSaveAndExit?: () => void; // Future feature
}

export default function QuestionNavigation({ onSaveAndExit }: QuestionNavigationProps) {
  const { 
    currentQuestionIndexInSection, 
    navigateToNextQuestion, 
    navigateToPrevQuestion,
    navigateToNextSection,
    getCurrentSection,
    assessmentData
  } = useAssessment();

  const section = getCurrentSection();
  if (!section) return null;

  const isFirstQuestion = currentQuestionIndexInSection === 0;
  const isLastQuestionInSection = currentQuestionIndexInSection === section.questions.length - 1;
  
  const currentSectionIndex = assessmentData.sections.findIndex(s => s.id === section.id);
  const isLastSection = currentSectionIndex === assessmentData.sections.length - 1;

  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <Button 
        variant="outline" 
        onClick={navigateToPrevQuestion} 
        disabled={isFirstQuestion}
        className="w-full sm:w-auto"
      >
        <ChevronLeft className="mr-2 h-5 w-5" /> Previous Question
      </Button>
      
      {isLastQuestionInSection ? (
        isLastSection ? (
          <Button 
            onClick={() => navigateToNextSection()} // This will navigate to summary
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            View Summary <ListChecks className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button 
            onClick={() => navigateToNextSection()}
            className="w-full sm:w-auto"
          >
            Next Section <CheckSquare className="ml-2 h-5 w-5" />
          </Button>
        )
      ) : (
        <Button 
          onClick={navigateToNextQuestion}
          disabled={isLastQuestionInSection && isLastSection} // Effectively, only disabled if logic error
          className="w-full sm:w-auto"
        >
          Next Question <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      )}
    </div>
  );
}