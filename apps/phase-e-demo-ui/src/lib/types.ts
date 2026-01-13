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
}
