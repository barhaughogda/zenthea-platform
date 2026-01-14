/**
 * DEMO ONLY — FINAL-PASS NORMALIZATION — NO AUTHORITY CHANGES
 *
 * This utility enforces final identity correctness for demo trust and narrative consistency.
 * It serves as the FINAL transformation step to ensure that assistant responses
 * consistently reflect the appropriate perspective (Patient, Clinician, or Operator).
 *
 * PERSPECTIVE RULES:
 * - Patient: ALWAYS second-person ("you", "your"). NEVER show patient name.
 * - Clinician: ALWAYS third-person ("the patient"). Patient name allowed AT MOST ONCE.
 * - Operator: ALWAYS record-centric ("this record"). Prefix paragraphs with [RECORD].
 *
 * SAFETY:
 * - Deterministic logic only (Regex-based). No LLMs.
 * - ZERO execution capability, ZERO data mutation.
 * - Preserves ALL clinical facts, dates, values, and labels.
 * - Idempotent: running twice produces the same output.
 */

import { DemoPerspective } from "./demoPerspectiveContext";

/**
 * Resolves identity references in assistant response text based on perspective.
 *
 * @param text The response text to normalize
 * @param perspective The current demo perspective
 * @param patientName Optional name of the patient (defaults to Jane Doe)
 * @returns Perspective-consistent normalized text
 */
export function resolveIdentity(
  text: string,
  perspective: DemoPerspective,
  patientName: string = "Jane Doe"
): string {
  if (!text) return text;

  switch (perspective) {
    case "patient":
      return resolveForPatient(text, patientName);
    case "clinician":
      return resolveForClinician(text, patientName);
    case "operator":
      return resolveForOperator(text, patientName);
    default:
      return text;
  }
}

/**
 * PATIENT perspective normalization:
 * - Replace patient name with "you"
 * - Replace "the patient" with "you"
 * - Replace possessives ("Jane Doe's", "the patient's") with "your"
 * - Fix grammar ("you has" -> "you have", "you was" -> "you were")
 */
function resolveForPatient(text: string, patientName: string): string {
  let result = text;

  // 1. Handle possessives first (longest matches first)
  const possessiveName = `${patientName}'s`;
  result = result.replace(new RegExp(possessiveName, "gi"), "your");
  result = result.replace(/\bthe patient's\b/gi, "your");

  // 2. Handle direct name and "the patient"
  result = result.replace(new RegExp(`\\b${patientName}\\b`, "gi"), "you");
  result = result.replace(/\bthe patient\b/gi, "you");

  // 3. Grammar Correction (deterministic)
  const grammarFixes: Array<[RegExp, string]> = [
    [/\byou has\b/gi, "you have"],
    [/\byou was\b/gi, "you were"],
    [/\byou is\b/gi, "you are"],
    [/\bYou has\b/g, "You have"],
    [/\bYou was\b/g, "You were"],
    [/\bYou is\b/g, "You are"],
  ];

  for (const [pattern, replacement] of grammarFixes) {
    result = result.replace(pattern, replacement);
  }

  // Final check: ensure no residual patient name usage
  // (Case-insensitive check for any remaining Jane Doe)
  result = result.replace(new RegExp(`\\b${patientName}\\b`, "gi"), "you");

  return result;
}

/**
 * CLINICIAN perspective normalization:
 * - Replace "you"/"your" with "the patient"/"the patient's"
 * - Allow patient name AT MOST ONCE (first reference only)
 */
function resolveForClinician(text: string, patientName: string): string {
  let result = text;

  // 1. Convert second-person to third-person
  result = result.replace(/\byour\b/gi, "the patient's");
  result = result.replace(/\byou\b/gi, "the patient");

  // 2. Ensure patient name appears at most once
  // Check if name already exists
  const nameRegex = new RegExp(`\\b${patientName}\\b`, "gi");
  const nameMatches = result.match(nameRegex);

  if (nameMatches && nameMatches.length > 1) {
    // Keep only the first occurrence, replace others with "the patient"
    let count = 0;
    result = result.replace(nameRegex, (match) => {
      count++;
      return count === 1 ? match : "the patient";
    });
  }

  return result;
}

/**
 * OPERATOR perspective normalization:
 * - Remove ALL personal references (names, you, the patient)
 * - Replace with "this record" or "the record"
 * - Prefix each paragraph with "[RECORD]"
 */
function resolveForOperator(text: string, patientName: string): string {
  let result = text;

  // 1. Replace possessives
  const possessiveName = `${patientName}'s`;
  result = result.replace(new RegExp(possessiveName, "gi"), "the record's");
  result = result.replace(/\byour\b/gi, "the record's");
  result = result.replace(/\bthe patient's\b/gi, "the record's");

  // 2. Replace direct references
  result = result.replace(new RegExp(`\\b${patientName}\\b`, "gi"), "this record");
  result = result.replace(/\byou\b/gi, "this record");
  result = result.replace(/\bthe patient\b/gi, "this record");

  // 3. Prefix paragraphs with [RECORD]
  const paragraphs = result.split("\n\n");
  const taggedParagraphs = paragraphs.map((p) => {
    const trimmed = p.trim();
    if (!trimmed) return p;
    // Remove conversational tone if it exists at start
    let cleaned = trimmed;
    const conversationalStarters = [
      /^Hello,?\s+/i,
      /^I see\s+/i,
      /^Looking at\s+/i,
      /^I found\s+/i,
      /I found/gi, // Added global search to remove all occurrences
    ];
    for (const starter of conversationalStarters) {
      cleaned = cleaned.replace(starter, "");
    }
    
    // Capitalize first letter of cleaned text if it was lowercased by starter removal
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

    if (cleaned.startsWith("[RECORD]")) return cleaned;
    return `[RECORD] ${cleaned}`;
  });

  return taggedParagraphs.join("\n\n");
}
