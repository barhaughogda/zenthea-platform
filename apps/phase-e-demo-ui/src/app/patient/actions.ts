"use server";

import { executeSchedulingProposal } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION } from "@/lib/mocks";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";

export async function generateSchedulingProposal(formData: FormData, useInvalidSession: boolean = false) {
  const intentInput = formData.get("intent") as string;
  const preferredTime = formData.get("preferredTime") as string;
  const appointmentType = formData.get("appointmentType") as string;
  const reason = formData.get("reason") as string;

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

  const result = await executeSchedulingProposal(session, {
    intent,
    preferredTime: preferredTime || undefined,
    appointmentType: appointmentType || undefined,
    reason: reason || undefined,
  });

  return result;
}
