/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Deterministic response composer for user questions.
 * Preserves strict read-only, deterministic posture.
 */

import { QuestionType } from "./questionTypeClassifier";
import { RoutedEvidence } from "./evidenceRouter";

export interface ComposedResponse {
  headline: string;
  body: string;
  basedOn: string[];
}

/**
 * Composes a materially different primary response per QuestionType.
 */
export function composePrimaryResponse(args: {
  message: string;
  questionType: QuestionType;
  routed: RoutedEvidence;
}): ComposedResponse {
  const { questionType, routed } = args;

  let headline = "";
  let body = "";
  let basedOn: string[] = [];

  switch (questionType) {
    case "LAB_RESULTS":
      headline = "Lab results found (read-only)";
      if (routed.evidenceItems.length > 0) {
        const latestLab = routed.evidenceItems[0];
        body = `The most recent lab results for ${routed.evidenceFromContext.patientName} are from ${latestLab.date}: ${latestLab.title}. ${latestLab.summary}`;
        basedOn = routed.evidenceItems.map((e) => `${e.date}: ${e.title}`);
      } else {
        body = "No lab result values were present in provided data.";
        basedOn = ["Patient record search"];
      }
      break;

    case "MEDICATION_LIST":
      headline = "Medication list (read-only)";
      const meds = routed.evidenceFromContext.medications || [];
      if (meds.length > 0) {
        body = `Active medications for ${routed.evidenceFromContext.patientName}:\n${meds.map((m) => `- ${m}`).join("\n")}`;
        basedOn = ["Medication list from patient context"];
      } else {
        body = "No medications were present in provided data.";
        basedOn = ["Patient record search"];
      }
      break;

    case "LAST_VISIT_SUMMARY":
      headline = "Most recent visit summary (read-only)";
      if (routed.evidenceItems.length > 0) {
        const visit = routed.evidenceItems[0];
        body = `On ${visit.date}, the patient had a ${visit.title}. Summary: ${visit.summary}`;
        basedOn = [`${visit.date}: ${visit.title}`];
      } else {
        body = "No visit records were present in provided data.";
        basedOn = ["Patient record search"];
      }
      break;

    case "DIAGNOSIS_HISTORY":
      headline = "Diagnosis references in record (read-only)";
      const conditions = routed.evidenceFromContext.conditions || [];
      const diagEvidence = routed.evidenceItems.map((e) => `${e.date}: ${e.title}`);
      
      if (conditions.length > 0 || diagEvidence.length > 0) {
        let content = "";
        if (conditions.length > 0) {
          content += `Known conditions: ${conditions.join(", ")}.\n\n`;
        }
        if (diagEvidence.length > 0) {
          content += `References in history:\n${routed.evidenceItems.map(e => `- ${e.date}: ${e.title} - ${e.summary}`).join("\n")}`;
        }
        body = content.trim();
        basedOn = [...conditions.map(c => `Condition: ${c}`), ...diagEvidence];
      } else {
        body = "No diagnosis references were present in provided data.";
        basedOn = ["Patient record search"];
      }
      break;

    case "APPOINTMENT_LOOKUP":
      headline = "Appointments (read-only)";
      if (routed.evidenceItems.length > 0) {
        body = `Found ${routed.evidenceItems.length} appointment reference(s):\n${routed.evidenceItems.map(e => `- ${e.date}: ${e.title}`).join("\n")}`;
        basedOn = routed.evidenceItems.map(e => `${e.date}: ${e.title}`);
      } else {
        body = "No appointments were present in provided data.";
        basedOn = ["Patient record search"];
      }
      break;

    case "GENERAL_SUMMARY":
      headline = "Record summary (read-only)";
      body = `Summary for ${routed.evidenceFromContext.patientName}. The record includes ${routed.evidenceFromContext.conditions?.length || 0} known conditions and ${routed.evidenceFromContext.medications?.length || 0} active medications. Most recent activity: ${routed.evidenceItems[0]?.title || "None"}.`;
      basedOn = ["Patient context", ...routed.evidenceItems.map(e => `${e.date}: ${e.title}`)];
      break;

    case "UNKNOWN":
    default:
      headline = "Needs clarification (read-only)";
      body = "I'm not sure which part of the record you're asking about. Could you please specify if you're looking for labs, medications, or visit history?";
      basedOn = ["Intent classifier"];
      break;
  }

  return { headline, body, basedOn };
}
