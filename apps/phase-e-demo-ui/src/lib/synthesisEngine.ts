/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Deterministic synthesis engine for the non-executing assistant.
 * Performs evidence synthesis and pattern detection over selected timeline items.
 */

import type { IntentBucket, ScoredTimelineItem } from "./types";

export interface Pattern {
  type: string;
  description: string;
  supportingItemIds: string[]; // Using Date + Title as unique identifiers for demo
}

export interface SynthesisResult {
  synthesis: string;
  patterns: Pattern[];
  standOutSummary: string[];
}

/**
 * Deterministically analyzes the selected timeline items based on intent.
 */
export function analyzeTimeline(
  intent: IntentBucket,
  items: ScoredTimelineItem[]
): SynthesisResult {
  if (items.length < 2) {
    return {
      synthesis: "Insufficient context to synthesize.",
      patterns: [],
      standOutSummary: [],
    };
  }

  // 1. Evidence Synthesis
  const synthesis = generateSynthesis(intent, items);

  // 2. Pattern Detection
  const patterns = detectPatterns(items);

  // 3. What Stands Out Summary
  const standOutSummary = generateStandOutSummary(patterns);

  return {
    synthesis,
    patterns,
    standOutSummary,
  };
}

function generateSynthesis(
  intent: IntentBucket,
  items: ScoredTimelineItem[]
): string {
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latest = sorted[0];
  const earliest = sorted[sorted.length - 1];

  let text = "";

  switch (intent) {
    case "scheduling":
      text = `The patient's timeline shows ${items.length} relevant events between ${earliest.date} and ${latest.date}. Recent records indicate a ${latest.title} on ${latest.date}, which follows earlier activity in ${earliest.date.split("-")[1]}/${earliest.date.split("-")[0]}. No new appointments are currently scheduled in this demo view.`;
      break;
    case "clinical_drafting":
      text = `Contextual evidence from ${earliest.date} to ${latest.date} suggests a focus on ${latest.title.toLowerCase()}. Previous documentation from ${earliest.date} provides background for the current assessment. This synthesis is observational and based solely on the provided static records.`;
      break;
    case "record_summary":
      text = `A review of ${items.length} records from ${earliest.date} to ${latest.date} reveals a sequence of clinical events. The most recent activity was a ${latest.title} on ${latest.date}. Earlier records from ${earliest.date} establish the baseline for these observations.`;
      break;
    default:
      text = `Based on ${items.length} items found between ${earliest.date} and ${latest.date}, the patient has a documented history of ${latest.title.toLowerCase()} as of ${latest.date}. These observations are drawn directly from the demo timeline without inference.`;
  }

  return text;
}

function detectPatterns(items: ScoredTimelineItem[]): Pattern[] {
  const patterns: Pattern[] = [];
  const sorted = [...items].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Pattern: Repeated Visit Reasons/Symptoms
  const keywords = ["pain", "hypertension", "glucose", "follow-up", "wellness"];
  keywords.forEach((kw) => {
    const matches = items.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) ||
        item.summary.toLowerCase().includes(kw)
    );
    if (matches.length >= 2) {
      patterns.push({
        type: "Repeated Concern",
        description: `Multiple references to "${kw}" detected across ${matches.length} items.`,
        supportingItemIds: matches.map((m) => `${m.date}:${m.title}`),
      });
    }
  });

  // Pattern: Missing Follow-ups (event without subsequent note)
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].type === "event" && sorted[i].title.toLowerCase().includes("referral")) {
      const hasSubsequentNote = sorted
        .slice(i + 1)
        .some((item) => item.type === "note" || item.type === "visit");
      
      if (!hasSubsequentNote) {
        patterns.push({
          type: "Awaiting Follow-up",
          description: `Referral "${sorted[i].title}" on ${sorted[i].date} has no subsequent visit or clinical note in this view.`,
          supportingItemIds: [`${sorted[i].date}:${sorted[i].title}`],
        });
      }
    }
  }

  // Pattern: Time Gaps (>90 days)
  for (let i = 0; i < sorted.length - 1; i++) {
    const d1 = new Date(sorted[i].date);
    const d2 = new Date(sorted[i + 1].date);
    const diffDays = Math.ceil(
      Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > 90) {
      patterns.push({
        type: "Time Gap",
        description: `Significant gap of ${diffDays} days between "${sorted[i].title}" and "${sorted[i + 1].title}".`,
        supportingItemIds: [
          `${sorted[i].date}:${sorted[i].title}`,
          `${sorted[i + 1].date}:${sorted[i + 1].title}`,
        ],
      });
    }
  }

  return patterns;
}

function generateStandOutSummary(patterns: Pattern[]): string[] {
  if (patterns.length === 0) {
    return ["No significant patterns detected in the current context."];
  }

  // Pick up to 3 most relevant pattern descriptions
  return patterns.slice(0, 3).map((p) => p.description);
}
