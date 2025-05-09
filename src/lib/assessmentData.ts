
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
          type: "yes_no_multi_explain", 
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
        totalQuestions: 3,
        totalKey: 3, 
        ratingThresholds: [
          { maxPoints: 3, score: 1, rating: "Low" }, 
          { maxPoints: 6, score: 2, rating: "Moderate" }, // e.g. One No on Q1.3 (3) + two Yes (1+1)=5
          { maxPoints: 12, score: 3, rating: "Significant" },// e.g. One No on Q1.1 (8) + two Yes (1+1)=10
          { minPoints: 13, score: 4, rating: "High" }
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
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe or reference the framework/guidelines." },
            No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain the absence of a documented framework." }
          },
          exampleComment: "CMS has a Programme Operations Manual that includes sections on project cycle management, M&E, and reporting. Last updated Jan 2023."
        },
         {
          id: "2.2",
          text: "Are work plans prepared and regularly updated, detailing activities, responsibilities, timelines, and expected outputs/outcomes for projects funded by UN agencies?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the process for work plan preparation and updates. Attach an example if possible." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain why work plans are not prepared or updated, or the deficiencies in the current process." }
          },
          exampleComment: "For each UN-funded project, a detailed work plan is developed using a standard template. These are reviewed quarterly with the UN agency focal point."
        },
        {
          id: "2.3",
          text: "Does the IP have a system for monitoring project progress against work plans and targets, and for taking corrective actions when necessary?",
          isKeyQuestion: true,
          type: "yes_no_na",
          options: {
            Yes: { riskAssessment: "Low", points: 1 },
            No: { riskAssessment: "Moderate", points: 4 },
            'N/A': { riskAssessment: "N/A", points: 0 }
          },
          exampleComment: "Monitoring is done via monthly progress reports, quarterly review meetings, and field visits. A risk log is maintained for tracking issues and corrective actions."
        }
      ],
      scoringLogic: {
        totalQuestions: 3,
        totalKey: 3,
        ratingThresholds: [
          { maxPoints: 3, score: 1, rating: "Low" }, // 3*1
          { maxPoints: 7, score: 2, rating: "Moderate" }, // e.g., One No (4 points) + two Yes (1+1) = 6
          { maxPoints: 12, score: 3, rating: "Significant" }, // e.g., One No (6 points) + two Yes (1+1) + one No (4) = 12 (or one No 6pts + two Yes 1+1 = 8, one No 4pts + two Yes 1+1 = 6)
          { minPoints: 13, score: 4, rating: "High" } // e.g., Two No (4+6) + one Yes (1) = 11 - check logic. Should be (4+4+6=14)
        ]
      }
    },
    {
      id: "3",
      title: "3. Financial Management & Internal Controls",
      responsibleDepartment: "Finance Department, Internal Audit (if applicable), Senior Management.",
      questions: [
        {
          id: "3.1",
          text: "Does the IP have a documented accounting policies and procedures manual, which is up-to-date and consistently applied?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm date of last update and how its application is ensured." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain the absence or deficiencies of the manual." }
          },
          exampleComment: "CMS has a Financial Management Manual, last revised in December 2022. Regular internal spot-checks ensure adherence."
        },
        {
          id: "3.2",
          text: "Is there adequate segregation of duties in financial transaction processing (e.g., authorization, recording, custody of assets, reconciliation)?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe key segregation of duties in place (e.g., payments, payroll)." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Identify areas where segregation of duties is lacking and the risks involved." }
          },
          exampleComment: "Authorization of payments is done by the Finance Manager, recording by the Accountant, and bank reconciliations by a separate Finance Officer. For smaller field offices with limited staff, compensating controls are in place."
        },
        {
          id: "3.3",
          text: "Are bank reconciliations performed regularly (at least monthly) by someone independent of cash handling and recording functions?",
          isKeyQuestion: true,
          type: "yes_no_na",
          options: {
            Yes: { riskAssessment: "Low", points: 1 },
            No: { riskAssessment: "Moderate", points: 4 },
            'N/A': { riskAssessment: "N/A", points: 0 }
          },
           exampleComment: "Bank reconciliations for all accounts are prepared monthly by the Finance Officer and reviewed by the Finance Manager."
        }
      ],
      scoringLogic: {
        totalQuestions: 3,
        totalKey: 3,
        ratingThresholds: [
          { maxPoints: 3, score: 1, rating: "Low" },
          { maxPoints: 9, score: 2, rating: "Moderate" }, // e.g., One No (4pts or 6pts) + two Yes (1+1)
          { maxPoints: 15, score: 3, rating: "Significant" }, // e.g., One No (8pts) + two Yes (1+1) = 10; or Two No (4+6) + one Yes (1) = 11
          { minPoints: 16, score: 4, rating: "High" }
        ]
      }
    },
    {
        id: "4",
        title: "4. Procurement & Asset Management",
        responsibleDepartment: "Procurement Unit, Logistics Department, Finance Department, Administration.",
        questions: [
          {
            id: "4.1",
            text: "Does the IP have a documented procurement policy and procedures manual that ensures transparency, competition, and value for money?",
            isKeyQuestion: true,
            type: "yes_no_explain",
            options: {
              Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm if aligned with donor requirements (e.g. UN agency procurement rules)." },
              No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain the absence or inadequacy of the procurement manual." }
            },
            exampleComment: "CMS has a Procurement Manual aligned with general public procurement principles. It includes thresholds for different procurement methods (e.g. RFQ, ITB)."
          },
          {
            id: "4.2",
            text: "Is there an up-to-date inventory register of assets (equipment, vehicles, etc.) purchased with UN funds, and are physical verifications conducted periodically?",
            isKeyQuestion: true,
            type: "yes_no_explain",
            options: {
              Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the asset register and frequency of physical verification." },
              No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain the absence of an asset register or physical verification process." }
            },
            exampleComment: "An asset register is maintained in Excel, updated upon new acquisitions or disposals. Physical verification is conducted annually."
          }
        ],
        scoringLogic: {
          totalQuestions: 2,
          totalKey: 2,
          ratingThresholds: [
            { maxPoints: 2, score: 1, rating: "Low" }, // 2*1
            { maxPoints: 6, score: 2, rating: "Moderate" }, // One No (4pts) + one Yes (1) = 5
            { maxPoints: 10, score: 3, rating: "Significant" }, // One No (8pts) + one Yes (1) = 9
            { minPoints: 11, score: 4, rating: "High" } // Both No (8+4)=12
          ]
        }
    },
    {
        id: "5",
        title: "5. Human Resources",
        responsibleDepartment: "Human Resources Department, Senior Management.",
        questions: [
          {
            id: "5.1",
            text: "Does the IP have documented HR policies and procedures covering recruitment, contracting, performance appraisal, payroll, and disciplinary actions?",
            isKeyQuestion: true,
            type: "yes_no_explain",
            options: {
              Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm if policies are consistently applied and staff are aware." },
              No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain gaps in HR policies or their application." }
            },
            exampleComment: "CMS has an HR Manual covering key aspects. Staff receive a copy upon induction."
          },
          {
            id: "5.2",
            text: "Are payroll processes well-controlled, including authorization of new staff, changes to salaries, and disbursement of salaries?",
            isKeyQuestion: true,
            type: "yes_no_na",
            options: {
              Yes: { riskAssessment: "Low", points: 1 },
              No: { riskAssessment: "Significant", points: 6 },
              'N/A': { riskAssessment: "N/A", points: 0 }
            },
            exampleComment: "Payroll is prepared by HR, reviewed by Finance, and approved by the Director. Salaries are paid via bank transfer."
          }
        ],
        scoringLogic: {
          totalQuestions: 2,
          totalKey: 2,
          ratingThresholds: [
            { maxPoints: 2, score: 1, rating: "Low" },
            { maxPoints: 5, score: 2, rating: "Moderate" }, // One No (4pts) + one Yes (1) = 5
            { maxPoints: 8, score: 3, rating: "Significant" }, // One No (6pts) + one Yes (1) = 7
            { minPoints: 9, score: 4, rating: "High" } // Both No (4+6)=10
          ]
        }
    }
  ]
};

    