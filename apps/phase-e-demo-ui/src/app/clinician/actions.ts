"use server";

import { executeClinicalDrafting } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION, MOCK_CLINICIAN } from "@/lib/mocks";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "@/lib/demoPatientTimeline";
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";

const persistenceAdapter = createPilotPersistenceAdapter();

// =============================================================================
// TWO-PASS SOAP EXTRACTION - INTENT TYPES
// =============================================================================

/**
 * Intent types for Pass 1 classification.
 * Each transcript segment is assigned exactly one intent.
 */
type Intent = 
  | "question"           // Clinician questions (excluded from SOAP sections)
  | "symptom_or_history" // Patient-reported symptoms, history, complaints
  | "observation"        // Clinician factual findings (vitals, exam)
  | "reasoning"          // Clinician causal explanations ("this is because...")
  | "instruction"        // Clinician advice, meds, follow-ups
  | "acknowledgement";   // Short responses ("ok", "thanks", "yes")

// =============================================================================
// TWO-PASS SOAP EXTRACTION - KEYWORD LISTS
// =============================================================================

/** Keywords indicating questions (clinician interrogatives) */
const QUESTION_KEYWORDS = [
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
] as const;

/** Keywords indicating objective/observable clinical findings */
const OBSERVATION_KEYWORDS = [
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
  "see that",
  "i see",
  "i notice",
  "looks",
] as const;

/** 
 * Keywords indicating clinical reasoning/causal explanation.
 * These go to ASSESSMENT.
 * Captures informal clinician speech patterns explaining "why" symptoms occur.
 */
const REASONING_KEYWORDS = [
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

/** Keywords indicating plan/forward actions (actions only, no explanations) */
const INSTRUCTION_KEYWORDS = [
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
  "drink",
  "rest",
  "come back",
  "see me",
  "call",
  "contact",
] as const;

/** Short acknowledgement phrases */
const ACKNOWLEDGEMENT_PHRASES = [
  "ok",
  "okay",
  "yes",
  "no",
  "yeah",
  "yep",
  "nope",
  "uh-huh",
  "mm-hmm",
  "thanks",
  "thank you",
  "got it",
  "understood",
  "alright",
  "all right",
  "sure",
  "right",
  "i see",
  "i understand",
] as const;

// =============================================================================
// TWO-PASS SOAP EXTRACTION - TYPES
// =============================================================================

interface TranscriptSegment {
  speaker: "Patient" | "Clinician" | "Unknown";
  content: string;
}

/**
 * Pass 1 output: Segment with attributed intent.
 * Intent is assigned deterministically using keyword rules.
 */
interface AttributedSegment {
  speaker: "Patient" | "Clinician" | "Unknown";
  content: string;
  intent: Intent;
}

interface SoapDraft {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

// =============================================================================
// TWO-PASS SOAP EXTRACTION - PARSING LOGIC
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
 * Check if text starts with any phrase from the list (case-insensitive).
 */
function startsWithPhrase(text: string, phrases: readonly string[]): boolean {
  const lowerText = text.toLowerCase().trim();
  return phrases.some(phrase => lowerText.startsWith(phrase.toLowerCase()));
}

/**
 * Check if text is a short acknowledgement (case-insensitive, exact or near-exact match).
 */
function isAcknowledgement(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  // Check for exact match or very short content with acknowledgement word
  const words = trimmed.split(/\s+/);
  
  // Very short responses (1-3 words) that start with acknowledgement phrases
  if (words.length <= 3) {
    return ACKNOWLEDGEMENT_PHRASES.some(phrase => 
      trimmed === phrase || trimmed.startsWith(phrase + " ") || trimmed.startsWith(phrase + ",")
    );
  }
  return false;
}

/**
 * Check if a statement is a question.
 */
function isQuestion(text: string): boolean {
  const trimmed = text.trim();
  // Direct question mark at end
  if (trimmed.endsWith("?")) {
    return true;
  }
  // Interrogative phrases at start (even without question mark)
  return startsWithPhrase(trimmed, QUESTION_KEYWORDS);
}

// =============================================================================
// PASS 1: INTENT ATTRIBUTION
// =============================================================================

/**
 * PASS 1: Attribute intent to each transcript segment.
 * 
 * Rules (deterministic, keyword-based):
 * - Patient speech defaults to symptom_or_history unless clearly acknowledgement
 * - Clinician questions → question
 * - Clinician causal explanations → reasoning
 * - Clinician advice, meds, hydration, follow-ups → instruction
 * - Clinician factual findings → observation
 * - Short responses ("ok", "thanks") → acknowledgement
 * 
 * Priority order for clinician speech (first match wins):
 * 1. Question (explicit exclusion from SOAP)
 * 2. Acknowledgement (very short responses)
 * 3. Reasoning (causal explanations - goes to Assessment)
 * 4. Observation (factual findings - goes to Objective)
 * 5. Instruction (forward actions - goes to Plan)
 * 6. Default: reasoning (conservative fallback for clinician)
 */
function attributeIntent(segment: TranscriptSegment): AttributedSegment {
  const { speaker, content } = segment;
  const lowerContent = content.toLowerCase();
  
  // Patient speech classification
  if (speaker === "Patient") {
    // Check for acknowledgement first
    if (isAcknowledgement(content)) {
      return { speaker, content, intent: "acknowledgement" };
    }
    // Default: Patient speech is symptom/history
    return { speaker, content, intent: "symptom_or_history" };
  }
  
  // Clinician speech classification (priority order)
  if (speaker === "Clinician") {
    // 1. Questions - explicitly excluded from SOAP
    if (isQuestion(content)) {
      return { speaker, content, intent: "question" };
    }
    
    // 2. Acknowledgement - very short responses
    if (isAcknowledgement(content)) {
      return { speaker, content, intent: "acknowledgement" };
    }
    
    // 3. Reasoning - causal explanations (goes to Assessment)
    // Check reasoning BEFORE instruction to prioritize explanations over action words
    if (containsKeyword(lowerContent, REASONING_KEYWORDS)) {
      return { speaker, content, intent: "reasoning" };
    }
    
    // 4. Observation - factual clinical findings (goes to Objective)
    if (containsKeyword(lowerContent, OBSERVATION_KEYWORDS)) {
      return { speaker, content, intent: "observation" };
    }
    
    // 5. Instruction - forward actions (goes to Plan)
    if (containsKeyword(lowerContent, INSTRUCTION_KEYWORDS)) {
      return { speaker, content, intent: "instruction" };
    }
    
    // 6. Default for clinician: reasoning (conservative - goes to Assessment)
    // This ensures clinician speech doesn't get lost
    return { speaker, content, intent: "reasoning" };
  }
  
  // Unknown speaker - treat as patient symptom/history (conservative)
  return { speaker, content, intent: "symptom_or_history" };
}

/**
 * PASS 1: Attribute intents to all segments.
 */
function pass1AttributeIntents(segments: TranscriptSegment[]): AttributedSegment[] {
  return segments.map(attributeIntent);
}

// =============================================================================
// PASS 2: SOAP ASSIGNMENT FROM INTENTS
// =============================================================================

/**
 * PASS 2: Map attributed segments to SOAP sections.
 * 
 * Mapping rules:
 * - SUBJECTIVE: Patient + symptom_or_history, Patient + acknowledgement (optional)
 * - OBJECTIVE: Clinician + observation
 * - ASSESSMENT: Clinician + reasoning (prefixed with AI disclaimer)
 * - PLAN: Clinician + instruction (prefixed with AI disclaimer)
 * - QUESTIONS: Explicitly EXCLUDED from all SOAP sections
 * 
 * Fallback: If no content for a section, include placeholder text.
 */
function pass2AssignToSoap(attributedSegments: AttributedSegment[]): SoapDraft {
  const subjectiveLines: string[] = [];
  const objectiveLines: string[] = [];
  const assessmentLines: string[] = [];
  const planLines: string[] = [];
  
  for (const segment of attributedSegments) {
    const { speaker, content, intent } = segment;
    
    // SUBJECTIVE: Patient symptom/history and acknowledgements
    if (speaker === "Patient" && (intent === "symptom_or_history" || intent === "acknowledgement")) {
      subjectiveLines.push(content);
    }
    
    // OBJECTIVE: Clinician observations
    if (speaker === "Clinician" && intent === "observation") {
      objectiveLines.push(content);
    }
    
    // ASSESSMENT: Clinician reasoning
    if (speaker === "Clinician" && intent === "reasoning") {
      assessmentLines.push(content);
    }
    
    // PLAN: Clinician instructions
    if (speaker === "Clinician" && intent === "instruction") {
      planLines.push(content);
    }
    
    // QUESTIONS: Explicitly excluded (no assignment)
    // ACKNOWLEDGEMENTS from clinician: Excluded (not clinically relevant)
    
    // Unknown speaker with symptom_or_history: Include in Subjective
    if (speaker === "Unknown" && intent === "symptom_or_history") {
      subjectiveLines.push(content);
    }
  }
  
  // ==========================================================================
  // FORMAT OUTPUT WITH PLACEHOLDERS AND DISCLAIMERS
  // ==========================================================================
  
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
 * TWO-PASS SOAP EXTRACTION
 * 
 * Combines Pass 1 (Intent Attribution) and Pass 2 (SOAP Assignment)
 * for clean, intent-aware transcript processing.
 */
function assignSegmentsToSoap(segments: TranscriptSegment[]): SoapDraft {
  // Pass 1: Attribute intent to each segment
  const attributedSegments = pass1AttributeIntents(segments);
  
  // Pass 2: Map intents to SOAP sections
  return pass2AssignToSoap(attributedSegments);
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
