/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Deterministic intent classifier for the non-executing assistant.
 * Uses keyword matching only — no LLM inference.
 */

import type { IntentBucket, IntentClassification } from "./types";

/**
 * Keyword rules for each intent bucket.
 * All matching is case-insensitive.
 */
const INTENT_KEYWORDS: Record<Exclude<IntentBucket, "unknown">, string[]> = {
  scheduling: [
    "appointment",
    "schedule",
    "reschedule",
    "book",
    "booking",
    "slot",
    "time",
    "date",
    "availability",
  ],
  clinical_drafting: [
    "note",
    "soap",
    "assessment",
    "plan",
    "diagnosis",
    "draft",
    "clinical",
    "summary for chart",
  ],
  record_summary: [
    "what happened",
    "last visit",
    "results",
    "labs",
    "imaging",
    "discharge",
    "medication",
    "follow-up",
    "followup",
    "history",
  ],
  billing_explanation: [
    "bill",
    "invoice",
    "cost",
    "charge",
    "payment",
    "refund",
    "insurance",
  ],
};

/**
 * Normalizes a message for keyword matching.
 */
function normalizeMessage(message: string): string {
  return message.toLowerCase().trim();
}

/**
 * Finds all matching keywords in a message for a given intent.
 */
function findMatchingKeywords(
  normalizedMessage: string,
  keywords: string[]
): string[] {
  return keywords.filter((keyword) => normalizedMessage.includes(keyword));
}

/**
 * Classifies a user message into an intent bucket using deterministic keyword matching.
 *
 * Rules:
 * - Matches keywords in priority order (scheduling, clinical_drafting, record_summary, billing_explanation)
 * - Returns the first bucket with matching keywords
 * - Returns "unknown" if no keywords match
 * - Confidence is "high" if 2+ keywords match, "low" otherwise
 */
export function classifyIntent(message: string): IntentClassification {
  const normalized = normalizeMessage(message);

  // Check each intent bucket in priority order
  const intentOrder: Exclude<IntentBucket, "unknown">[] = [
    "scheduling",
    "clinical_drafting",
    "record_summary",
    "billing_explanation",
  ];

  // Collect matches for all intents
  const allMatches: { intent: Exclude<IntentBucket, "unknown">; keywords: string[] }[] = [];

  for (const intent of intentOrder) {
    const matchedKeywords = findMatchingKeywords(
      normalized,
      INTENT_KEYWORDS[intent]
    );
    if (matchedKeywords.length > 0) {
      allMatches.push({ intent, keywords: matchedKeywords });
    }
  }

  // If no matches, return unknown
  if (allMatches.length === 0) {
    return {
      intent: "unknown",
      matchedKeywords: [],
      confidence: "low",
    };
  }

  // Select the intent with the most keyword matches
  // If tied, use the first one in priority order
  const bestMatch = allMatches.reduce((best, current) =>
    current.keywords.length > best.keywords.length ? current : best
  );

  return {
    intent: bestMatch.intent,
    matchedKeywords: bestMatch.keywords,
    confidence: bestMatch.keywords.length >= 2 ? "high" : "low",
  };
}

/**
 * Gets a human-readable label for an intent bucket.
 */
export function getIntentLabel(intent: IntentBucket): string {
  const labels: Record<IntentBucket, string> = {
    scheduling: "Scheduling & Appointments",
    clinical_drafting: "Clinical Documentation",
    record_summary: "Record Summary",
    billing_explanation: "Billing & Insurance",
    unknown: "General Inquiry",
  };
  return labels[intent];
}
