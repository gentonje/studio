
import type { HACTAssessment } from '@/types';

export const initialAssessmentData: HACTAssessment = {
  assessmentTitle: "Micro-assessment workbook",
  sections: [
    {
      id: "1",
      title: "1. Implementing Partner",
      responsibleDepartment: "Senior Management, Legal/Compliance Department, Finance Department, Board of Directors.",
      questions: [
        {
          id: "1.1",
          text: "Is the IP legally registered? If so, is it in compliance with registration requirements? Please note the legal status and date of registration of the entity.",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Provide legal status, registration number, and date of registration." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain why not registered or non-compliant. State implications." }
          },
          exampleComment: "Community Health Services (CMS) is registered with the Republic of ExampleCountry, Ministry of Justice. Its registration number is CMS-REG-001 and the certificate of registration was issued on 15th Jan 2010. It also possesses a valid operational certificate from the NGO Board, renewed annually."
        },
        {
          id: "1.2",
          text: "If the IP received United Nations resources in the past, were significant issues reported in managing the resources, including from previous assurance activities?",
          isKeyQuestion: true,
          type: "yes_no_multi_explain", 
          options: {
            Yes: { riskAssessment: "Moderate", points: 4, promptForDetails: "Describe the significant issues reported, from which assurance activities/agencies, and corrective actions taken." },
            No: { riskAssessment: "Low", points: 1, promptForDetails: "Confirm if any UN resources received and if no issues were reported. Mention if no UN funds received previously." }
          },
          exampleComment: "CMS has received funding from UNDP (Project XYZ, 2018-2020) and UNICEF (Project ABC, 2021-Present). A 2019 UNDP spot check noted minor delays in financial reporting, which were subsequently addressed by implementing a new reporting calendar. No other significant issues reported."
        },
        {
          id: "1.3",
          text: "Does the IP have statutory reporting requirements? If so, are they in compliance with such requirements in the prior three fiscal years?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the statutory reporting requirements (e.g., annual returns, tax filings) and confirm compliance status with dates/references for the last 3 years." },
            No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain if not applicable or if there were any non-compliance issues, detailing reasons and corrective actions." }
          },
          exampleComment: "CMS is required to file annual returns with the NGO Board and tax returns with the ExampleCountry Revenue Authority. All filings are up-to-date for 2020, 2021, and 2022. Last NGO Board return filed on 30th March 2023 for FY2022."
        },
        {
          id: "1.4",
          text: "Does the governing body (e.g., Board of Directors) meet on a regular basis and perform oversight functions (review financial reports, approve budgets, strategic direction)?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe frequency of meetings, key oversight functions performed, and how meetings are documented (e.g., minutes)." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain the lack of regular meetings or oversight, and the implications for governance." }
          },
          exampleComment: "The CMS Board of Directors meets quarterly. Minutes are kept for all meetings. Key functions include approval of annual budgets, review of quarterly financial and programmatic reports, and strategic planning. Last meeting held on 15th June 2023."
        },
        {
          id: "1.5",
          text: "Does the IP have an anti-fraud and corruption policy? Is it communicated to staff and stakeholders?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm policy existence, date of last update, and methods of communication (e.g., staff handbook, website, training)." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain the absence of such a policy and plans to develop one." }
          },
          exampleComment: "CMS has an Anti-Fraud and Corruption Policy, last updated in Jan 2023. It's included in the staff induction package, available on the internal shared drive, and annual refresher training is conducted."
        },
         {
          id: "1.6",
          text: "Has the IP advised employees, beneficiaries and other recipients to whom they should report if they suspect fraud, waste or misuse of agency resources or property? If so, does the IP have a policy against retaliation relating to such reporting (whistle-blower protection)?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the reporting channels and the whistle-blower protection mechanisms in place." },
            No: { riskAssessment: "High", points: 6, defaultExplanationPlaceholder: "Explain the absence of clear reporting channels or a whistle-blower policy." }
          },
          exampleComment: "CMS has a confidential reporting hotline managed by an independent third party. The whistle-blower protection policy is part of the Anti-Fraud policy and ensures no retaliation against those reporting in good faith."
        }
      ],
      scoringLogic: {
        totalQuestions: 6,
        totalKey: 5, 
        ratingThresholds: [ // Example thresholds
          { maxPoints: 6, score: 1, rating: "Low" }, // All 'Yes' to key questions
          { maxPoints: 12, score: 2, rating: "Moderate" },
          { maxPoints: 20, score: 3, rating: "Significant" },
          { minPoints: 21, score: 4, rating: "High" }
        ]
      }
    },
    {
      id: "2",
      title: "2. Programme Management",
      responsibleDepartment: "Programme/Project Management Department, Monitoring & Evaluation (M&E) Unit, Field Operations.",
      questions: [
        {
          id: "2.1",
          text: "Does the IP have a documented programme/project management framework or guidelines outlining procedures for planning, implementation, monitoring, and reporting?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe or reference the framework/guidelines and its key components. Confirm it is regularly updated and used." },
            No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain the absence of a documented framework or if it's outdated/not used." }
          },
          exampleComment: "CMS has a comprehensive Programme Operations Manual (POM) last updated in Feb 2023. The POM covers the entire project cycle from design, planning, implementation, M&E, to closure and reporting."
        },
         {
          id: "2.2",
          text: "Are work plans prepared for all projects, detailing activities, responsibilities, timelines, budgets, and expected results/outputs/outcomes? Are these regularly updated and monitored against?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the work plan preparation process, update frequency, and how progress is tracked. Provide an example structure if possible." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain why work plans are not consistently prepared, updated, or monitored, or detail deficiencies in the current process." }
          },
          exampleComment: "Detailed annual and quarterly work plans are developed for each project using a standard template that links activities to budget lines and logframe indicators. Progress is reviewed monthly by project managers and quarterly with senior management."
        },
        {
          id: "2.3",
          text: "Does the IP have a system for monitoring project progress against work plans and targets, and for taking corrective actions when necessary?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the monitoring system, tools used (e.g., M&E plan, progress reports, field visits), and how corrective actions are identified, implemented, and tracked." },
            No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain the weaknesses or absence of a systematic monitoring and corrective action process." }
          },
          exampleComment: "CMS uses a results-based M&E system. Monthly progress reports track output indicators. Quarterly review meetings analyze performance against targets and identify deviations, leading to documented corrective action plans."
        },
        {
          id: "2.4",
          text: "Does the IP identify potential risks for programme delivery (e.g., operational, financial, contextual) and establish mechanisms to mitigate them?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the risk identification process (e.g., risk register, regular risk assessments) and examples of mitigation strategies employed." },
            No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain the absence of a formal risk management process for programmes." }
          },
          exampleComment: "Each project proposal includes a risk assessment matrix. A central risk register is maintained by the M&E unit and reviewed quarterly. For instance, to mitigate security risks in field operations, CMS coordinates with local authorities and has contingency plans."
        }
      ],
      scoringLogic: {
        totalQuestions: 4,
        totalKey: 3,
        ratingThresholds: [
          { maxPoints: 4, score: 1, rating: "Low" }, 
          { maxPoints: 8, score: 2, rating: "Moderate" }, 
          { maxPoints: 12, score: 3, rating: "Significant" }, 
          { minPoints: 13, score: 4, rating: "High" }
        ]
      }
    },
    {
      id: "3",
      title: "3. Organizational Structure and Staffing",
      responsibleDepartment: "Human Resources Department, Senior Management, Finance Department.",
      questions: [
        {
          id: "3.1",
          text: "Does the IP have clearly defined job descriptions for all positions, outlining responsibilities, required qualifications, and reporting lines?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm job descriptions are up-to-date and provided to all staff." },
            No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain if JDs are missing, outdated, or not comprehensive." }
          },
          exampleComment: "CMS maintains up-to-date job descriptions for all positions. These are reviewed annually and during recruitment. Each staff member receives a copy of their JD upon hiring."
        },
        {
          id: "3.2",
          text: "Is the organizational structure of the finance and programme management departments, and competency of staff, appropriate for the complexity of the IP and the scale of activities?",
          isKeyQuestion: true,
          type: "yes_no_multi_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, promptForDetails: "Briefly describe the structure and confirm staff possess relevant qualifications and experience for their roles." },
            No: { riskAssessment: "Significant", points: 6, promptForDetails: "Identify gaps in structure, staffing levels, or competencies and their impact on operations." }
          },
          exampleComment: "The Finance department is led by a qualified Chief Financial Officer (CPA) with 3 accountants. The Programme department has 3 Project Managers (PMP certified) overseeing respective thematic areas. Staff possess relevant degrees and experience. The structure is adequate for current project portfolio of approx $2M annually."
        },
        {
          id: "3.3",
          text: "Does the IP perform background verification/checks on all new accounting/finance and key management positions (e.g., reference checks, qualification verification)?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the background check process and what it typically includes." },
            No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain the absence of background checks and the associated risks." }
          },
          exampleComment: "CMS conducts reference checks for all shortlisted candidates for finance and management roles. Educational qualifications are verified with issuing institutions for successful candidates before an offer is made."
        }
      ],
      scoringLogic: {
        totalQuestions: 3,
        totalKey: 3,
        ratingThresholds: [
          { maxPoints: 3, score: 1, rating: "Low" },
          { maxPoints: 7, score: 2, rating: "Moderate" }, // e.g., one No (3 or 4)
          { maxPoints: 10, score: 3, rating: "Significant" }, // e.g., one No (6)
          { minPoints: 11, score: 4, rating: "High" } // e.g. two No (6+4)
        ]
      }
    },
    {
      id: "4",
      title: "4. Accounting Policies and Procedures - Key Aspects",
      responsibleDepartment: "Finance Department, Internal Audit (if applicable), Senior Management.",
      questions: [
        {
          id: "4.1",
          text: "Does the IP have an accounting system (manual or computerized) that allows for proper recording of financial transactions, including allocation of expenditures in accordance with respective components, disbursement categories, and sources of funds?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the accounting system (e.g., QuickBooks, Excel-based with controls) and confirm its capability to track project-specific expenditures and donor funds separately." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain the limitations of the current system or if transactions are not properly recorded/allocated." }
          },
          exampleComment: "CMS uses QuickBooks Premier, configured with project codes and donor fund tracking. This allows for detailed reporting per project and donor, ensuring expenditures are allocated correctly."
        },
        {
          id: "4.2",
          text: "Are all accounting and supporting documents (invoices, receipts, bank statements, contracts, etc.) retained in an organized system (physical or electronic) that allows authorized users easy access and ensures proper audit trail?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the filing system, retention policy, and how documents are organized (e.g., by project, date, voucher number)." },
            No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain deficiencies in document retention, organization, or accessibility." }
          },
          exampleComment: "All financial documents are scanned and stored electronically on a secure server with daily backups, and physical copies are filed by voucher number within project-specific folders. Documents are retained for 7 years as per policy."
        },
        {
          id: "4.3",
          text: "Are the functions of ordering, receiving, accounting for, and paying for goods and services appropriately segregated to prevent error and fraud?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe how these key duties are segregated among different individuals or departments." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Identify areas where segregation is lacking and what compensating controls, if any, are in place." }
          },
          exampleComment: "Procurement initiates orders, Logistics confirms receipt of goods/services, Accounts Payable processes invoices against POs and GRNs, and payments are authorized by Finance Manager & Executive Director (dual signatories). These functions are performed by different staff members."
        },
        {
          id: "4.4",
          text: "Are bank reconciliations prepared for all bank accounts at least monthly by individuals independent of those who make or approve payments or record cash transactions? Are reconciling items investigated and cleared promptly?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm frequency, independence of preparer/reviewer, and process for follow-up on reconciling items." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain if bank reconciliations are not done, not done timely, lack independence, or if reconciling items are not cleared." }
          },
          exampleComment: "Monthly bank reconciliations for all 3 bank accounts are prepared by a Finance Officer who is not involved in payment processing or cash book entries. Reconciliations are reviewed and signed off by the CFO. All reconciling items older than 30 days are investigated and documented."
        }
      ],
      scoringLogic: {
        totalQuestions: 4,
        totalKey: 4,
        ratingThresholds: [
          { maxPoints: 4, score: 1, rating: "Low" },
          { maxPoints: 10, score: 2, rating: "Moderate" },
          { maxPoints: 18, score: 3, rating: "Significant" },
          { minPoints: 19, score: 4, rating: "High" }
        ]
      }
    }
    // Existing Sections 3, 4, 5 (Financial Management, Procurement, HR) are effectively expanded/merged into the new structure above.
    // More sections like Fixed Assets, Financial Reporting, Procurement in detail can be added following this pattern.
  ]
};

    