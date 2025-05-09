
import type { HACTAssessment } from '@/types';

export const initialAssessmentData: HACTAssessment = {
  assessmentTitle: "Micro-assessment workbook",
  sections: [
    {
      id: "1",
      title: "1. Implementing Partner",
      responsibleDepartment: "Senior Management, Legal/Compliance Department, Finance Department.",
      questions: [
        {
          id: "1.1",
          text: "Is the IP legally registered? If so, is it in compliance with registration requirements? Please note the legal status and date of registration of the entity.",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Provide legal status and date of registration..." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain why not registered or non-compliant..." }
          },
          exampleComment: "Community Health Services (CMS) is registered with the Republic of South Sudan... Its registration number is 2225 and the certificate of registration was issued on 28th July 2015. It also possesses a valid NGO operation certificate..."
        },
        {
          id: "1.2",
          text: "If the IP received United Nations resources in the past, were significant issues reported in managing the resources, including from previous assurance activities.",
          isKeyQuestion: true,
          type: "yes_no_multi_explain", // Similar to yes_no_explain for now
          options: {
            Yes: { riskAssessment: "Moderate", points: 4, promptForDetails: "Describe the significant issues reported and from which assurance activities/agencies." },
            No: { riskAssessment: "Low", points: 1, promptForDetails: "Confirm if any UN resources received and if no issues were reported." }
          },
          exampleComment: "The IP has in the past received funding from United Nations agencies. For example;\nUNDP\nProject number: 00094767...\nUNICEF\nProject code: EAD...\nWe were unable to confirm whether there were any significant issues reported in managing resources as Community Health Services (CMS) has never been audited."
        },
        {
          id: "1.3",
          text: "Does the IP have a clear organizational chart correctly reflecting the existing functions and reporting lines?",
          isKeyQuestion: true,
          type: "yes_no_na",
          options: {
            Yes: { riskAssessment: "Low", points: 1 },
            No: { riskAssessment: "Moderate", points: 3 },
            'N/A': { riskAssessment: "N/A", points: 0 }
          }
        }
      ],
      scoringLogic: {
        totalQuestions: 3, // Update as more questions are added
        totalKey: 3, // Update as more questions are added
        ratingThresholds: [
          { maxPoints: 3, score: 1, rating: "Low" }, // Example: 3 questions, all 'Yes' and Low risk = 3 points
          { maxPoints: 8, score: 2, rating: "Moderate" },
          { maxPoints: 15, score: 3, rating: "Significant" },
          { minPoints: 16, score: 4, rating: "High" }
        ]
      }
    },
    {
      id: "2",
      title: "2. Programme Management",
      responsibleDepartment: "Programme/Project Management Department, Monitoring & Evaluation (M&E) Unit.",
      questions: [
        {
          id: "2.1",
          text: "Does the IP have a documented programme/project management framework or guidelines outlining procedures for planning, implementation, monitoring, and reporting?",
          isKeyQuestion: true,
          type: "yes_no_na",
          options: {
            Yes: { riskAssessment: "Low", points: 1 },
            No: { riskAssessment: "Moderate", points: 4 },
            'N/A': { riskAssessment: "N/A", points: 0 }
          }
        },
         {
          id: "2.2",
          text: "Are work plans prepared and regularly updated, detailing activities, responsibilities, timelines, and expected outputs/outcomes for projects funded by UN agencies?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the process for work plan preparation and updates." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain why work plans are not prepared or updated." }
          }
        }
      ],
      scoringLogic: {
        totalQuestions: 2,
        totalKey: 2,
        ratingThresholds: [
          { maxPoints: 2, score: 1, rating: "Low" },
          { maxPoints: 5, score: 2, rating: "Moderate" },
          { maxPoints: 10, score: 3, rating: "Significant" },
          { minPoints: 11, score: 4, rating: "High" }
        ]
      }
    }
    // Additional sections will be added here
  ]
};
