/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Deterministic relevance selector for the non-executing assistant.
 * Scores and selects timeline items based on intent and keyword matching.
 * No LLM inference — purely rule-based scoring.
 */

import type { TimelineEvent, PatientTimeline } from "./demoPatientTimeline";
import type { IntentBucket, ScoredTimelineItem, RelevanceResult } from "./types";
import { classifyIntent, getIntentLabel } from "./intentClassifier";

/**
 * Type match rules for scoring.
 * Maps intent buckets to relevant event types.
 */
const TYPE_MATCH_RULES: Record<Exclude<IntentBucket, "unknown">, ("visit" | "note" | "event")[]> = {
  scheduling: ["visit", "event"],
  clinical_drafting: ["note", "visit"],
  record_summary: ["visit", "event", "note"],
  billing_explanation: ["event"], // billing events would have specific markers
};

/**
 * Keywords that indicate billing-related events.
 */
const BILLING_KEYWORDS = ["bill", "invoice", "charge", "payment", "insurance", "copay", "claim"];

/**
 * Normalizes text for keyword matching.
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Extracts keywords from a user message for content matching.
 */
function extractContentKeywords(message: string): string[] {
  // Extract meaningful words (3+ characters, not common stop words)
  const stopWords = new Set([
    "the", "and", "for", "are", "but", "not", "you", "all",
    "can", "her", "was", "one", "our", "out", "has", "have",
    "been", "will", "what", "when", "where", "how", "who",
    "this", "that", "with", "from", "they", "more", "some",
    "than", "into", "just", "your", "about", "would", "could",
    "should", "their", "there", "which", "these", "those",
    "want", "need", "please", "tell", "show", "give",
  ]);

  const words = normalizeText(message)
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !stopWords.has(word));

  return [...new Set(words)];
}

/**
 * Checks if an event contains billing-related content.
 */
function isBillingRelated(event: TimelineEvent): boolean {
  const text = normalizeText(`${event.title} ${event.summary}`);
  return BILLING_KEYWORDS.some((keyword) => text.includes(keyword));
}

/**
 * Scores a timeline event based on intent and user message.
 *
 * Scoring rules:
 * - +3 if event type matches intent
 * - +2 if user message keyword appears in event title/summary
 * - +1 if event is the most recent
 */
function scoreEvent(
  event: TimelineEvent,
  intent: IntentBucket,
  messageKeywords: string[],
  isMostRecent: boolean
): ScoredTimelineItem {
  let typeMatch = 0;
  let keywordMatch = 0;
  const recencyBonus = isMostRecent ? 1 : 0;

  // Type match scoring
  if (intent !== "unknown") {
    const matchingTypes = TYPE_MATCH_RULES[intent];
    if (matchingTypes.includes(event.type)) {
      // For billing, also check if the event content is billing-related
      if (intent === "billing_explanation") {
        if (isBillingRelated(event)) {
          typeMatch = 3;
        }
      } else {
        typeMatch = 3;
      }
    }
  }

  // Keyword match scoring
  const eventText = normalizeText(`${event.title} ${event.summary}`);
  for (const keyword of messageKeywords) {
    if (eventText.includes(keyword)) {
      keywordMatch = 2;
      break; // Only count once
    }
  }

  return {
    ...event,
    score: typeMatch + keywordMatch + recencyBonus,
    scoreBreakdown: {
      typeMatch,
      keywordMatch,
      recencyBonus,
    },
  };
}

/**
 * Selects the most relevant timeline items for a user message.
 *
 * Process:
 * 1. Classify intent from message
 * 2. Score all timeline events
 * 3. Sort by score (desc), then by date (desc)
 * 4. Select top 3 with score > 0
 * 5. Generate explanation bullets
 */
export function selectRelevantItems(
  message: string,
  timeline: PatientTimeline
): RelevanceResult {
  const classification = classifyIntent(message);
  const messageKeywords = extractContentKeywords(message);

  // Sort events by date to find most recent
  const sortedByDate = [...timeline.events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const mostRecentDate = sortedByDate[0]?.date;

  // Score all events
  const scoredEvents = timeline.events.map((event) =>
    scoreEvent(
      event,
      classification.intent,
      messageKeywords,
      event.date === mostRecentDate
    )
  );

  // Sort by score (desc), then by date (desc)
  const sorted = scoredEvents.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Select top 3 with meaningful score (must have type match OR keyword match, not just recency)
  const selected = sorted
    .filter((item) => 
      item.scoreBreakdown.typeMatch > 0 || item.scoreBreakdown.keywordMatch > 0
    )
    .slice(0, 3);

  // Generate explanation
  const explanation = generateExplanation(
    classification.intent,
    classification.matchedKeywords,
    selected,
    timeline.events.length
  );

  return {
    intent: classification.intent,
    selectedItems: selected,
    explanation,
    hasEvidence: selected.length > 0,
  };
}

/**
 * Generates explanation bullets for the relevance selection.
 * Strictly cites facts from the demo timeline — no inference.
 */
function generateExplanation(
  intent: IntentBucket,
  matchedKeywords: string[],
  selectedItems: ScoredTimelineItem[],
  totalEvents: number
): string[] {
  const bullets: string[] = [];

  // Intent bucket explanation
  const intentLabel = getIntentLabel(intent);
  if (intent === "unknown") {
    bullets.push(
      `Intent classified as: ${intentLabel} (no specific keywords matched)`
    );
  } else {
    bullets.push(
      `Intent classified as: ${intentLabel} (matched: ${matchedKeywords.join(", ")})`
    );
  }

  // Selected items explanation
  if (selectedItems.length === 0) {
    if (intent === "billing_explanation") {
      bullets.push(
        "No billing-related evidence found in demo timeline. The demo data does not contain billing events."
      );
    } else if (intent === "unknown") {
      bullets.push(
        "No timeline items matched the query. Please try using specific medical or scheduling terms."
      );
    } else {
      bullets.push(
        `No relevant ${intentLabel.toLowerCase()} evidence found in the ${totalEvents} demo timeline events.`
      );
    }
  } else {
    bullets.push(
      `Found ${selectedItems.length} relevant item${selectedItems.length > 1 ? "s" : ""} from demo timeline:`
    );

    for (const item of selectedItems) {
      const scoreDetail = [];
      if (item.scoreBreakdown.typeMatch > 0) scoreDetail.push("type match");
      if (item.scoreBreakdown.keywordMatch > 0) scoreDetail.push("keyword match");
      if (item.scoreBreakdown.recencyBonus > 0) scoreDetail.push("most recent");

      bullets.push(
        `• ${item.date}: "${item.title}" (${item.type}) — ${scoreDetail.join(", ")}`
      );
    }
  }

  // Gap analysis (deterministic)
  if (intent === "billing_explanation" && selectedItems.length === 0) {
    bullets.push(
      "Gap: Demo timeline contains no billing/insurance records for this patient."
    );
  }

  return bullets;
}

/**
 * Formats a date string for display.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
