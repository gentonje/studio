"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initialAssessmentData } from '@/lib/assessmentData'; // Import initial data
import Image from 'next/image';

export default function WelcomePage() {
  const [orgName, setOrgName] = useState('');
  const { setOrganizationName, startAssessment, assessmentData } = useAssessment();
  const router = useRouter();

  const handleStartAssessment = () => {
    if (orgName.trim() === '') {
      alert('Please enter an organization name.'); // Replace with ShadCN toast later
      return;
    }
    setOrganizationName(orgName);
    // Start assessment with the first section ID from the current assessmentData
    if (assessmentData.sections.length > 0) {
      startAssessment(initialAssessmentData, assessmentData.sections[0].id); // Use initialAssessmentData to ensure fresh start
    } else {
      alert('No assessment sections found.'); // Should not happen with current setup
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
             <Image src="https://picsum.photos/120/120" alt="HACT Logo" width={100} height={100} className="rounded-full" data-ai-hint="assessment finance" />
          </div>
          <CardTitle className="text-3xl font-bold">HACT</CardTitle>
          <CardDescription>Harmonized Approach to Cash Transfers. Streamline your micro-assessment process.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-lg">Organization Name</Label>
            <Input
              id="organizationName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter the name of the organization"
              className="text-base"
            />
          </div>
          <Button onClick={handleStartAssessment} className="w-full text-lg py-3">
            Start Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
