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

/** 
 * Keywords indicating clinical reasoning/causal explanation.
 * These should go to ASSESSMENT, not PLAN.
 * Captures informal clinician speech patterns explaining "why" symptoms occur.
 */
const ASSESSMENT_REASONING_KEYWORDS = [
  "i think",
  "this is because",
  "that's your problem",
  "that is your problem",
  "the reason is",
  "what's happening is",
  "what is happening is",
  "this would explain",
  "it sounds like",
  "likely related to",
  "probably because",
  "most likely",
  "this means",
  "that means",
  "which means",
  "which explains",
  "that explains",
  "this explains",
  "due to",
  "caused by",
  "resulting from",
  "as a result of",
  "because of",
  "the issue is",
  "the problem is",
  "what we're seeing is",
  "what i'm seeing is",
  "my impression is",
  "my thinking is",
  "in my view",
  "based on this",
  "based on that",
  "based on what you've told me",
  "from what you're describing",
  "it looks like",
  "it seems like",
  "it appears that",
] as const;

/** Keywords indicating plan/forward actions (actions only, no explanations) */
const PLAN_KEYWORDS = [
  "plan",
  "recommend",
  "i suggest",
  "you should",
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
  "ensure",
  "make sure",
  "take",
  "avoid",
  "limit",
  "increase",
  "decrease",
  "reduce",
  "try",
  "let's",
  "we'll",
  "we will",
  "i'll",
  "i will",
  "next step",
  "going forward",
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
 * Check if a clinician statement is a question.
 * Questions are excluded from Plan and Assessment.
 */
function isQuestion(text: string): boolean {
  const trimmed = text.trim();
  // Direct question mark at end
  if (trimmed.endsWith("?")) {
    return true;
  }
  // Interrogative phrases at start (even without question mark)
  const lowerText = trimmed.toLowerCase();
  const interrogativePhrases = [
    "do you",
    "did you",
    "does it",
    "does that",
    "does this",
    "are you",
    "is it",
    "is that",
    "is this",
    "have you",
    "has it",
    "can you",
    "could you",
    "would you",
    "will you",
    "how do you",
    "how does",
    "how long",
    "how often",
    "how much",
    "what do you",
    "what does",
    "what is",
    "what's",
    "when do you",
    "when did",
    "when does",
    "where do you",
    "where does",
    "where is",
    "why do you",
    "why does",
    "which one",
    "tell me about",
    "can you describe",
    "can you tell me",
  ];
  return interrogativePhrases.some(phrase => lowerText.startsWith(phrase));
}

/**
 * Check if a statement is primarily reasoning/explanation (should be Assessment).
 * Used in reclassification pass to move explanatory content from Plan to Assessment.
 */
function isReasoningStatement(text: string): boolean {
  return containsKeyword(text, ASSESSMENT_REASONING_KEYWORDS);
}

/**
 * Check if a statement contains forward action intent (should be Plan).
 */
function isActionStatement(text: string): boolean {
  return containsKeyword(text, PLAN_KEYWORDS);
}

/**
 * Deterministically assign transcript segments to SOAP sections.
 * 
 * Rules:
 * - SUBJECTIVE: All Patient segments
 * - OBJECTIVE: Clinician statements with observable/exam keywords
 * - ASSESSMENT: Clinician statements with assessment framing OR reasoning/explanation keywords
 * - PLAN: Clinician statements with forward action keywords ONLY (no explanations, no questions)
 * 
 * Intent-Aware Classification:
 * - Questions are excluded from Plan and Assessment
 * - Reasoning/causal explanations go to Assessment (not Plan)
 * - Plan contains only forward actions
 * 
 * Reclassification Pass:
 * - After initial assignment, statements with both action and reasoning keywords
 *   are moved from Plan to Assessment (reasoning takes precedence)
 * - If ambiguous, prefer Assessment over Plan (safety)
 */
function assignSegmentsToSoap(segments: TranscriptSegment[]): SoapDraft {
  const subjectiveLines: string[] = [];
  const objectiveLines: string[] = [];
  const assessmentLines: string[] = [];
  const planLines: string[] = [];
  
  // Track statements that may need reclassification
  const potentialPlanStatements: { content: string; hasReasoning: boolean }[] = [];
  
  for (const segment of segments) {
    if (segment.speaker === "Patient") {
      // All patient speech goes to Subjective
      subjectiveLines.push(segment.content);
    } else if (segment.speaker === "Clinician") {
      const content = segment.content;
      const isQuestionStatement = isQuestion(content);
      const hasReasoning = isReasoningStatement(content);
      const hasAction = isActionStatement(content);
      const hasAssessmentKeyword = containsKeyword(content, ASSESSMENT_KEYWORDS);
      const hasObjectiveKeyword = containsKeyword(content, OBJECTIVE_KEYWORDS);
      
      // OBJECTIVE: Observable findings (questions allowed here, they're clinical queries)
      if (hasObjectiveKeyword) {
        objectiveLines.push(content);
      }
      
      // ASSESSMENT: Reasoning, explanations, or diagnostic framing
      // Questions are excluded from Assessment
      if (!isQuestionStatement && (hasAssessmentKeyword || hasReasoning)) {
        assessmentLines.push(content);
      }
      
      // PLAN: Forward actions only
      // Questions are excluded from Plan
      // Reasoning statements are excluded from Plan (they go to Assessment)
      if (!isQuestionStatement && hasAction) {
        // Track for reclassification pass
        potentialPlanStatements.push({ content, hasReasoning });
      }
    } else {
      // Unknown speaker - place in Subjective as fallback
      subjectiveLines.push(segment.content);
    }
  }
  
  // ==========================================================================
  // RECLASSIFICATION PASS
  // ==========================================================================
  // Review potential Plan statements and filter out those that are primarily
  // reasoning/explanation. If a statement has both action and reasoning keywords,
  // prefer Assessment (safety: don't put explanations in Plan).
  
  for (const statement of potentialPlanStatements) {
    if (statement.hasReasoning) {
      // Statement has reasoning markers - ensure it's in Assessment, not Plan
      // It may already be in Assessment from the first pass, but we ensure it's there
      if (!assessmentLines.includes(statement.content)) {
        assessmentLines.push(statement.content);
      }
      // Do NOT add to Plan (skip)
    } else {
      // Pure action statement - add to Plan
      planLines.push(statement.content);
    }
  }
  
  // ==========================================================================
  // FORMAT OUTPUT
  // ==========================================================================
  
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
