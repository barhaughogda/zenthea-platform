/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Deterministic classifier for user questions.
 * Preserves strict read-only, non-executing posture.
 */

export type QuestionType =
  | "LAST_VISIT_SUMMARY"
  | "LAB_RESULTS"
  | "MEDICATION_LIST"
  | "DIAGNOSIS_HISTORY"
  | "APPOINTMENT_LOOKUP"
  | "GENERAL_SUMMARY"
  | "UNKNOWN";

/**
 * Deterministically classifies a user message based on keyword rules.
 * Priority: LAB > MEDS > APPOINTMENT > LAST_VISIT > DIAGNOSIS > GENERAL
 */
export function classifyQuestionType(message: string): QuestionType {
  const msg = message.toLowerCase();

  // LAB_RESULTS: lab, results, hba1c, a1c, cmp, glucose, blood test
  if (
    msg.includes("lab") ||
    msg.includes("results") ||
    msg.includes("hba1c") ||
    msg.includes("a1c") ||
    msg.includes("cmp") ||
    msg.includes("glucose") ||
    msg.includes("blood test")
  ) {
    return "LAB_RESULTS";
  }

  // MEDICATION_LIST: medication, meds, prescription, metformin, lisinopril
  if (
    msg.includes("medication") ||
    msg.includes("meds") ||
    msg.includes("prescription") ||
    msg.includes("metformin") ||
    msg.includes("lisinopril")
  ) {
    return "MEDICATION_LIST";
  }

  // APPOINTMENT_LOOKUP: appointment, schedule, booking, next visit, when is my next
  if (
    msg.includes("appointment") ||
    msg.includes("schedule") ||
    msg.includes("booking") ||
    msg.includes("next visit") ||
    msg.includes("when is my next")
  ) {
    return "APPOINTMENT_LOOKUP";
  }

  // LAST_VISIT_SUMMARY: last visit, most recent visit, what happened at the last
  if (
    msg.includes("last visit") ||
    msg.includes("most recent visit") ||
    msg.includes("what happened at the last")
  ) {
    return "LAST_VISIT_SUMMARY";
  }

  // DIAGNOSIS_HISTORY: diagnosis, diagnosed, assessment, dx, problem list
  if (
    msg.includes("diagnosis") ||
    msg.includes("diagnosed") ||
    msg.includes("assessment") ||
    msg.includes("dx") ||
    msg.includes("problem list")
  ) {
    return "DIAGNOSIS_HISTORY";
  }

  // GENERAL_SUMMARY: summary, overview, what stands out
  if (
    msg.includes("summary") ||
    msg.includes("overview") ||
    msg.includes("what stands out")
  ) {
    return "GENERAL_SUMMARY";
  }

  return "UNKNOWN";
}
