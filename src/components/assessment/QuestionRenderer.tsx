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
  const currentAnswer = answers[question.id] || { value: null, explanation: '' };

  const handleValueChange = (value: 'Yes' | 'No' | 'N/A' | string) => {
    answerQuestion(question.id, value, currentAnswer.explanation);
  };

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    answerQuestion(question.id, currentAnswer.value, e.target.value);
  };

  // Update the explanation placeholder logic
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
            value={currentAnswer.value ?? undefined}
            onValueChange={(val) => handleValueChange(val as 'Yes' | 'No' | 'N/A')}
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
            value={currentAnswer.explanation || ''}
            onChange={handleExplanationChange}
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