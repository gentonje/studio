"use client";

import type { HACTQuestion, Answer } from '@/types';
import { useAssessment } from '@/hooks/useAssessment';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuestionRendererProps {
  question: HACTQuestion;
}

export default function QuestionRenderer({ question }: QuestionRendererProps) {
  const { answers, answerQuestion } = useAssessment();

  // Local state for the radio button's selection for the current view.
  const [currentViewRadioValue, setCurrentViewRadioValue] = useState<string | null | undefined>(undefined);
  // Local state for the explanation text for the current view.
  const [currentViewExplanationText, setCurrentViewExplanationText] = useState<string>('');

  // Effect to initialize/reset UI and global answer value when the question.id changes.
  useEffect(() => {
    const storedExplanation = answers[question.id]?.explanation || '';

    // Clear the global 'value' for this question when it becomes active,
    // but retain its existing explanation. This ensures getQuestionStatus
    // sees it as initially unanswered for navigation validation.
    answerQuestion(question.id, null, storedExplanation);

    // Reset local UI state for the new question
    setCurrentViewRadioValue(undefined); // Makes radio buttons appear unselected
    setCurrentViewExplanationText(storedExplanation); // Loads existing explanation into textarea

  }, [question.id, answerQuestion]); // Rerun when question.id changes. answerQuestion from context should be stable.

  // Effect to synchronize local explanationText if the global explanation for the *current* question
  // changes externally (e.g. if answers were reloaded or updated by another process).
  useEffect(() => {
    const globalExplanationForCurrentQuestion = answers[question.id]?.explanation || '';
    if (currentViewExplanationText !== globalExplanationForCurrentQuestion) {
      setCurrentViewExplanationText(globalExplanationForCurrentQuestion);
    }
  }, [answers[question.id]?.explanation, question.id]); // More targeted dependency

  const handleRadioSelectionChange = (newSelectedRadioValue: string) => {
    setCurrentViewRadioValue(newSelectedRadioValue);
    // Save with the new radio value and the current local explanation text
    answerQuestion(question.id, newSelectedRadioValue, currentViewExplanationText);
  };

  const handleExplanationInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newExplanation = e.target.value;
    setCurrentViewExplanationText(newExplanation);
    // When explanation changes, save it with the current view's radioValue.
    // If currentViewRadioValue is undefined (user hasn't clicked a radio in this view yet),
    // the global answer's value (which was set to null by the main useEffect) will be updated with null.
    answerQuestion(question.id, currentViewRadioValue ?? null, newExplanation);
  };

  // Update the explanation placeholder logic - this can largely remain the same
  let explanationPlaceholder = 'Provide details';

  let sampleExplanation = '';
  if (question.exampleComment) {
    sampleExplanation = question.exampleComment;
  }

  const renderQuestionContent = () => {
    if (question.type === 'info_only') {
      return (
        <div className="p-4 bg-secondary rounded-md text-secondary-foreground flex items-start gap-3">
          <Info size={24} className="flex-shrink-0 mt-1 text-primary"/>
          <p className="text-base">{question.infoContent || question.text}</p>
        </div>
      );
    }

    // Determine options for radio group if applicable
    let options: string[] = [];
    if (question.type === 'yes_no_na' || question.type === 'yes_no_explain' || question.type === 'yes_no_multi_explain') {
      options = ['Yes', 'No'];
      if (question.type === 'yes_no_na') options.push('N/A');
    }

    return (
      <div className="space-y-4">
        {options.length > 0 && (
          <RadioGroup
            value={currentViewRadioValue ?? undefined} // Use local state for value
            onValueChange={handleRadioSelectionChange} // Use new handler
            className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
          >
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-secondary transition-colors">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`} className="text-base cursor-pointer flex-grow">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        <div className="mt-4">
          <Label htmlFor={`${question.id}-explanation`} className="text-muted-foreground block mb-1">
            Explanation ({explanationPlaceholder}):
          </Label>
          <Textarea
            id={`${question.id}-explanation`}
            value={currentViewExplanationText} // Use local state for value
            onChange={handleExplanationInputChange} // Use new handler
            placeholder={explanationPlaceholder}
            rows={3}
            className="text-base"
          />
          {sampleExplanation && (
            <div className="mt-1 italic text-xs text-muted-foreground">
              Example: {sampleExplanation}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-6">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl md:text-2xl leading-tight">
            {question.text}
          </CardTitle>
          {question.isKeyQuestion && (
            <Badge variant="destructive" className="ml-2 flex-shrink-0 text-xs px-2 py-1">Key Question</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {renderQuestionContent()}
      </CardContent>
      {question.exampleComment && (
        <CardFooter className="p-6 bg-secondary/30 border-t">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-primary" />
            <div>
              <strong className="block mb-1">Example/Guidance:</strong>
              <p className="whitespace-pre-wrap">{question.exampleComment}</p>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}