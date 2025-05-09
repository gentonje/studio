
// This file will contain logic for generating recommendations.
// Both rule-based and potentially helper functions for AI-enhanced recommendations.

import type { HACTQuestion, Answer } from '@/types';

/**
 * Generates a rule-based recommendation for a given question and answer.
 * @param question The HACT question object.
 * @param answer The user's answer object.
 * @returns A recommendation string or null if no specific rule applies.
 */
export function getStaticRecommendation(question: HACTQuestion, answer: Answer): string | null {
  // Section 1: Implementing Partner
  if (question.id === "1.1" && answer.value === "No") {
    return "Critical: Community Health Services (CMS) must ensure it is legally registered and fully compliant with all national registration requirements. Steps: 1. Immediately initiate or complete the legal registration process. 2. Obtain and maintain all required certificates and licenses. 3. Document the legal status and date of registration. This is fundamental for operational legitimacy and donor eligibility.";
  }
  if (question.id === "1.4" && answer.value === "No") {
    return "Critical: CMS's governing body must meet regularly and perform its oversight functions. Steps: 1. Establish a regular meeting schedule (e.g., quarterly). 2. Define a clear agenda for meetings, including review of financial reports, budget approval, and strategic discussions. 3. Ensure meeting minutes are properly recorded, approved, and archived. Effective governance is key to accountability.";
  }
  if (question.id === "1.5" && answer.value === "No") {
    return "High Priority: CMS must develop, approve, and implement a comprehensive anti-fraud and corruption policy. Steps: 1. Draft a policy covering definitions, prevention, detection, reporting mechanisms, investigation procedures, and disciplinary actions. 2. Ensure the policy is formally approved by the governing body. 3. Communicate the policy to all staff, volunteers, and key stakeholders. 4. Conduct regular training on the policy.";
  }
   if (question.id === "1.6" && answer.value === "No") {
    return "High Priority: CMS must establish clear, confidential channels for reporting suspected fraud, waste, or misuse of resources, and implement a robust whistle-blower protection policy. Steps: 1. Define and communicate accessible reporting mechanisms (e.g., dedicated email, hotline). 2. Develop a policy explicitly prohibiting retaliation against whistle-blowers. 3. Ensure investigations into reports are confidential and fair. This fosters transparency and accountability.";
  }

  // Section 2: Programme Management
  if (question.id === "2.2" && answer.value === "No") {
    return "Significant: CMS must ensure detailed work plans are prepared for all projects and are regularly updated and monitored. Steps: 1. Implement a standard work plan template including activities, responsibilities, timelines, budgets, and expected results. 2. Mandate regular (e.g., monthly or quarterly) reviews of work plan progress against actuals. 3. Document deviations and implement corrective actions promptly. This is vital for effective project delivery.";
  }

  // Section 3: Organizational Structure and Staffing
  if (question.id === "3.3" && answer.value === "No") {
    return "High Priority: CMS must implement a systematic process for background verification for all new accounting/finance and key management positions. Steps: 1. Define the scope of background checks (e.g., reference checks, criminal record checks where permissible, qualification verification). 2. Consistently apply this process during recruitment. 3. Maintain confidential records of checks performed. This mitigates risks associated with hiring unsuitable candidates.";
  }
  
  // Section 4: Accounting Policies and Procedures - Key Aspects
  if (question.id === "4.1" && answer.value === "No") {
    return "Critical: CMS must establish or enhance its accounting system to ensure proper recording and allocation of all financial transactions, especially for donor funds. Steps: 1. If using a manual system, implement robust controls and clear procedures. 2. If a computerized system is lacking or inadequate, consider adopting suitable accounting software (e.g., QuickBooks, Xero). 3. Ensure the system can track expenditures by project, donor, and activity. 4. Train finance staff on correct usage and procedures. Accurate financial records are essential for HACT compliance.";
  }
  if (question.id === "4.3" && answer.value === "No") {
    return "Significant: CMS must ensure adequate segregation of duties in financial processes (ordering, receiving, accounting, payment). Steps: 1. Review current roles and responsibilities. 2. Reassign duties to ensure no single individual controls a transaction from start to finish. 3. Where full segregation is not possible due to staff size, implement strong compensating controls (e.g., increased supervision, independent reviews). Document these controls.";
  }
  if (question.id === "4.4" && answer.value === "No") {
    return "Critical: CMS must perform monthly bank reconciliations for all bank accounts. These must be prepared by someone independent of cash handling and transaction recording, and reviewed by a supervisor. Steps: 1. Assign responsibility for bank reconciliation preparation and review. 2. Ensure reconciliations are completed within a week of month-end. 3. All reconciling items must be investigated, explained, and cleared promptly with supporting documentation. This is a fundamental control for cash management.";
  }


  // Generic recommendation for "No" answers to key questions if no specific rule exists
  if (question.isKeyQuestion && answer.value === "No") {
    return `Addressing the issue raised in question ${question.id} ("${question.text.substring(0, 70)}...") is critical for CMS. Develop and implement robust measures, policies, or procedures to meet the required HACT standards and donor expectations. This may involve seeking external expertise if needed.`;
  }
  
  // Generic recommendation for "Moderate", "Significant", or "High" risk answers if no specific rule exists
  const risk = question.options?.[answer.value as 'Yes'|'No']?.riskAssessment;
  if (answer.value !== 'N/A' && (risk === 'Moderate' || risk === 'Significant' || risk === 'High')) {
     return `For question ${question.id} ("${question.text.substring(0, 70)}..."), CMS's current approach presents a ${risk?.toLowerCase()} risk. It is recommended to review the existing processes/policies related to this area, identify specific weaknesses, and develop an action plan to strengthen controls and align with HACT best practices. This may include enhanced documentation, staff training, or procedural changes.`;
  }

  return null;
}

// Functions to prepare prompts for AI or process AI responses can also go here.

    