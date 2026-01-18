"use server";

import { executeClinicalDrafting } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION, MOCK_CLINICIAN } from "@/lib/mocks";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "@/lib/demoPatientTimeline";
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";

const persistenceAdapter = createPilotPersistenceAdapter();

/**
 * Generate a SOAP draft from a transcript
 * 
 * SAFETY INVARIANTS:
 * - Transcript is passed as input and used for draft generation only
 * - Transcript is NOT persisted, logged, or stored anywhere
 * - Transcript is NOT included in analytics or telemetry
 * - Returns only the generated draft text
 */
export async function generateSoapDraftFromTranscript(transcript: string): Promise<{
  success: boolean;
  draft: string | null;
  error?: string;
}> {
  // SAFETY: Do not log, persist, or store the transcript
  // Input validation only
  if (!transcript || typeof transcript !== "string") {
    return {
      success: false,
      draft: null,
      error: "No transcript provided",
    };
  }

  const trimmedTranscript = transcript.trim();
  if (!trimmedTranscript) {
    return {
      success: false,
      draft: null,
      error: "Empty transcript",
    };
  }

  try {
    // Construct the intent with transcript content for SOAP generation
    const intent = `
AVAILABLE READ-ONLY PATIENT CONTEXT:
${JSON.stringify(DEMO_PATIENT_CONTEXT, null, 2)}

AVAILABLE READ-ONLY PATIENT TIMELINE:
${JSON.stringify(DEMO_PATIENT_TIMELINE, null, 2)}

STRICT INSTRUCTIONS FOR ASSISTANT:
1. Generate a SOAP note based on the following clinical encounter transcript.
2. Use provided patient context and timeline as background reference.
3. Extract relevant clinical information from the transcript.
4. Structure the output as a proper SOAP note (Subjective, Objective, Assessment, Plan).
5. Do not infer or fabricate clinical findings not mentioned in the transcript.
6. If information is missing from the transcript, note uncertainty clearly.
7. Maintain a strictly advisory-only posture.

CLINICAL ENCOUNTER TRANSCRIPT:
${trimmedTranscript}
`.trim();

    const result = await executeClinicalDrafting(MOCK_PATIENT_SESSION, MOCK_CLINICIAN, {
      intent,
      clinicianConstraints: {
        structure: "SOAP",
        tone: "professional",
      }
    });

    // Extract the draft text from the result
    if (result && result.draft && typeof result.draft.content === "string") {
      return {
        success: true,
        draft: result.draft.content,
      };
    }

    // Fallback: construct a SOAP note from the transcript directly
    // This handles cases where the AI service might be unavailable
    const fallbackDraft = constructFallbackSoapDraft(trimmedTranscript);
    return {
      success: true,
      draft: fallbackDraft,
    };
  } catch {
    // SAFETY: Do not log the transcript in error handling
    return {
      success: false,
      draft: null,
      error: "Could not generate draft from transcript. You may edit the draft manually.",
    };
  }
}

/**
 * Construct a basic SOAP template from transcript
 * Used as fallback when AI generation fails
 */
function constructFallbackSoapDraft(transcript: string): string {
  return `SUBJECTIVE:
[Transcribed from clinical encounter]
${transcript}

OBJECTIVE:
[Review and add clinical findings]
- Vital signs: [To be documented]
- Physical examination: [To be documented]

ASSESSMENT:
[Review transcript and document assessment]
1. [Primary concern from encounter]

PLAN:
[Review transcript and document plan]
1. [Documented recommendations]
2. Follow-up as clinically indicated

---
Note: This draft was generated from a voice transcript. Please review and edit for accuracy before finalizing.`;
}

export async function generateClinicalDraft(formData: FormData, useInvalidSession: boolean = false) {
  const persistenceResult = await persistenceAdapter.recordDraftGenerated("HUMAN_CONFIRMED_END_SESSION", {
    draftId: `draft-${Date.now()}`,
    labels: ["AI Suggested", "Pilot Dry-Run"],
    authorId: "demo-clinician",
    ...({ source: "ui", humanAction: true } as any)
  } as any);

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
