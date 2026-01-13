"use server";

import { executeClinicalDrafting } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION, MOCK_CLINICIAN } from "@/lib/mocks";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";

export async function generateClinicalDraft(formData: FormData, useInvalidSession: boolean = false) {
  const intentInput = formData.get("intent") as string;
  const structure = formData.get("structure") as string;
  const tone = formData.get("tone") as string;

  if (!intentInput) {
    throw new Error("Intent is required");
  }

  // Inject read-only context into the prompt construction
  const intent = `
AVAILABLE READ-ONLY PATIENT CONTEXT:
${JSON.stringify(DEMO_PATIENT_CONTEXT, null, 2)}

Do not infer, expand, or assume beyond this data.
If information is missing, state uncertainty.

USER INTENT:
${intentInput}
`.trim();

  const session = useInvalidSession ? MOCK_INVALID_PATIENT_SESSION : MOCK_PATIENT_SESSION;

  const result = await executeClinicalDrafting(session, MOCK_CLINICIAN, {
    intent,
    clinicianConstraints: {
      structure: structure || undefined,
      tone: tone || undefined,
    }
  });

  return result;
}
