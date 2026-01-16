"use server";

import { executeClinicalDrafting } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION, MOCK_CLINICIAN } from "@/lib/mocks";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "@/lib/demoPatientTimeline";
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";

const persistenceAdapter = createPilotPersistenceAdapter();

export async function generateClinicalDraft(formData: FormData, useInvalidSession: boolean = false) {
  // TEMPORARY DRY-RUN LOGS
  console.log("[PILOT DRY-RUN] Invoking persistenceAdapter.recordDraftGenerated");
  const persistenceResult = await persistenceAdapter.recordDraftGenerated("HUMAN_CONFIRMED_END_SESSION", {
    draftId: `draft-${Date.now()}`,
    labels: ["AI Suggested", "Pilot Dry-Run"],
    authorId: "demo-clinician",
    ...({ source: "ui", humanAction: true } as any)
  } as any);
  console.log("[PILOT DRY-RUN] recordDraftGenerated result:", persistenceResult);

  const intentInput = formData.get("intent") as string;
  const structure = formData.get("structure") as string;
  const tone = formData.get("tone") as string;

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

  const result = await executeClinicalDrafting(session, MOCK_CLINICIAN, {
    intent,
    clinicianConstraints: {
      structure: structure || undefined,
      tone: tone || undefined,
    }
  });

  return result;
}
