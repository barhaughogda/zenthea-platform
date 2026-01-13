"use server";

import { executeSchedulingProposal } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION } from "@/lib/mocks";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "@/lib/demoPatientTimeline";

export async function generateSchedulingProposal(formData: FormData, useInvalidSession: boolean = false) {
  const intentInput = formData.get("intent") as string;
  const preferredTime = formData.get("preferredTime") as string;
  const appointmentType = formData.get("appointmentType") as string;
  const reason = formData.get("reason") as string;

  if (!intentInput) {
    throw new Error("Intent is required");
  }

  // Inject read-only context and timeline into the prompt construction
  const intent = `
AVAILABLE READ-ONLY PATIENT CONTEXT:
${JSON.stringify(DEMO_PATIENT_CONTEXT, null, 2)}

AVAILABLE READ-ONLY PATIENT TIMELINE:
${JSON.stringify(DEMO_PATIENT_TIMELINE, null, 2)}

STRICT INSTRUCTIONS FOR ASSISTANT:
1. Use provided context and timeline ONLY.
2. Do not infer missing data or expand beyond provided history.
3. Do not invent events or visits not listed in the timeline.
4. Maintain a strictly advisory-only posture.
5. Do not escalate authority or imply execution capability.
6. If information is missing, state uncertainty clearly.

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
