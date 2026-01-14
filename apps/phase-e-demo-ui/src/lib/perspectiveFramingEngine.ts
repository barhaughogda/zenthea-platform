/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Phase R-06: Perspective-Aware Response Framing Engine
 *
 * This module provides a deterministic, read-only response framing layer
 * that rewrites the assistant's primary response based on demo perspective
 * (patient, clinician, operator).
 *
 * STRICT CONSTRAINTS:
 * - ZERO execution capability
 * - Does NOT change underlying reasoning, facts, or execution posture
 * - Deterministic logic only (no LLM rewriting)
 * - Preserves factual content exactly
 * - Only adjusts tone, wording, and responsibility framing
 *
 * LANGUAGE SAFETY RULES:
 * - No "will", "does", "executes", "performs"
 * - Use conditional phrasing only
 * - Explicitly preserve "no action has been taken" semantics
 */

import type { DemoPerspective } from "./demoPerspectiveContext";

/**
 * Framing transformation result.
 */
export interface FramingResult {
  /** The perspective-framed response text */
  framedResponse: string;
  /** Which perspective was applied */
  appliedPerspective: DemoPerspective;
  /** Whether any transformation was applied */
  wasTransformed: boolean;
}

/**
 * Vocabulary replacements by perspective.
 * Each perspective has specific word/phrase mappings.
 * All replacements use safe, conditional language.
 */
const VOCABULARY_REPLACEMENTS: Record<DemoPerspective, Array<[RegExp, string]>> = {
  patient: [
    // Technical → Plain language
    [/\bintent bucket\b/gi, "what you're asking about"],
    [/\brelevance score\b/gi, "how closely related"],
    [/\bconfidence annotations?\b/gi, "how certain the information is"],
    [/\btimeline item\b/gi, "record from your history"],
    [/\bclinical records?\b/gi, "health records"],
    [/\bclinical notes?\b/gi, "visit summaries"],
    [/\bdemo data\b/gi, "sample information"],
    [/\bstatic demo data\b/gi, "sample information"],
    [/\bshadow mode preview\b/gi, "preview mode"],
    [/\bpatient timeline\b/gi, "your health history"],
    [/\bevidence attribution\b/gi, "sources"],
    [/\bscheduling actions\b/gi, "appointment changes"],
    [/\bbilling actions\b/gi, "billing changes"],
    [/\bno clinical notes can be drafted or saved\b/gi, "this preview cannot create or save any notes"],
  ],
  clinician: [
    // Keep workflow-oriented language, make concise
    [/\bfor demonstration purposes only\b/gi, "demo only"],
    [/\bstatic demo data\b/gi, "demo data"],
    [/\bThis is read-only demo data — /gi, "Read-only. "],
    [/\bThis is demo data only — /gi, "Demo. "],
    [/\bPlease try asking about/gi, "Available queries:"],
    [/\bHere's what I found in the patient's demo timeline:/gi, "Timeline results:"],
    [/\bI found \d+ potentially relevant item/gi, "Relevant items found"],
  ],
  operator: [
    // Add procedural, policy-oriented framing
    [/\bI understand you're asking about\b/gi, "[QUERY CLASSIFIED]"],
    [/\bI found\b/gi, "[RECORD MATCH]"],
    [/\bI searched for\b/gi, "[SEARCH EXECUTED]"],
    [/\bHere's what I found\b/gi, "[QUERY RESULT]"],
    [/\bBased on the patient timeline\b/gi, "[TIMELINE QUERY]"],
    [/\bI couldn't find any relevant information\b/gi, "[NO MATCH]"],
    [/\bThe most recent is from\b/gi, "Most recent record:"],
    [/\bThe most relevant is from\b/gi, "Top match:"],
    [/\bfor demonstration purposes only\b/gi, "[DEMO SCOPE]"],
    [/\bThis is read-only\b/gi, "[READ-ONLY MODE]"],
    [/\bThis is demo data\b/gi, "[DEMO DATA]"],
  ],
};

/**
 * Tone prefixes by perspective.
 * Applied only when the response contains actionable-sounding content.
 */
const TONE_PREFIXES: Record<DemoPerspective, string> = {
  patient: "",
  clinician: "",
  operator: "[OBSERVATION] ",
};

/**
 * Reassurance suffixes by perspective.
 * Added to responses to reinforce the read-only, non-executing nature.
 */
const REASSURANCE_SUFFIXES: Record<DemoPerspective, string> = {
  patient: "\n\n💡 This is preview information only. No changes have been made to your records.",
  clinician: "",
  operator: "\n\n[AUDIT NOTE: Read-only observation. No action has been taken.]",
};

/**
 * Forbidden execution language patterns.
 * These patterns should NEVER appear in framed output.
 * Only matches definite execution claims, not conditional language.
 */
const FORBIDDEN_PATTERNS: RegExp[] = [
  // "will" + verb patterns (definite future execution)
  /\bwill\s+execute\b/gi,
  /\bwill\s+perform\b/gi,
  /\bwill\s+complete\b/gi,
  /\bwill\s+schedule\b/gi,
  /\bwill\s+book\b/gi,
  /\bwill\s+save\b/gi,
  /\bwill\s+update\b/gi,
  /\bwill\s+create\b/gi,
  /\bwill\s+delete\b/gi,
  /\bwill\s+modify\b/gi,
  // "does" + verb patterns (present execution claims)
  /\bdoes\s+execute\b/gi,
  /\bdoes\s+perform\b/gi,
  // Active execution claims
  /\bI am scheduling\b/gi,
  /\bI am booking\b/gi,
  /\bI am saving\b/gi,
  /\bI am updating\b/gi,
  /\bI am creating\b/gi,
  // Past execution claims
  /\bI have scheduled\b/gi,
  /\bI have booked\b/gi,
  /\bI have saved\b/gi,
  /\bI have updated\b/gi,
  /\bI have created\b/gi,
];

/**
 * Safe conditional replacements for any accidentally authoritative language.
 * These apply to ALL perspectives as a safety net.
 */
const SAFETY_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bwill be scheduled\b/gi, "would be scheduled"],
  [/\bwill be booked\b/gi, "would be booked"],
  [/\bwill be saved\b/gi, "would be saved"],
  [/\bwill be updated\b/gi, "would be updated"],
  [/\bwill be created\b/gi, "would be created"],
  [/\bis being scheduled\b/gi, "would be scheduled"],
  [/\bis being booked\b/gi, "would be booked"],
  [/\bis being saved\b/gi, "would be saved"],
  [/\bis being updated\b/gi, "would be updated"],
  [/\bhas been scheduled\b/gi, "would have been scheduled"],
  [/\bhas been booked\b/gi, "would have been booked"],
  [/\bhas been saved\b/gi, "would have been saved"],
  [/\bhas been updated\b/gi, "would have been updated"],
  [/\bhas been created\b/gi, "would have been created"],
];

/**
 * Patient-specific reassurance phrases to insert.
 * Makes clinical language more accessible.
 */
const PATIENT_REASSURANCE_PHRASES: Array<[RegExp, string]> = [
  [/\bno appointment changes can be performed\b/gi, "this preview cannot make any changes to your appointments"],
  [/\bno billing changes can be performed\b/gi, "this preview cannot make any changes to billing"],
  [/\bNo billing changes can be performed\b/g, "This preview cannot make any billing changes"],
  [/\bstatic demo data for demonstration purposes only\b/gi, "sample information shown for preview only"],
  [/\bno notes can be written or saved\b/gi, "this preview cannot create or save any notes"],
];

/**
 * Apply vocabulary replacements for a specific perspective.
 */
function applyVocabularyReplacements(
  text: string,
  perspective: DemoPerspective
): string {
  let result = text;
  const replacements = VOCABULARY_REPLACEMENTS[perspective];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * Apply safety replacements to ensure no execution language.
 */
function applySafetyReplacements(text: string): string {
  let result = text;

  for (const [pattern, replacement] of SAFETY_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * Apply patient-specific reassurance phrases.
 */
function applyPatientReassurance(text: string): string {
  let result = text;

  for (const [pattern, replacement] of PATIENT_REASSURANCE_PHRASES) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * Validate that no forbidden execution language remains.
 * Returns true if the text is safe, false if forbidden patterns found.
 */
export function validateNoExecutionLanguage(text: string): boolean {
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      return false;
    }
  }
  return true;
}

/**
 * Extract and preserve evidence attribution block.
 * Evidence attribution should not be transformed.
 */
function extractEvidenceBlock(text: string): { main: string; evidence: string } {
  const evidenceMarker = "\n\nBased on:\n";
  const evidenceIndex = text.indexOf(evidenceMarker);

  if (evidenceIndex === -1) {
    return { main: text, evidence: "" };
  }

  // Find where the evidence block ends (before any system instruction)
  const systemMarker = "\n\n[SYSTEM INSTRUCTION:";
  const systemIndex = text.indexOf(systemMarker, evidenceIndex);

  let evidenceEnd = systemIndex === -1 ? text.length : systemIndex;
  
  return {
    main: text.slice(0, evidenceIndex),
    evidence: text.slice(evidenceIndex, evidenceEnd),
  };
}

/**
 * Extract and preserve system instruction block.
 * System instructions should not be transformed.
 */
function extractSystemBlock(text: string): { content: string; system: string } {
  const systemMarker = "\n\n[SYSTEM INSTRUCTION:";
  const systemIndex = text.indexOf(systemMarker);

  if (systemIndex === -1) {
    return { content: text, system: "" };
  }

  return {
    content: text.slice(0, systemIndex),
    system: text.slice(systemIndex),
  };
}

/**
 * Frame a response for the patient perspective.
 * - Plain language
 * - Reassuring tone
 * - Explanatory
 * - No jargon
 */
function frameForPatient(text: string): string {
  let result = applyVocabularyReplacements(text, "patient");
  result = applyPatientReassurance(result);
  result = applySafetyReplacements(result);
  return result;
}

/**
 * Frame a response for the clinician perspective.
 * - Concise
 * - Neutral
 * - Workflow-aware
 */
function frameForClinician(text: string): string {
  let result = applyVocabularyReplacements(text, "clinician");
  result = applySafetyReplacements(result);
  return result;
}

/**
 * Frame a response for the operator perspective.
 * - Procedural
 * - Policy-oriented
 * - Observational
 */
function frameForOperator(text: string): string {
  let result = applyVocabularyReplacements(text, "operator");
  result = applySafetyReplacements(result);
  return result;
}

/**
 * Main framing function.
 *
 * Rewrites the assistant's primary response based on demo perspective.
 * Preserves factual content exactly — only adjusts tone, wording, and
 * responsibility framing.
 *
 * @param baseAssistantResponse - The original assistant response text
 * @param perspective - The current demo perspective ("patient" | "clinician" | "operator")
 * @returns FramingResult with the framed response and metadata
 */
export function frameResponseForPerspective(
  baseAssistantResponse: string,
  perspective: DemoPerspective
): FramingResult {
  // Handle empty or whitespace-only responses
  if (!baseAssistantResponse || !baseAssistantResponse.trim()) {
    return {
      framedResponse: baseAssistantResponse,
      appliedPerspective: perspective,
      wasTransformed: false,
    };
  }

  // Extract preserved blocks (evidence and system instructions)
  const { content: withoutSystem, system: systemBlock } = extractSystemBlock(baseAssistantResponse);
  const { main: mainContent, evidence: evidenceBlock } = extractEvidenceBlock(withoutSystem);

  // Apply perspective-specific framing to main content only
  let framedMain: string;
  switch (perspective) {
    case "patient":
      framedMain = frameForPatient(mainContent);
      break;
    case "clinician":
      framedMain = frameForClinician(mainContent);
      break;
    case "operator":
      framedMain = frameForOperator(mainContent);
      break;
    default:
      framedMain = mainContent;
  }

  // Apply tone prefix if needed
  const prefix = TONE_PREFIXES[perspective];
  if (prefix && !framedMain.startsWith(prefix)) {
    framedMain = prefix + framedMain;
  }

  // Reconstruct the response with preserved blocks
  let framedResponse = framedMain;
  
  // Add evidence block back (unchanged)
  if (evidenceBlock) {
    framedResponse += evidenceBlock;
  }

  // Add perspective-specific suffix (before system block)
  const suffix = REASSURANCE_SUFFIXES[perspective];
  if (suffix) {
    framedResponse += suffix;
  }

  // Add system block back (unchanged)
  if (systemBlock) {
    framedResponse += systemBlock;
  }

  // Determine if transformation occurred
  const wasTransformed = framedResponse !== baseAssistantResponse;

  return {
    framedResponse,
    appliedPerspective: perspective,
    wasTransformed,
  };
}

/**
 * Check if a response contains facts that should be preserved.
 * Used for validation to ensure facts are not altered.
 */
export function extractFactualContent(text: string): string[] {
  const facts: string[] = [];

  // Extract dates (factual)
  const datePattern = /\b\d{4}-\d{2}-\d{2}\b/g;
  const dates = text.match(datePattern);
  if (dates) {
    facts.push(...dates);
  }

  // Extract quoted titles (factual)
  const titlePattern = /"([^"]+)"/g;
  let match;
  while ((match = titlePattern.exec(text)) !== null) {
    facts.push(match[1]);
  }

  // Extract numeric counts (factual)
  const countPattern = /\b(\d+)\s+(?:relevant|clinical|item|record|billing)/gi;
  while ((match = countPattern.exec(text)) !== null) {
    facts.push(match[0]);
  }

  return facts;
}

/**
 * Validate that factual content is preserved between original and framed response.
 * Returns true if all facts are preserved.
 */
export function validateFactsPreserved(
  original: string,
  framed: string
): boolean {
  const originalFacts = extractFactualContent(original);
  const framedFacts = extractFactualContent(framed);

  // All original facts must appear in framed response
  for (const fact of originalFacts) {
    if (!framedFacts.includes(fact) && !framed.includes(fact)) {
      return false;
    }
  }

  return true;
}
