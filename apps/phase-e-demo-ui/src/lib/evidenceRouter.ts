/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Deterministic router for evidence based on classified question type.
 */

import { QuestionType } from "./questionTypeClassifier";
import { PatientContext } from "./demoPatientContext";
import { PatientTimeline, TimelineEvent } from "./demoPatientTimeline";

export interface RoutedEvidence {
  questionType: QuestionType;
  whyThisRouting: string;
  evidenceItems: TimelineEvent[];
  evidenceFromContext: {
    medications?: string[];
    conditions?: string[];
    patientName?: string;
    patientId?: string;
  };
  missingDataFlags: string[];
}

/**
 * Routes evidence deterministically by QuestionType.
 * Preserves strict read-only, deterministic posture.
 */
export function routeEvidence(args: {
  message: string;
  questionType: QuestionType;
  patientContext: PatientContext;
  patientTimeline: PatientTimeline;
}): RoutedEvidence {
  const { questionType, patientContext, patientTimeline } = args;
  const msg = args.message.toLowerCase();

  const routed: RoutedEvidence = {
    questionType,
    whyThisRouting: `Based on detected intent: ${questionType}`,
    evidenceItems: [],
    evidenceFromContext: {
      patientName: patientContext.fullName,
      patientId: patientContext.patientId,
    },
    missingDataFlags: [],
  };

  const events = patientTimeline.events || [];

  switch (questionType) {
    case "LAB_RESULTS": {
      // LAB_RESULTS: select up to 3 most recent timeline items that are LAB-type or whose title includes hba1c/a1c/cmp/glucose/lab
      const labKeywords = ["lab", "hba1c", "a1c", "cmp", "glucose", "results"];
      const labItems = events
        .filter((e) => {
          const title = e.title.toLowerCase();
          const isLabType = e.type === "event" && (title.includes("lab") || title.includes("results")); // Assuming labs are events with these titles
          const matchesKeyword = labKeywords.some((k) => title.includes(k));
          return isLabType || matchesKeyword;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

      routed.evidenceItems = labItems;
      if (labItems.length === 0) {
        routed.missingDataFlags.push("No lab result objects in provided data.");
      }
      break;
    }

    case "MEDICATION_LIST": {
      // MEDICATION_LIST: use context medications; evidenceItems empty
      routed.evidenceFromContext.medications = patientContext.currentMedications;
      if (!patientContext.currentMedications || patientContext.currentMedications.length === 0) {
        routed.missingDataFlags.push("No medications in patient context.");
      }
      break;
    }

    case "LAST_VISIT_SUMMARY": {
      // LAST_VISIT_SUMMARY: select most recent VISIT item
      const lastVisit = events
        .filter((e) => e.type === "visit")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      if (lastVisit) {
        routed.evidenceItems = [lastVisit];
      } else {
        routed.missingDataFlags.push("No visit objects in provided data.");
      }
      break;
    }

    case "DIAGNOSIS_HISTORY": {
      // DIAGNOSIS_HISTORY: select NOTE/VISIT items containing diagnosis/assessment/dx keywords OR a diagnosis field if your timeline model has it
      const diagKeywords = ["diagnosis", "diagnosed", "assessment", "dx", "problem list"];
      const diagItems = events.filter((e) => {
        const text = (e.title + " " + e.summary).toLowerCase();
        return (e.type === "visit" || e.type === "note") && diagKeywords.some((k) => text.includes(k));
      });

      routed.evidenceItems = diagItems;
      routed.evidenceFromContext.conditions = patientContext.knownConditions;
      if (diagItems.length === 0 && (!patientContext.knownConditions || patientContext.knownConditions.length === 0)) {
        routed.missingDataFlags.push("No diagnosis references were present in provided data.");
      }
      break;
    }

    case "APPOINTMENT_LOOKUP": {
      // APPOINTMENT_LOOKUP: select appointment items if your model has them; otherwise return missingDataFlags: ["No appointment objects in provided data."]
      const appointments = events.filter((e) => e.title.toLowerCase().includes("appointment") || e.type === "event" && e.title.toLowerCase().includes("next visit"));
      
      if (appointments.length > 0) {
        routed.evidenceItems = appointments;
      } else {
        routed.missingDataFlags.push("No appointment objects in provided data.");
      }
      break;
    }

    case "GENERAL_SUMMARY": {
      // GENERAL_SUMMARY: allow falling back to your existing relevanceSelector logic is handled in assistant page
      // Here we just provide basic context and a few recent items
      routed.evidenceItems = events
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      routed.evidenceFromContext.conditions = patientContext.knownConditions;
      routed.evidenceFromContext.medications = patientContext.currentMedications;
      break;
    }

    case "UNKNOWN": {
      // UNKNOWN: evidenceItems empty and missingDataFlags includes a single "Intent ambiguous: needs clarification."
      routed.missingDataFlags.push("Intent ambiguous: needs clarification.");
      break;
    }
  }

  return routed;
}
