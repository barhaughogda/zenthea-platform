/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Phase R-09: Subject-Consistent Narrative Normalization
 *
 * This utility enforces a consistent grammatical subject throughout the 
 * primary assistant response based on the selected DemoPerspective.
 *
 * Rules:
 * - Patient: Enforce second-person ("you") throughout.
 * - Clinician: Enforce third-person professional language.
 * - Operator: Enforce record-centric language ("this record").
 *
 * Safety:
 * - NO LLMs, no randomness (deterministic logic only).
 * - NO changes to dates, diagnoses, values, or sentence order.
 * - NO backend, no persistence, no orchestration.
 */

import { DemoPerspective } from "./demoPerspectiveContext";

/**
 * Normalizes the narrative subject of a text string based on perspective.
 * 
 * @param text The original assistant message text
 * @param perspective The current demo perspective
 * @returns The normalized text
 */
export function normalizeNarrativeSubject(text: string, perspective: DemoPerspective): string {
  if (!text) return text;

  switch (perspective) {
    case "patient":
      return normalizeToPatient(text);
    case "clinician":
      return normalizeToClinician(text);
    case "operator":
      return normalizeToOperator(text);
    default:
      return text;
  }
}

/**
 * PATIENT perspective:
 * - Enforce second-person ("you") throughout
 * - Rewrite known third-person clauses
 */
function normalizeToPatient(text: string): string {
  let result = text;

  // Final pass: Ensure no "patient" references remain in patient view
  // (Specific to the narrative subject, not titles or data)
  result = result.replace(/\bthe patient's\b/g, "your");
  result = result.replace(/\bThe patient's\b/g, "Your");
  result = result.replace(/\bthe patient\b/g, "you");
  result = result.replace(/\bThe patient\b/g, "You");

  // Enforce "you" for known third-person patterns
  const patterns: Array<[RegExp, string]> = [
    // "The patient reported X" -> "You reported X"
    [/\bThe patient reported\b/g, "You reported"],
    [/\bthe patient reported\b/g, "you reported"],
    // "Patient reported X" -> "You reported X"
    [/\bPatient reported\b/g, "You reported"],
    // "The patient had X" -> "You had X"
    [/\bThe patient had\b/g, "You had"],
    [/\bthe patient had\b/g, "you had"],
    // "Patient had X" -> "You had X"
    [/\bPatient had\b/g, "You had"],
  ];

  for (const [pattern, replacement] of patterns) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * CLINICIAN perspective:
 * - Enforce third-person professional language
 * - Allow "patient" references
 * - Remove "you" references (except in disclaimers/clarifications)
 */
function normalizeToClinician(text: string): string {
  let result = text;

  // Rewrite "you" to "the patient" where appropriate in narrative
  // We only target specific patterns to avoid breaking general address
  const patterns: Array<[RegExp, string]> = [
    [/\byou reported\b/gi, "the patient reported"],
    [/\byou had\b/gi, "the patient had"],
    [/\byour health history\b/gi, "the patient's health history"],
    [/\byour records\b/gi, "the patient's records"],
    [/\bPatient reported\b/g, "The patient reported"],
    [/\bPatient had\b/g, "The patient had"],
  ];

  for (const [pattern, replacement] of patterns) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * OPERATOR perspective:
 * - Enforce record-centric language
 * - Rewrite personal references to "this record"
 * - Prefix paragraphs with "[RECORD]" if not already present
 */
function normalizeToOperator(text: string): string {
  let result = text;

  // Replace personal pronouns with record framing
  const patterns: Array<[RegExp, string]> = [
    [/\byour\b/gi, "this record's"],
    [/\byou\b/gi, "this record"],
    [/\bthe patient's\b/gi, "this record's"],
    [/\bThe patient's\b/gi, "This record's"],
    [/\bthe patient\b/gi, "this record"],
    [/\bThe patient\b/gi, "This record"],
    [/\bPatient reported\b/g, "this record reported"],
    [/\bPatient had\b/g, "this record had"],
  ];

  for (const [pattern, replacement] of patterns) {
    result = result.replace(pattern, replacement);
  }

  // Prefix paragraphs with [RECORD]
  const paragraphs = result.split("\n\n");
  const taggedParagraphs = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return p;
    if (trimmed.startsWith("[RECORD]")) return p;
    return `[RECORD] ${trimmed}`;
  });

  return taggedParagraphs.join("\n\n");
}
