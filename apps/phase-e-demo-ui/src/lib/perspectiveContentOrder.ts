/**
 * DEMO ONLY — PRESENTATION LAYER ONLY — NO LOGIC CHANGES
 * 
 * Phase R-10: Perspective-Specific Information Ordering
 * 
 * This utility defines the deterministic ordering of content sections
 * based on the active demo perspective. It does NOT:
 * - Create new data
 * - Change reasoning
 * - Introduce new logic
 * - Mutate existing message data
 * 
 * It purely controls the visual grouping and order of panels in the UI.
 */

import { DemoPerspective, PanelId } from "./demoPerspectiveContext";

/**
 * Ordered list of sections for each perspective.
 * 
 * PATIENT PERSPECTIVE
 * Primary: Plain-language summary, Meaning/Context, Boundary, Evidence
 * Secondary: Confidence, Readiness, Confirmation, Execution, Audit
 * 
 * CLINICIAN PERSPECTIVE
 * Primary: Clinical facts, Timeline summary, Gaps/Follow-ups, Readiness
 * Secondary: Confirmation, Execution
 * (Audit panels collapsed by default)
 * 
 * OPERATOR PERSPECTIVE
 * Primary: Audit, Policy/Readiness, Execution, Summary
 */
export const PERSPECTIVE_SECTION_ORDER: Record<DemoPerspective, PanelId[]> = {
  patient: [
    "synthesis",      // InsightPanel - Plain-language summary & Meaning
    "relevance",      // RelevancePanel - Evidence attribution
    "confidence",     // ConfidencePanel - Reassurance & Boundary
    "readiness",      // ActionReadinessPanel
    "confirmation",   // HumanConfirmationPanel
    "execution",      // ExecutionPlanPanel
    "audit",          // PreviewAuditPanel
    "comparative",    // ComparativePanel
  ],
  clinician: [
    "comparative",    // ComparativePanel - Clinical facts & dates (trends/gaps)
    "relevance",      // RelevancePanel - Timeline-referenced evidence
    "synthesis",      // InsightPanel - Summary
    "readiness",      // ActionReadinessPanel - Readiness framing
    "confirmation",   // HumanConfirmationPanel - Preview
    "execution",      // ExecutionPlanPanel - Preview
    "confidence",     // ConfidencePanel
    "audit",          // PreviewAuditPanel
  ],
  operator: [
    "audit",          // PreviewAuditPanel - Audit and accountability
    "readiness",      // ActionReadinessPanel - Policy/Readiness gates
    "execution",      // ExecutionPlanPanel - Execution preview
    "synthesis",      // InsightPanel - Factual summary (de-emphasized)
    "relevance",      // RelevancePanel
    "confidence",     // ConfidencePanel
    "confirmation",   // HumanConfirmationPanel
    "comparative",    // ComparativePanel
  ],
};

/**
 * Returns the ordered list of section IDs for a given perspective.
 */
export function getSectionOrder(perspective: DemoPerspective): PanelId[] {
  return PERSPECTIVE_SECTION_ORDER[perspective];
}
