"use server";

import { executeClinicalDrafting } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_CLINICIAN } from "@/lib/mocks";

export async function generateClinicalDraft(formData: FormData) {
  const intent = formData.get("intent") as string;
  const structure = formData.get("structure") as string;
  const tone = formData.get("tone") as string;

  if (!intent) {
    throw new Error("Intent is required");
  }

  const result = await executeClinicalDrafting(MOCK_PATIENT_SESSION, MOCK_CLINICIAN, {
    intent,
    clinicianConstraints: {
      structure: structure || undefined,
      tone: tone || undefined,
    }
  });

  return result;
}
