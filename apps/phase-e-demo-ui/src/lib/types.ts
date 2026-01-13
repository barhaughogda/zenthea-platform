/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Shared types for the intent-aware reasoning layer.
 * These types are used for classification and relevance selection only.
 */

/**
 * Deterministic intent buckets for user message classification.
 * These are chosen via keyword rules, not LLM inference.
 */
export type IntentBucket =
  | "scheduling"
  | "clinical_drafting"
  | "record_summary"
  | "billing_explanation"
  | "unknown";

/**
 * Result of classifying a user message into an intent bucket.
 */
export interface IntentClassification {
  intent: IntentBucket;
  matchedKeywords: string[];
  confidence: "high" | "low"; // high if multiple keywords match, low if single or none
}

/**
 * A scored timeline item for relevance selection.
 */
export interface ScoredTimelineItem {
  date: string;
  type: "visit" | "note" | "event";
  title: string;
  summary: string;
  score: number;
  scoreBreakdown: {
    typeMatch: number;
    keywordMatch: number;
    recencyBonus: number;
  };
}

/**
 * Result of relevance selection over the demo timeline.
 */
export interface RelevanceResult {
  intent: IntentBucket;
  selectedItems: ScoredTimelineItem[];
  explanation: string[];
  hasEvidence: boolean;
  maxScore: number;
  evidenceAttribution: string[];
}

/**
 * A chat message in the assistant interface.
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  relevance?: RelevanceResult;
  comparativeInsights?: ComparativeInsights;
  confidenceAnnotations?: ConfidenceAnnotation[];
  actionReadiness?: ActionReadinessResult;
}

/**
 * Result of the action readiness evaluation.
 */
export interface ActionReadinessResult {
  category: "INFORMATIONAL_ONLY" | "REQUIRES_CLINICIAN_REVIEW" | "REQUIRES_PATIENT_CONFIRMATION" | "REQUIRES_ADDITIONAL_DATA" | "NOT_ACTIONABLE_IN_SYSTEM";
  explanation: string;
}

/**
 * Result of the comparative and temporal reasoning engine.
 * Observational only — no medical advice or recommendations.
 */
export type ComparativeInsights = {
  lastEncounter?: string;
  timeSinceLastEncounterDays?: number;
  differencesVsLastEncounter: string[];
  trends: string[];
  gaps: string[];
  evidenceAttribution: string[];
};

/**
 * Epistemic categories for confidence annotation.
 */
export type EpistemicCategory =
  | "OBSERVED" // Directly stated in patient context or timeline
  | "PATTERN" // Derived from repetition, comparison, or time gaps
  | "COMPARATIVE" // Change over time, trend, before vs after
  | "UNCERTAIN"; // Insufficient data, ambiguity, or missing follow-up

/**
 * Confidence levels for annotations.
 */
export type ConfidenceLevel = "High" | "Medium" | "Low";

/**
 * A single annotated statement with confidence details.
 */
export interface ConfidenceAnnotation {
  statement: string;
  category: EpistemicCategory;
  confidence: ConfidenceLevel;
  reason: string;
}
