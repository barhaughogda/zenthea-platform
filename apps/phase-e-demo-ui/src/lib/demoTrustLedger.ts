/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Phase R-12: Demo Trust Ledger
 *
 * This utility provides a deterministic list of transformation layers applied
 * to the assistant response for transparency and regulatory review.
 *
 * It is a static representation of the pipeline structure, NOT dynamic analysis.
 * UI-ONLY: NO execution, NO intelligence, NO side effects.
 */

export interface TrustLedgerEntry {
  id: string;
  label: string;
  description: string;
  status: "APPLIED";
  scope: "UI_ONLY";
}

/**
 * Builds the static ordered list of applied transformation layers.
 * Deterministic only. Reflects the pipeline structure.
 */
export function buildDemoTrustLedger(): TrustLedgerEntry[] {
  return [
    {
      id: "question-type-classification",
      label: "Question Type Classification",
      description: "Classifies the incoming message into functional categories for routing.",
      status: "APPLIED",
      scope: "UI_ONLY",
    },
    {
      id: "evidence-routing",
      label: "Evidence Routing",
      description: "Selects relevant data segments from the timeline based on classification.",
      status: "APPLIED",
      scope: "UI_ONLY",
    },
    {
      id: "response-composition",
      label: "Response Composition",
      description: "Assembles the core response components using selected evidence.",
      status: "APPLIED",
      scope: "UI_ONLY",
    },
    {
      id: "perspective-framing",
      label: "Perspective Framing",
      description: "Adjusts tone and terminology based on the active user perspective.",
      status: "APPLIED",
      scope: "UI_ONLY",
    },
    {
      id: "narrative-subject-mapping",
      label: "Narrative Subject Mapping",
      description: "Adjusts pronouns and subject references for narrative consistency.",
      status: "APPLIED",
      scope: "UI_ONLY",
    },
    {
      id: "subject-normalization",
      label: "Subject Normalization",
      description: "Ensures consistent naming conventions across the response text.",
      status: "APPLIED",
      scope: "UI_ONLY",
    },
    {
      id: "identity-resolution",
      label: "Identity Resolution",
      description: "Replaces placeholders with resolved identity names for clarity.",
      status: "APPLIED",
      scope: "UI_ONLY",
    },
    {
      id: "perspective-content-ordering",
      label: "Perspective Content Ordering",
      description: "Determines the priority and layout of governance panels.",
      status: "APPLIED",
      scope: "UI_ONLY",
    },
  ];
}
