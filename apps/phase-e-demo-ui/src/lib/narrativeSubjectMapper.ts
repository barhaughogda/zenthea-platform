/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 * 
 * Phase R-08: Perspective-Aware Narrative Subject Mapping
 * 
 * This utility adjusts the grammatical subject of the primary assistant response
 * based on the selected DemoPerspective. It applies deterministic string 
 * transformations to ensure the framing matches the perspective without 
 * altering facts, evidence, or reasoning.
 * 
 * Rules:
 * - Patient: Convert 3rd-person ("the patient") to 2nd-person ("you").
 * - Clinician: Pass-through (no changes).
 * - Operator: Convert to system/record framing ("this record") and add tags.
 * 
 * Safety:
 * - NO LLMs, no randomness.
 * - NO introduction of advice or actions.
 * - NO changes to dates, counts, or diagnoses.
 */

import { DemoPerspective } from "./demoPerspectiveContext";

/**
 * Maps the grammatical subject of a narrative string based on perspective.
 * 
 * @param text The original narrative text
 * @param perspective The current demo perspective
 * @returns The transformed text
 */
export function mapNarrativeSubject(text: string, perspective: DemoPerspective): string {
  if (!text) return text;

  switch (perspective) {
    case "patient":
      return transformToSecondPerson(text);
    case "operator":
      return transformToRecordFraming(text);
    case "clinician":
    default:
      return text;
  }
}

/**
 * Transforms third-person patient references to second-person.
 * "the patient" -> "you"
 * "The patient" -> "You"
 * "the patient's" -> "your"
 * "The patient's" -> "Your"
 */
function transformToSecondPerson(text: string): string {
  let transformed = text;

  // Handle possessives first to avoid partial matches
  transformed = transformed.replace(/the patient's/g, "your");
  transformed = transformed.replace(/The patient's/g, "Your");
  
  // Handle direct references
  transformed = transformed.replace(/the patient/g, "you");
  transformed = transformed.replace(/The patient/g, "You");

  return transformed;
}

/**
 * Transforms third-person patient references to record-level framing.
 * "the patient" -> "this record"
 * "The patient" -> "This record"
 * "the patient's" -> "this record's"
 * "The patient's" -> "This record's"
 * 
 * Also adds [RECORD] tags to paragraph starts.
 */
function transformToRecordFraming(text: string): string {
  let transformed = text;

  // Handle possessives first
  transformed = transformed.replace(/the patient's/g, "this record's");
  transformed = transformed.replace(/The patient's/g, "This record's");
  
  // Handle direct references
  transformed = transformed.replace(/the patient/g, "this record");
  transformed = transformed.replace(/The patient/g, "This record");

  // Prefix paragraphs with [RECORD] tag
  const paragraphs = transformed.split("\n\n");
  const taggedParagraphs = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return p;
    // Don't double-tag if already tagged
    if (trimmed.startsWith("[RECORD]")) return p;
    return `[RECORD] ${trimmed}`;
  });

  return taggedParagraphs.join("\n\n");
}
