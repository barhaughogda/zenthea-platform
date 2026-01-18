"use server";

import { executeClinicalDrafting } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION, MOCK_CLINICIAN } from "@/lib/mocks";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "@/lib/demoPatientTimeline";
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";

const persistenceAdapter = createPilotPersistenceAdapter();

// =============================================================================
// DETERMINISTIC SOAP EXTRACTION - KEYWORD LISTS
// =============================================================================

/** Keywords indicating objective/observable clinical findings */
const OBJECTIVE_KEYWORDS = [
  "on exam",
  "vital",
  "observed",
  "appears",
  "measured",
  "blood pressure",
  "bp",
  "heart rate",
  "pulse",
  "temperature",
  "respiratory rate",
  "oxygen saturation",
  "spo2",
  "weight",
  "height",
  "bmi",
  "inspection",
  "palpation",
  "auscultation",
  "percussion",
  "examination",
  "findings",
  "normal",
  "abnormal",
  "unremarkable",
  "noted",
] as const;

/** Keywords indicating assessment/diagnostic framing */
const ASSESSMENT_KEYWORDS = [
  "assessment",
  "likely",
  "suggests",
  "consistent with",
  "appears to be",
  "impression",
  "diagnosis",
  "differential",
  "concern for",
  "suspect",
  "indicative of",
  "presentation",
  "clinical picture",
] as const;

/** Keywords indicating plan/forward actions */
const PLAN_KEYWORDS = [
  "plan",
  "recommend",
  "start",
  "stop",
  "follow up",
  "follow-up",
  "prescribe",
  "order",
  "refer",
  "schedule",
  "discontinue",
  "continue",
  "monitor",
  "return",
  "labs",
  "imaging",
  "medication",
  "therapy",
  "treatment",
  "advise",
  "counseled",
  "education",
] as const;

// =============================================================================
// DETERMINISTIC SOAP EXTRACTION - TYPES
// =============================================================================

interface TranscriptSegment {
  speaker: "Patient" | "Clinician" | "Unknown";
  content: string;
}

interface SoapDraft {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

// =============================================================================
// DETERMINISTIC SOAP EXTRACTION - PARSING LOGIC
// =============================================================================

/**
 * Parse a formatted transcript into speaker-labeled segments.
 * 
 * Expected format: "[Patient]: ..." or "[Clinician]: ..."
 * Each segment is on its own line or separated by speaker labels.
 */
function parseTranscriptSegments(transcript: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  
  // Regex to match speaker labels: [Patient]: or [Clinician]:
  const speakerPattern = /\[(Patient|Clinician)\]:\s*/gi;
  
  // Split by speaker labels while capturing the label
  const parts = transcript.split(speakerPattern);
  
  // parts will alternate: [before first label, label1, content1, label2, content2, ...]
  // Skip the first element if it's empty or just whitespace
  let i = 0;
  if (parts[0] && !parts[0].trim()) {
    i = 1;
  } else if (parts[0] && parts[0].trim()) {
    // Content before any speaker label - treat as Unknown
    segments.push({
      speaker: "Unknown",
      content: parts[0].trim(),
    });
    i = 1;
  } else {
    i = 1;
  }
  
  // Process speaker-content pairs
  while (i < parts.length - 1) {
    const speakerLabel = parts[i];
    const content = parts[i + 1];
    
    if (speakerLabel && content && content.trim()) {
      const speaker = speakerLabel.toLowerCase() === "patient" ? "Patient" : "Clinician";
      segments.push({
        speaker,
        content: content.trim(),
      });
    }
    i += 2;
  }
  
  return segments;
}

/**
 * Check if text contains any keyword from the list (case-insensitive).
 */
function containsKeyword(text: string, keywords: readonly string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Deterministically assign transcript segments to SOAP sections.
 * 
 * Rules:
 * - SUBJECTIVE: All Patient segments
 * - OBJECTIVE: Clinician statements with observable/exam keywords
 * - ASSESSMENT: Clinician statements with assessment framing keywords
 * - PLAN: Clinician statements with forward action keywords
 * 
 * Clinician statements may appear in multiple sections if they match multiple keyword sets.
 * If a clinician statement matches no keywords, it's not assigned to O/A/P.
 */
function assignSegmentsToSoap(segments: TranscriptSegment[]): SoapDraft {
  const subjectiveLines: string[] = [];
  const objectiveLines: string[] = [];
  const assessmentLines: string[] = [];
  const planLines: string[] = [];
  
  for (const segment of segments) {
    if (segment.speaker === "Patient") {
      // All patient speech goes to Subjective
      subjectiveLines.push(segment.content);
    } else if (segment.speaker === "Clinician") {
      // Clinician statements are categorized by keywords
      // A statement can appear in multiple sections if it matches multiple keyword sets
      
      if (containsKeyword(segment.content, OBJECTIVE_KEYWORDS)) {
        objectiveLines.push(segment.content);
      }
      
      if (containsKeyword(segment.content, ASSESSMENT_KEYWORDS)) {
        assessmentLines.push(segment.content);
      }
      
      if (containsKeyword(segment.content, PLAN_KEYWORDS)) {
        planLines.push(segment.content);
      }
    } else {
      // Unknown speaker - place in Subjective as fallback
      subjectiveLines.push(segment.content);
    }
  }
  
  // Format sections with appropriate placeholders for empty sections
  const subjective = subjectiveLines.length > 0
    ? subjectiveLines.join("\n\n")
    : "No patient-reported symptoms or history documented during this session.";
  
  const objective = objectiveLines.length > 0
    ? objectiveLines.join("\n\n")
    : "No objective findings documented during this session.";
  
  const assessment = assessmentLines.length > 0
    ? "AI-suggested assessment (requires clinician confirmation):\n\n" + assessmentLines.join("\n\n")
    : "Assessment to be determined by clinician.";
  
  const plan = planLines.length > 0
    ? "AI-suggested plan (requires clinician confirmation):\n\n" + planLines.join("\n\n")
    : "Plan to be defined by clinician.";
  
  return { subjective, objective, assessment, plan };
}

/**
 * Format a SOAP draft object into a readable string.
 */
function formatSoapDraft(soap: SoapDraft): string {
  const header = `This note was generated from a live transcript and is AI-suggested. The clinician is responsible for review, edits, and final content.

---

`;

  return `${header}SUBJECTIVE:
${soap.subjective}

OBJECTIVE:
${soap.objective}

ASSESSMENT:
${soap.assessment}

PLAN:
${soap.plan}`;
}

/**
 * Main deterministic SOAP extraction function.
 * 
 * Parses a speaker-labeled transcript and assigns content to SOAP sections
 * using explicit, reviewable keyword-based rules.
 */
function extractSoapDeterministically(transcript: string): SoapDraft {
  const segments = parseTranscriptSegments(transcript);
  return assignSegmentsToSoap(segments);
}

// =============================================================================
// EXPORTED SERVER ACTION
// =============================================================================

/**
 * Generate a SOAP draft from a transcript using deterministic extraction.
 * 
 * SAFETY INVARIANTS:
 * - Transcript is passed as input and used for draft generation only
 * - Transcript is NOT persisted, logged, or stored anywhere
 * - Transcript is NOT included in analytics or telemetry
 * - Returns only the generated draft text
 * - Uses deterministic, explainable rules (no probabilistic inference)
 * - No autonomous diagnosis or confidence scoring
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
    // Deterministic extraction: parse transcript and assign to SOAP sections
    const soapDraft = extractSoapDeterministically(trimmedTranscript);
    const formattedDraft = formatSoapDraft(soapDraft);
    
    return {
      success: true,
      draft: formattedDraft,
    };
  } catch {
    // SAFETY: Do not log the transcript in error handling
    // Fallback: place all content in Subjective to preserve editability
    try {
      const fallbackDraft = formatSoapDraft({
        subjective: trimmedTranscript,
        objective: "No objective findings documented during this session.",
        assessment: "Assessment to be determined by clinician.",
        plan: "Plan to be defined by clinician.",
      });
      
      return {
        success: true,
        draft: fallbackDraft,
      };
    } catch {
      return {
        success: false,
        draft: null,
        error: "Could not generate draft from transcript. You may edit the draft manually.",
      };
    }
  }
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
