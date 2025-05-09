
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
          type: "yes_no_na",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Provide legal status, registration number, and date of registration." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain why not registered or non-compliant. State implications." },
            'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "Explain if not applicable for this IP." }
          },
          exampleComment: "Community Health Services (CMS) is registered with the Republic of South Sudan, Ministry of Justice... Its registration number is 2225 and the certificate of registration was issued on 28th July 2015..."
        },
        {
          id: "1.2",
          text: "If the IP received United Nations resources in the past, were significant issues reported in managing the resources, including from previous assurance activities?",
          isKeyQuestion: true,
          type: "yes_no_na",
          options: {
            Yes: { riskAssessment: "Moderate", points: 4, promptForDetails: "Describe the significant issues reported, from which assurance activities/agencies, and corrective actions taken." },
            No: { riskAssessment: "Low", points: 1, promptForDetails: "Confirm if any UN resources received and if no issues were reported. Mention if no UN funds received previously." },
            'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "Explain if CMS has not received UN resources." }
          },
          exampleComment: "The IP has in the past received funding from United Nations agencies... UNDP Project number: 00094767... UNICEF Project code: EAD... We were unable to confirm whether there were any significant issues... as CMS has never been audited."
        },
        {
          id: "1.3",
          text: "Does the IP have statutory reporting requirements? If so, are they in compliance with such requirements in the prior three fiscal years?",
          isKeyQuestion: false,
          type: "yes_no_na",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the statutory reporting requirements and confirm compliance status." },
            No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain if not applicable or if there were non-compliance issues." },
            'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "Explain if not applicable for CMS." }
          },
          exampleComment: "The IP complies with statutory requirements set out in the Non - Governmental Organizations Act, 2003."
        },
        {
          id: "1.4",
          text: "Does the governing body meet on a regular basis and perform oversight functions?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe frequency of meetings and key oversight functions performed." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain the lack of regular meetings or oversight." }
          },
          exampleComment: "As per Article VII of CMS constitution, an annual meeting (general) shall be held... We obtained the meeting minutes and noted that they were held annually."
        },
        {
          id: "1.5",
          text: "If any other offices/ external entities participate in implementation, does the IP have policies and process to ensure appropriate oversight and monitoring of implementation?",
          isKeyQuestion: false, 
          type: "yes_no_na",
          options: {
            Yes: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Describe policies, processes for oversight, and how monitoring is conducted." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of policies/processes for oversight of external entities/offices." },
            'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "Explain if not applicable for CMS (e.g., no external entities)." }
          },
          exampleComment: "The IP operates two field offices in kapoeta north and east. There are no specific reporting/monitoring timelines... monitoring is based on the level of activities."
        },
        {
          id: "1.6",
          text: "Does the IP show basic financial stability in-country (core resources; funding trend)? Provide the amount of total assets, total liabilities, income and expenditure for the current and prior three fiscal years.",
          isKeyQuestion: true,
          type: "yes_no_explain", 
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Provide financial figures and explain trends supporting stability." },
            No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of financial stability or inability to provide figures." }
          },
          exampleComment: "We could not ascertain if the IP has basic financial stability... it does not prepare annual financial reports and has also never been audited."
        },
        {
          id: "1.7",
          text: "Can the IP easily receive funds? Have there been any major problems in the past in the receipt of funds, particularly where the funds flow from government ministries?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Confirm ease of receiving funds and describe any past problems." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain difficulties in receiving funds." }
          },
          exampleComment: "CMS can easily receive funds through its operational bank account... We could not confirm if there have been any problems in the past... as the IP has never been assessed or audited."
        },
        {
          id: "1.8",
          text: "Does the IP have any pending legal actions against it or outstanding material/significant disputes with vendors/contractors? If so, provide details and actions taken by the IP to resolve the legal action.",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Provide details of pending actions/disputes and resolution steps." },
            No: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm no pending legal actions or significant disputes." }
          },
          exampleComment: "The IP does not have any pending legal actions against it or outstanding material/significant disputes with vendors/contractors."
        },
        {
          id: "1.9",
          text: "Does the IP have an anti-fraud and corruption policy?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm policy existence, date of last update, and communication methods." },
            No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain the absence of such a policy." }
          },
          exampleComment: "The IP does not have an anti-fraud and corruption policy."
        },
        {
          id: "1.10",
          text: "Has the IP advised employees, beneficiaries and other recipients to whom they should report if they suspect fraud, waste or misuse of agency resources or property? If so, does the IP have a policy against retaliation relating to such reporting?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe reporting channels and whistle-blower protection." },
            No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain absence of clear reporting channels or whistle-blower policy." }
          },
          exampleComment: "No evidence was provided for advising employees, beneficiaries and other recipients to whom they should report if they suspected fraud."
        },
        {
          id: "1.11",
          text: "Does the IP have any key financial or operational risks that are not covered by this questionnaire? If so, please describe. Examples: foreign exchange risk; cash receipts.",
          isKeyQuestion: false,
          type: "yes_no_explain", 
          options: {
            Yes: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Describe other key financial or operational risks." },
            No: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm no other significant uncovered risks." }
          },
          exampleComment: "The IP majorly depends on donations and donor funding... staff salaries are scaled down... Executive Director... very dominant in all its operations..."
        }
      ],
      scoringLogic: {
        totalQuestions: 11,
        totalApplicableQuestions: 11, // This should be dynamically calculated if Qs can be N/A and excluded. For HACT, usually all are applicable.
        totalKey: 5, // Number of questions where isKeyQuestion is true
        ratingThresholds: [ // Based on sample OPRD calculation, average score = total points / total applicable Qs
          { maxAverageScore: 2.204, numericScore: 1, rating: "Low" },
          { minAverageScore: 2.205, maxAverageScore: 3.408, numericScore: 2, rating: "Moderate" },
          { minAverageScore: 3.409, maxAverageScore: 4.613, numericScore: 3, rating: "Significant" },
          { minAverageScore: 4.614, numericScore: 4, rating: "High" }
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
          text: "Does the IP have and use sufficiently detailed written policies, procedures and other tools (e.g. project development checklist, work planning templates, work planning schedule) to develop programmes and plans?",
          isKeyQuestion: true, 
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe or reference the tools and confirm regular use." },
            No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain absence or non-use of such tools." }
          },
          exampleComment: "The IP have and use sufficiently detailed written policies, procedures and other tools."
        },
        {
          id: "2.2",
          text: "Do work plans specify expected results and the activities to be carried out to achieve results, with a time frame and budget for the activities?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm work plans include all these elements." },
            No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain what is missing from work plans." }
          },
          exampleComment: "The work plans do not specify expected results and the activities to be carried out to achieve results, with a time frame and budget for the activities."
        },
        {
          id: "2.3",
          text: "Does the IP identify the potential risks for programme delivery and mechanisms to mitigate them?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe risk identification and mitigation process." },
            No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain absence of risk management for programmes." } 
          },
          exampleComment: "The IP does not identify the potential risks for programme delivery and mechanisms to mitigate them."
        },
        {
          id: "2.4",
          text: "Does the IP have and use sufficiently detailed policies, procedures, guidelines and other tools (checklists, templates) for monitoring and evaluation?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Describe M&E tools and confirm usage. Explain if usage is inconsistent." }, 
            No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain absence or non-use of M&E tools." }
          },
          exampleComment: "The IP has sufficiently detailed policies, procedures, guidelines and other tools (checklists, templates) for monitoring and evaluation but does not use them."
        },
        {
          id: "2.5",
          text: "Does the IP have M&E frameworks for its programmes, with indicators, baselines, and targets to monitor achievement of programme results?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Describe M&E frameworks and confirm if used effectively." }, 
            No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain absence of M&E frameworks." }
          },
          exampleComment: "The IP has M&E frameworks for its programmes... However we were not availed with evidence where the framework was used."
        },
        {
          id: "2.6",
          text: "Does the IP carry out and document regular monitoring activities such as review meetings, on-site project visits, etc.",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe monitoring activities and documentation." },
            No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain lack of regular documented monitoring." }
          },
          exampleComment: "We noted that narrative reports are prepared and photographic evidence maintained after review meetings and on-site project visits."
        },
        {
          id: "2.7",
          text: "Does the IP systematically collect, monitor and evaluate data on the achievement of project results?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Describe data collection and evaluation process." }, 
            No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of systematic data collection and evaluation." }
          },
          exampleComment: "The IP only collects data as a means of monitoring... but there is no evaluation made... Management informed us that post project implementation meetings were held but there was no evidence..."
        },
        {
          id: "2.8",
          text: "Is it evident that the IP followed up on independent evaluation recommendations?",
          isKeyQuestion: false,
          type: "yes_no_na", 
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe how follow-up is evidenced." },
            No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain lack of follow-up." },
            'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "Explain why not applicable (e.g., no independent evaluations)." }
          },
          exampleComment: "We could not verify if the IP follows up on independent evaluation recommendations because we were not availed any independent M&E reports."
        }
      ],
      scoringLogic: {
        totalQuestions: 8,
        totalApplicableQuestions: 7, // Example OPRD had Q2.8 as N/A, so 7 applicable
        totalKey: 3, 
        ratingThresholds: [
          { maxAverageScore: 2.035, numericScore: 1, rating: "Low" }, // (1*2 + 4*1)/7 = 1.14 if all Yes/No are Low. (4+1+1)/7 = 0.85 -- OPRD: 17pts/7Q=2.4 avg, Low up to 2.035.
          { minAverageScore: 2.036, maxAverageScore: 3.070, numericScore: 2, rating: "Moderate" },
          { minAverageScore: 3.071, maxAverageScore: 4.106, numericScore: 3, rating: "Significant" },
          { minAverageScore: 4.107, numericScore: 4, rating: "High" }
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
          text: "Are the IP’s recruitment, employment and personnel practices clearly defined and followed, and do they embrace transparency and competition?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm practices are defined, followed, transparent and competitive." },
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain deficiencies in HR practices." }
          },
          exampleComment: "The IP’s recruitment, employment and personnel practices are clearly defined... Management informed us that none of their employees were formally recruited."
        },
        {
          id: "3.2",
          text: "Does the IP have clearly defined job descriptions?",
          isKeyQuestion: false, 
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm JDs exist and are up-to-date for all positions." },
            No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain if JDs are missing or outdated." }
          },
          exampleComment: "The IP has clear job descriptions for all positions."
        },
        {
          id: "3.3",
          text: "Is the organizational structure of the finance and programme management departments, and competency of staff, appropriate for the complexity of the IP and the scale of activities? Identify the key staff, including job titles, responsibilities, educational backgrounds and professional experience.",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Describe structure, key staff, and confirm appropriateness. Explain any concerns." }, 
            No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Identify gaps in structure or staff competency." }
          },
          exampleComment: "The finance department is headed by the project accountant... The programme department is headed by the programme manager... We also noted that:- the finance officer and programme manager do not have signed contracts..."
        },
        {
          id: "3.4",
          text: "Is the IP’s accounting/finance function staffed adequately to ensure sufficient controls are in place to manage agency funds?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm adequacy of finance staffing for controls." },
            No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain staffing inadequacies." }
          },
          exampleComment: "The IP's staff is adequately staff considering its size (small and not complex)."
        },
        {
          id: "3.5",
          text: "Does the IP have training policies for accounting/finance/ programme management staff? Are necessary training activities undertaken?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Describe training policies and activities. Explain if not undertaken." }, 
            No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain absence of training policies or activities." }
          },
          exampleComment: "CMS has a capacity building plan... We however noted that no trainings were carried out as planned."
        },
        {
          id: "3.6",
          text: "Does the IP perform background verification/checks on all new accounting/finance and management positions?",
          isKeyQuestion: true,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe background check process." },
            No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain absence of background checks." }
          },
          exampleComment: "We were not availed evidence of performance of background verification/checks..."
        },
        {
          id: "3.7",
          text: "Has there been significant turnover in key finance positions the past five years? If so, has the rate improved or worsened and appears to be a problem?",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Describe turnover rate and its impact." }, 
            No: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Confirm low turnover or explain if recent changes are not problematic." } 
          },
          exampleComment: "The IP's finance department has had one change of staff... in the past two years."
        },
        {
          id: "3.8",
          text: "Does the IP have a documented internal control framework? Is this framework distributed and made available to staff and updated periodically? If so, please describe.",
          isKeyQuestion: false,
          type: "yes_no_explain",
          options: {
            Yes: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Describe ICF, distribution, and updates. Explain if distribution not evidenced." }, 
            No: { riskAssessment: "High", points: 6, defaultExplanationPlaceholder: "Explain absence of a documented ICF." }
          },
          exampleComment: "The IP has a documented staff policy manual... However, we were not provided evidence of issuance of the manuals to staff."
        }
      ],
      scoringLogic: {
        totalQuestions: 8,
        totalApplicableQuestions: 8, // All questions in this section are typically applicable.
        totalKey: 3, 
        ratingThresholds: [
          { maxAverageScore: 2.124, numericScore: 1, rating: "Low" },
          { minAverageScore: 2.125, maxAverageScore: 3.249, numericScore: 2, rating: "Moderate" },
          { minAverageScore: 3.250, maxAverageScore: 4.374, numericScore: 3, rating: "Significant" },
          { minAverageScore: 4.375, numericScore: 4, rating: "High" }
        ]
      }
    },
    {
        id: "4",
        title: "4. Accounting Policies and Procedures",
        responsibleDepartment: "Finance Department, Internal Audit (if applicable), Senior Management.",
        questions: [
        {
            id: "4.1", text: "Does the IP have an accounting system that allows for proper recording of financial transactions from United Nations agencies, including allocation of expenditures in accordance with the respective components, disbursement categories and sources of funds?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Describe system (e.g. Excel, software) and its capabilities."}, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of system or deficiencies." } }, 
            exampleComment: "Management informed us that it previously used Microsoft excel..."
        },
        {
            id: "4.2", text: "Does the IP have an appropriate cost allocation methodology that ensures accurate cost allocations to the various funding sources in accordance with established agreements?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Describe the methodology and confirm its consistent application."}, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of methodology or inconsistent application." } }, 
            exampleComment: "Shared costs were evenly split by the number of projects irrespective of allocations mentioned in the budget."
        },
        {
            id: "4.3", text: "Are all accounting and supporting documents retained in an organized system that allows authorized users easy access?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe the filing system (physical/digital) and access controls." }, No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain disorganization or access issues." } }, 
            exampleComment: "Project supporting documents are maintained in separate donor files. We however noted that they are not arranged in a chronological order..."
        },
        {
            id: "4.4", text: "Are the general ledger and subsidiary ledgers reconciled at least monthly? Are explanations provided for significant reconciling items?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm monthly reconciliation and documentation of explanations." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of reconciliations or follow-up." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no general ledger is maintained."} }, 
            exampleComment: "The IP does not maintain general ledgers."
        },
        {
            id: "4.5", text: "Are the following functional responsibilities performed by different units or individuals: (a) authorization to execute a transaction; (b) recording of the transaction; and (c) custody of assets involved in the transaction?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm segregation of these three key functions." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain which functions are not segregated and by whom they are performed." } },
            exampleComment: "The functional responsibilities of authorizing, recording and taking custody of assets are properly segregated."
        },
        {
            id: "4.6", text: "Are the functions of ordering, receiving, accounting for and paying for goods and services appropriately segregated?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm segregation of these procurement-related functions." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain lack of segregation in procurement cycle." } },
            exampleComment: "Management stated that all the functions are appropriately segregated. However, we could not verify... because the IP does not use purchase orders..."
        },
        {
            id: "4.7", text: "Are bank reconciliations prepared by individuals other than those who make or approve payments?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm independent preparation of bank reconciliations." }, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain if preparer is involved in payments, or if reconciliations are not done." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no bank reconciliations are prepared."}},
            exampleComment: "We could not verify whether bank reconciliations were prepared by individuals other than those who make or approve payments because no bank reconciliations were prepared..."
        },
        {
            id: "4.8", text: "Are budgets prepared for all activities in sufficient detail to provide a meaningful tool for monitoring subsequent performance?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm budgets are detailed and activity-based." }, No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain lack of detail or activity-based budgeting." } },
            exampleComment: "For the budget prepared, the IP used the donor templates that have sufficient details for easy monitoring..."
        },
        {
            id: "4.9", text: "Are actual expenditures compared to the budget with reasonable frequency? Are explanations required for significant variations from the budget?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm frequency of BVA and process for explaining variances." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain lack of regular BVA or variance analysis." } },
            exampleComment: "For the concluded UNDP and UNICEF projects, No BVA's were prepared. We noted that management developed a template... but this has not been put into use."
        },
        {
            id: "4.10", text: "Is prior approval sought for budget amendments in a timely way?",
            isKeyQuestion: false, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm process for timely budget amendment approval." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain delays or lack of approval for amendments." } },
            exampleComment: "Management informed us that Donor approval is required prior to any budget amendments. No budget amendments were made in the concluded projects."
        },
        {
            id: "4.11", text: "Are IP budgets approved formally at an appropriate level?",
            isKeyQuestion: false, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe budget approval process and levels." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain lack of formal approval or inappropriate approval levels." } },
            exampleComment: "All program budgets are approved by the program manager and the Executive Director"
        },
        {
            id: "4.12", text: "Do invoice processing procedures provide for: Copies of purchase orders and receiving reports to be obtained directly from issuing departments? Comparison of invoice quantities, prices and terms with those indicated on the purchase order and with records of goods/services actually received? Checking the accuracy of calculations?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm all three checks are performed systematically." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain which checks are missing or inconsistently applied." } },
            exampleComment: "Invoice processing procedures are sufficient. Review of some payments indicated that invoice prices and quantities tallied..."
        },
        {
            id: "4.13", text: "Are payments authorized at an appropriate level? Does the IP have a table of payment approval thresholds?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm existence of approval thresholds and adherence." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain lack of thresholds or inappropriate approval levels." } },
            exampleComment: "We noted that all the project transactions are approved by the Executive Director. The IP does not have a table of payment approval thresholds."
        },
        {
            id: "4.14", text: "Are all invoices stamped ‘PAID’, approved, and marked with the project code and account code?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm consistent practice of stamping and coding paid invoices." }, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of this practice." } },
            exampleComment: "CMS's invoices are not stamped ‘PAID’, approved, and marked with the project code and account code"
        },
        {
            id: "4.15", text: "Do controls exist for preparation and approval of payroll expenditures? Are payroll changes properly authorized?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe payroll preparation, approval, and change authorization controls." }, No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain weaknesses in payroll controls." } },
            exampleComment: "The IP's payroll expenses are prepared by the Project accountant and reviewed by the Executive Director."
        },
        {
            id: "4.16", text: "Do controls exist to ensure that direct staff salary costs reflects the actual amount of staff time spent on a project?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe use of timesheets or other methods for time allocation." }, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of timesheets or proper salary allocation methods." } },
            exampleComment: "The IP does not use timesheets to record actual time spent on project by its staff. Projects contribute equal amounts of the agreed salary..."
        },
        {
            id: "4.17", text: "Do controls exist for expense categories that do not originate from invoice payments, such as DSAs, travel, and internal cost allocations?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe controls for non-invoice expenses." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain weaknesses in controls for these expenses." } },
            exampleComment: "All expense that do not originate from invoice payments are approved by the Executive Director."
        },
        {
            id: "4.18", text: "Does the IP have a stated basis of accounting (i.e. cash or accrual) and does it allow for compliance with the agency's requirement?",
            isKeyQuestion: false, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "State basis of accounting and confirm agency compliance." }, No: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Explain if basis is unclear or non-compliant." } },
            exampleComment: "The IP uses a cash basis for accounting."
        },
        {
            id: "4.19", text: "Does the IP have an adequate policies and procedures manual and is it distributed to relevant staff?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Confirm manual adequacy, distribution, and staff awareness." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain inadequacy, lack of distribution, or staff unawareness." } },
            exampleComment: "The IP has an adequate policies and procedures manual... Management informed us that a copy is distributed to all staff but no evidence was availed..."
        },
        {
            id: "4.20", text: "Does the IP require dual signatories / authorization for bank transactions? Are new signatories approved at an appropriate level and timely updates made when signatories depart?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm dual signatory policy and proper signatory management." }, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of dual signatories or issues with signatory updates." } },
            exampleComment: "The IP requires dual signatories for bank transactions. All new signatories... are approved by the Board."
        },
        {
            id: "4.21", text: "Does the IP maintain an adequate, up‑to‑date cashbook, recording receipts and payments?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm cashbook maintenance and timeliness." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain issues with cashbook maintenance." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no cash transactions occur."}},
            exampleComment: "The IP maintains an adequate, up-to-date cashbook."
        },
        {
            id: "4.22", text: "If the partner is participating in micro-finance advances, do controls exist for the collection, timely deposit and recording of receipts at each collection location?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe controls for micro-finance advances."}, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain weaknesses in micro-finance controls." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If IP does not participate in micro-finance." } },
            exampleComment: "Management informed us that the IP does not participate in micro-finance advances."
        },
        {
            id: "4.23", text: "Are bank balances and cash ledger reconciled monthly and properly approved? Are explanations provided for significant, unusual and aged reconciling items?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm monthly, approved reconciliations with follow-up on items." }, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of reconciliations or proper follow-up." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no bank accounts or cash ledger."}},
            exampleComment: "There are no bank reconciliations carried out by the IP."
        },
        {
            id: "4.24", text: "Is substantial expenditure paid in cash? If so, does the IP have adequate controls over cash payments?",
            isKeyQuestion: false, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "If yes, describe controls. Risk increases with substantial cash use." }, No: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm minimal cash expenditure." } },
            exampleComment: "No substantial expenditure is paid in cash. There were no exceptions noted from the expenditure reviewed."
        },
        {
            id: "4.25", text: "Does the IP carry out a regular petty cash reconciliation?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm regular petty cash reconciliation." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of petty cash reconciliation." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no petty cash is maintained."}},
            exampleComment: "The IP does not carry out petty cash reconciliations."
        },
        {
            id: "4.26", text: "Are cash and cheques maintained in a secure location with restricted access? Are bank accounts protected with appropriate remote access controls?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe security measures for cash, cheques, and bank access." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain security weaknesses." } },
            exampleComment: "We noted that the cheque books are maintained in the Executive Director's laptop bag and the petty cash maintained in another IP's safe."
        },
        {
            id: "4.27", text: "Are there adequate controls over submission of electronic payment files that ensure no unauthorized amendments once payments are approved and files are transmitted over secure/encrypted networks?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe controls for electronic payments."}, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain weaknesses in electronic payment controls." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If IP does not make electronic payments." } },
            exampleComment: "The IP does not make any electronic payments."
        },
        {
            id: "4.28", text: "Does the IP have a process to ensure expenditures of subsidiary offices/ external entities are in compliance with the work plan and/or contractual agreement?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe oversight process for subsidiary/external entity expenditures." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain lack of oversight." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no subsidiary offices/external entities."}},
            exampleComment: "The IP operates two field offices... Budget requisitions are prepared by the field officers... Funds are then disbursed... accountability sent to the head office..."
        },
        {
            id: "4.29", text: "Is the internal auditor sufficiently independent to make critical assessments? To whom does the internal auditor report?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm independence and reporting line (e.g., to Board)." }, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of independence or inappropriate reporting line." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no internal auditor."}},
            exampleComment: "The IP does not have an internal auditor in place."
        },
        {
            id: "4.30", text: "Does the IP have stated qualifications and experience requirements for internal audit department staff?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm existence of qualification requirements." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of stated requirements." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no internal audit department."}},
            exampleComment: "The IP does not have stated qualifications and experience requirements for internal audit department staff"
        },
        {
            id: "4.31", text: "Are the activities financed by the agencies included in the internal audit department’s work programme?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm agency-financed activities are in audit scope." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain if not included or audit scope is insufficient." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no internal audit department."}},
            exampleComment: "The IP does not have an internal audit department in place."
        },
        {
            id: "4.32", text: "Does the IP act on the internal auditor's recommendations?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe process for following up on audit recommendations." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain lack of follow-up." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no internal auditor or no recommendations made." } },
            exampleComment: "The IP does not have an internal auditor."
        }
        ],
        scoringLogic: {
            totalQuestions: 32, 
            totalApplicableQuestions: 27, // OPRD example: 4.4, 4.7, 4.22, 4.23, 4.27, 4.29, 4.30, 4.31, 4.32 N/A -> 32-8=24? The PDF says 27. Let's use PDF values.
            totalKey: 19, // From OPRD PDF for this section
            ratingThresholds: [
                { maxAverageScore: 2.453, numericScore: 1, rating: "Low" },
                { minAverageScore: 2.454, maxAverageScore: 3.906, numericScore: 2, rating: "Moderate" },
                { minAverageScore: 3.907, maxAverageScore: 5.360, numericScore: 3, rating: "Significant" },
                { minAverageScore: 5.361, numericScore: 4, rating: "High" }
            ]
        }
    },
    {
        id: "5",
        title: "5. Fixed Assets and Inventory",
        responsibleDepartment: "Finance Department, Administration, Logistics/Procurement.",
        questions: [
        {
            id: "5.1", text: "Is there a system of adequate safeguards to protect assets from fraud, waste and abuse?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Describe safeguards (e.g., security, tagging, restricted access)." }, No: { riskAssessment: "High", points: 6, defaultExplanationPlaceholder: "Explain lack of safeguards." } }, 
            exampleComment: "The IP's premises are guarded. We however noted that the assets were not tagged/engraved."
        },
        {
            id: "5.2", text: "Are subsidiary records of fixed assets and inventory kept up to date and reconciled with control accounts?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm up-to-date records and reconciliation." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain outdated records or lack of reconciliation." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no control accounts or minimal assets."}},
            exampleComment: "We noted that the IP did not maintain a comprehensive fixed asset register. There is no reconciliation performed for the fixed assets."
        },
        {
            id: "5.3", text: "Are there periodic physical verification and/or count of fixed assets and inventory? If so, please describe?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe frequency and process of physical verification." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of periodic verification." } },
            exampleComment: "There are no periodic physical verification/count of assets."
        },
        {
            id: "5.4", text: "Are fixed assets and inventory adequately covered by insurance policies?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm adequate insurance coverage." }, No: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Explain inadequate or no insurance coverage." }, 'N/A': {riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If assets are minimal or insurance not applicable."}},
            exampleComment: "The IP only maintains a motorcycle as an insurable asset. It has been damaged since 2015."
        },
        {
            id: "5.5", text: "Do warehouse facilities have adequate physical security?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe warehouse security measures." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain security weaknesses in warehouse." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no warehouse facilities." } },
            exampleComment: "CMS does not have warehouse facilities."
        },
        {
            id: "5.6", text: "Is inventory stored so that it is identifiable, protected from damage, and countable?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm proper inventory storage practices." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain issues with inventory storage." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no significant inventory." } },
            exampleComment: "CMS does not have warehouse facilities."
        },
        {
            id: "5.7", text: "Does the IP have an inventory management system that enables monitoring of supply distribution?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe inventory management system." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain lack or inadequacy of system." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no significant inventory or distribution." } },
            exampleComment: "The IP does not have an inventory management system since it does not deal in the supply distribution of relief."
        },
        {
            id: "5.8", text: "Is responsibility for receiving and issuing inventory segregated from that for updating the inventory records?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm segregation of duties for inventory." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain lack of segregation." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If inventory management is minimal/handled by one person with compensating controls." } },
            exampleComment: "The financial policy and procedure manual stipulates procedures for receiving of goods... We noted that all these functions are performed by the finance department..."
        },
        {
            id: "5.9", text: "Are regular physical counts of inventory carried out?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm regular physical counts." }, No: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Explain if counts are irregular or not done, provide context if inventory is minor." } , 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no significant inventory." } }, 
            exampleComment: "The IP does not carry out any inventory counts because they do not maintain major inventory items, however counts for office stationery are performed."
        }
        ],
        scoringLogic: {
            totalQuestions: 9, 
            totalApplicableQuestions: 6, // OPRD example: 5.5, 5.6, 5.7 N/A -> 9-3=6 applicable
            totalKey: 4, // 5.1, 5.2, 5.3, 5.8 are key questions
            ratingThresholds: [
                { maxAverageScore: 1.749, numericScore: 1, rating: "Low" },
                { minAverageScore: 1.750, maxAverageScore: 2.499, numericScore: 2, rating: "Moderate" },
                { minAverageScore: 2.500, maxAverageScore: 3.249, numericScore: 3, rating: "Significant" },
                { minAverageScore: 3.250, numericScore: 4, rating: "High" }
            ]
        }
    },
    {
        id: "6",
        title: "6. Financial Reporting and Monitoring",
        responsibleDepartment: "Finance Department, Senior Management.",
        questions: [
        {
            id: "6.1", text: "Does the IP have established financial reporting procedures that specify what reports are to be prepared, the source system for key reports, the frequency of preparation, what they are to contain and how they are to be used?",
            isKeyQuestion: true, type: "yes_no_explain", 
            options: { Yes: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Describe reporting procedures, frequency, and usage." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack or inadequacy of procedures." } }, 
            exampleComment: "The IP's financial manual stipulates that; Annual reports will include... However, we noted that the financial reporting procedures for the IP are inadequate..."
        },
        {
            id: "6.2", text: "Does the IP prepare overall financial statements?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm preparation of key financial statements (Balance Sheet, Income Statement, Cash Flow)." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain which statements are not prepared." } }, 
            exampleComment: "CMS did not prepare overall financial statements."
        },
        {
            id: "6.3", text: "Are the IP’s overall financial statements audited regularly by an independent auditor in accordance with appropriate national or international auditing standards? If so, please describe the auditor.",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm regular independent audits and standards followed." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of regular audits." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If financial statements are not prepared, or other reasons." } },
            exampleComment: "CMS did not prepare overall financial statements and thus no regular independent audits."
        },
        {
            id: "6.4", text: "Were there any major issues related to ineligible expenditure involving donor funds reported in the audit reports of the IP over the past three years?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Describe major issues and corrective actions." }, No: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm no major issues reported." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no audits conducted or no donor funds received." } },
            exampleComment: "CMS has not been audited since incorporation."
        },
        {
            id: "6.5", text: "Have any significant recommendations made by auditors in the prior five audit reports and/or management letters over the past five years and have not yet been implemented?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Describe unimplemented recommendations and reasons." }, No: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm all significant recommendations implemented." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no audits or no significant recommendations." } },
            exampleComment: "CMS has not been audited since incorporation and thus no auditor recommendations"
        },
        {
            id: "6.6", text: "Is the financial management system computerized?",
            isKeyQuestion: false, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Specify type of computerized system (e.g., software name)." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain if system is manual or partially computerized." } },
            exampleComment: "The financial management system is computerized. The IP uses a macro-enabled excel workbook..."
        },
        {
            id: "6.7", text: "Can the computerized financial management system produce the necessary financial reports?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm system's capability to produce required reports." }, No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain limitations in report generation." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If system is not computerized or not yet in use." } },
            exampleComment: "We cannot confirm if the system can produce the necessary financial reports as management has not yet put it into use..."
        },
        {
            id: "6.8", text: "Does the IP have appropriate safeguards to ensure the confidentiality, integrity and availability of the financial data? E.g. password access controls; regular data back-up.",
            isKeyQuestion: true, type: "yes_no_explain", 
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe data security measures (passwords, backups, physical security)." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain weaknesses in data safeguards." } }, 
            exampleComment: "Management informed us that the backup is maintained on the Executive Director's hard drive. We did not confirm the data back up..."
        }
        ],
        scoringLogic: {
            totalQuestions: 8, 
            totalApplicableQuestions: 4, // OPRD example: 6.3, 6.4, 6.5, 6.7 N/A -> 8-4 = 4 applicable
            totalKey: 7, // 6.1,6.2,6.3,6.4,6.5,6.7,6.8 are key
            ratingThresholds: [ // OPRD total points 10 for 4 applicable questions. Avg = 2.5. Falls into Moderate.
                { maxAverageScore: 1.999, numericScore: 1, rating: "Low" },
                { minAverageScore: 2.000, maxAverageScore: 2.999, numericScore: 2, rating: "Moderate" },
                { minAverageScore: 3.000, maxAverageScore: 3.999, numericScore: 3, rating: "Significant" },
                { minAverageScore: 4.000, numericScore: 4, rating: "High" }
            ]
        }
    },
    {
        id: "7",
        title: "7. Procurement and Contract Administration",
        responsibleDepartment: "Procurement Unit, Finance Department, Administration.",
        questions: [
        {
            id: "7.1", text: "Does the IP have written procurement policies and procedures?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm comprehensive written policies exist." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain lack or inadequacy of policies." } }, 
            exampleComment: "The IP does not have written procurement policies and procedures. It only has a brief section in the financial policy..."
        },
        {
            id: "7.2", text: "Are exceptions to procurement procedures approved by management and documented?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm approval and documentation of exceptions." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain lack of approval or documentation for exceptions." } },
            exampleComment: "Management informed us that any exceptions to the procurement processes are approved by the Executive Director or the Board. We however could not verify this..."
        },
        {
            id: "7.3", text: "Does the IP have a computerized procurement system with adequate access controls and segregation of duties between entering purchase orders, approval and receipting of goods? Provide a description of the procurement system.",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe system, access controls, and SoD." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain lack of system or weaknesses." }, 'N/A': {riskAssessment:"N/A", points:0, defaultExplanationPlaceholder:"If procurement is minimal and manual system is adequate with controls."}},
            exampleComment: "The IP does not have a computerised procurement system."
        },
        {
            id: "7.4", text: "Are procurement reports generated and reviewed regularly? Describe reports generated, frequency and review & approvers.",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe reports, frequency, and review process." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain lack of regular reports or review." }, 'N/A': {riskAssessment:"N/A", points:0, defaultExplanationPlaceholder:"If procurement volume is very low."}},
            exampleComment: "There are no procurement reports generated and reviewed."
        },
        {
            id: "7.5", text: "Does the IP have a structured procurement unit with defined reporting lines that foster efficiency and accountability?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe structure and reporting lines." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain lack of structured unit or unclear reporting." } },
            exampleComment: "Management informed us that the procurement unit was absorbed in the finance department."
        },
        {
            id: "7.6", text: "Is the IP’s procurement unit resourced with qualified staff who are trained and certified and considered experts in procurement and conversant with UN / World Bank / European Union procurement requirements in addition to the IP's procurement rules and regulations?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm staff qualifications and training." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of qualified/trained staff." }, 'N/A': {riskAssessment:"N/A", points:0, defaultExplanationPlaceholder:"If no dedicated procurement unit due to size, but functions are handled by trained staff."}},
            exampleComment: "There is no separate procurement unit... Procurement roles are performed by the finance team that is not trained or qualified in procurement..."
        },
        {
            id: "7.7", text: "Have any significant recommendations related to procurement made by auditors in the prior five audit reports and/or management letters over the past five years and have not yet been implemented?",
            isKeyQuestion: true, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Describe unimplemented recommendations." }, No: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm implementation of audit recommendations." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If no audits or no procurement-related recommendations." } },
            exampleComment: "The IP has not been audited before and thus we cannot confirm the implementation of the recommendations..."
        },
        {
            id: "7.8", text: "Does the IP require written or system authorizations for purchases? If so, evaluate if the authorization thresholds are appropriate?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm written/system authorizations and appropriate thresholds." }, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain lack of authorizations or inappropriate thresholds." } },
            exampleComment: "There is no table of procurement approvals maintained by the IP."
        },
        {
            id: "7.9", text: "Do the procurement procedures and templates of contracts integrate references to ethical procurement principles and exclusion and ineligibility criteria?",
            isKeyQuestion: false, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Confirm integration of ethics, exclusion, and ineligibility criteria." }, No: { riskAssessment: "Significant", points: 3, defaultExplanationPlaceholder: "Explain what is missing." } },
            exampleComment: "The IP's procurement procedures and templates of contracts integrate references to ethical procurement principles but do not refer to exclusion and ineligibility criteria."
        },
        {
            id: "7.10", text: "Does the IP obtain sufficient approvals before signing a contract?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm contract approval process." }, No: { riskAssessment: "Moderate", points: 4, defaultExplanationPlaceholder: "Explain weaknesses in contract approval." } },
            exampleComment: "The IP obtains sufficient approvals before signing a contract i.e. from the ED or the Board."
        },
        {
            id: "7.11", text: "Does the IP have and apply formal guidelines and procedures to assist in identifying, monitoring and dealing with potential conflicts of interest with potential suppliers/procurement agents? If so, how does the IP proceed in cases of conflict of interest?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe CoI guidelines and procedures." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of CoI guidelines or procedures." } },
            exampleComment: "The IP does not have formal guidelines and procedures to assist in identifying, monitoring and dealing with potential conflicts of interest..."
        },
        {
            id: "7.12", text: "Does the IP follow a well-defined process for sourcing suppliers? Do formal procurement methods include wide broadcasting of procurement opportunities?",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe supplier sourcing process and broadcasting methods." }, No: { riskAssessment: "High", points: 8, defaultExplanationPlaceholder: "Explain weaknesses in supplier sourcing or lack of transparency." } },
            exampleComment: "Sampled procurements indicated that the IP does not follow a well-defined process for sourcing suppliers."
        },
        {
            id: "7.13", text: "Does the IP keep track of past performance of suppliers? E.g. database of trusted suppliers.",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe supplier performance tracking mechanism." }, No: { riskAssessment: "High", points: 4, defaultExplanationPlaceholder: "Explain lack of supplier performance tracking." } },
            exampleComment: "The IP does not have a mechanism for keeping track of past performance of suppliers."
        },
        {
            id: "7.14", text: "Does the IP follow a well-defined process to ensure a secure and transparent bid and evaluation process? If so, describe the process.",
            isKeyQuestion: true, type: "yes_no_explain",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe bid and evaluation process, ensuring security and transparency." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain lack of secure/transparent process." } },
            exampleComment: "Sampled procurement transactions  did not have procurement bids, evaluations or criteria for the selection of the final supplier. However, during the period under review the IP carried out low value procurements."
        },
        {
            id: "7.15", text: "When a formal invitation to bid has been issued, does the IP award the contract on a pre-defined basis set out in the solicitation documentation taking into account technical responsiveness and price?",
            isKeyQuestion: true, type: "yes_no_na", // Marked as key in OPRD sample (implied)
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm contract award based on pre-defined criteria." }, No: { riskAssessment: "Significant", points: 6, defaultExplanationPlaceholder: "Explain if award basis is not pre-defined or criteria not followed." }, 'N/A':{riskAssessment:"N/A", points:0, defaultExplanationPlaceholder:"If no formal ITBs issued due to low value procurements."}},
            exampleComment: "The IP does not maintain procurement files. We could not ascertain whether formal invitations to bid were issued... However, during the period under review the IP carried out low value procurements."
        },
        {
            id: "7.16", text: "If the IP is managing major contracts, does the IP have a policy on contracts management / administration?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe contract management policy." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain lack of policy." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If IP does not manage major contracts." } },
            exampleComment: "The IP is not managing any major contracts."
        },
        {
            id: "7.17", text: "Are there personnel specifically designated to manage contracts or monitor contract expirations?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm designated personnel for contract management." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain lack of designated personnel." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If IP does not manage major contracts." } },
            exampleComment: "IP does not manage major contracts."
        },
        {
            id: "7.18", text: "Are there staff designated to monitor expiration of performance securities, warranties, liquidated damages and other risk management instruments?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm designated staff for monitoring these instruments." }, No: { riskAssessment: "Moderate", points: 3, defaultExplanationPlaceholder: "Explain lack of designated staff." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If IP does not manage major contracts or use these instruments." } },
            exampleComment: "IP does not manage major contracts."
        },
        {
            id: "7.19", text: "Does the IP have a policy on post-facto actions on contracts?",
            isKeyQuestion: false, type: "yes_no_na",
            options: { Yes: { riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Describe policy on post-facto actions." }, No: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder: "Explain lack of policy." }, 'N/A': { riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder: "If IP does not manage major contracts." } },
            exampleComment: "IP does not manage major contracts."
        },
        {
            id: "7.20", text: "How frequent do post-facto contract actions occur?",
            isKeyQuestion: false, type: "yes_no_na", 
            options: { Yes: { riskAssessment: "Moderate", points: 2, defaultExplanationPlaceholder:"Describe frequency and reasons (treat 'Yes' as 'frequent' implying risk)."}, No:{ riskAssessment: "Low", points: 1, defaultExplanationPlaceholder: "Confirm no or infrequent post-facto actions (treat 'No' as 'infrequent')." }, 'N/A':{ riskAssessment: "N/A", points: 0, defaultExplanationPlaceholder:"Explain why not applicable (e.g. no major contracts)." } },
            exampleComment: "IP does not manage major contracts."
        }
        ],
        scoringLogic: {
            totalQuestions: 20, 
            totalApplicableQuestions: 15, // OPRD example: 7.7, 7.16, 7.17, 7.18, 7.19, 7.20 N/A. PDF says 19.  Let's use 20 total - 5 N/A (7.16-7.20) = 15. The PDF is inconsistent here.
            totalKey: 15, // Based on HACT template (all procurement general Qs are key)
            ratingThresholds: [
                { maxAverageScore: 2.012, numericScore: 1, rating: "Low" },
                { minAverageScore: 2.013, maxAverageScore: 3.025, numericScore: 2, rating: "Moderate" },
                { minAverageScore: 3.026, maxAverageScore: 4.038, numericScore: 3, rating: "Significant" },
                { minAverageScore: 4.039, numericScore: 4, rating: "High" }
            ]
        }
    }
  ],
  overallRatingThresholds: [ // Copied from OPRD Overall for consistency
    { maxAverageScore: 2.204, numericScore: 1, rating: "Low" },
    { minAverageScore: 2.205, maxAverageScore: 3.408, numericScore: 2, rating: "Moderate" },
    { minAverageScore: 3.409, maxAverageScore: 4.613, numericScore: 3, rating: "Significant" },
    { minAverageScore: 4.614, numericScore: 4, rating: "High" }
  ]
};


