"use server";

import { executeClinicalDrafting } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION, MOCK_CLINICIAN } from "@/lib/mocks";

export async function generateClinicalDraft(formData: FormData, useInvalidSession: boolean = false) {
  const intent = formData.get("intent") as string;
  const structure = formData.get("structure") as string;
  const tone = formData.get("tone") as string;

  if (!intent) {
    throw new Error("Intent is required");
  }

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
