/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Deterministic comparative and temporal reasoning engine for the non-executing assistant.
 * Compares current user context against historical timeline events.
 * No LLM inference — purely rule-based analysis.
 */

import { TimelineEvent } from "./demoPatientTimeline";
import { ComparativeInsights, IntentBucket } from "./types";
import { extractContentKeywords } from "./relevanceSelector";

/**
 * Fixed reference date for deterministic demo behavior.
 */
export const DEMO_NOW = "2026-01-13";

/**
 * Builds comparative insights by looking at the user's message, 
 * selected relevant items, and the full patient timeline.
 */
export function buildComparativeInsights(args: {
  intent: IntentBucket;
  message: string;
  relevantItems: TimelineEvent[];
  timeline: TimelineEvent[];
}): ComparativeInsights {
  const { message, relevantItems, timeline } = args;

  // 1. Find last encounter (visit or note)
  const sortedEncounters = [...timeline]
    .filter((e) => e.type === "visit" || e.type === "note")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const lastEncounter = sortedEncounters[0];
  let timeSinceLastEncounterDays: number | undefined;

  if (lastEncounter) {
    const lastDate = new Date(lastEncounter.date);
    const now = new Date(DEMO_NOW);
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    timeSinceLastEncounterDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 2. Differences vs last encounter
  const differencesVsLastEncounter: string[] = [];
  if (lastEncounter) {
    const currentKeywords = extractContentKeywords(message);
    const lastEncounterText = `${lastEncounter.title} ${lastEncounter.summary}`;
    const lastKeywords = extractContentKeywords(lastEncounterText);

    const currentSet = new Set(currentKeywords);
    const lastSet = new Set(lastKeywords);

    // New in this request
    for (const kw of currentKeywords) {
      if (!lastSet.has(kw)) {
        differencesVsLastEncounter.push(`New in this request vs last encounter: ${kw}`);
      }
    }

    // Missing from current request
    for (const kw of lastKeywords) {
      if (!currentSet.has(kw)) {
        differencesVsLastEncounter.push(`Previously mentioned but not in this request: ${kw}`);
      }
    }
  }

  // 3. Trends
  const trends: string[] = [];
  const keywordFrequency: Record<string, number> = {};
  const keywordDates: Record<string, Set<string>> = {};

  for (const item of timeline) {
    const itemText = `${item.title} ${item.summary}`;
    const itemKeywords = extractContentKeywords(itemText);
    for (const kw of itemKeywords) {
      keywordFrequency[kw] = (keywordFrequency[kw] || 0) + 1;
      if (!keywordDates[kw]) keywordDates[kw] = new Set();
      keywordDates[kw].add(item.date);
    }
  }

  for (const [kw, count] of Object.entries(keywordFrequency)) {
    // If keyword appears in >=2 distinct items (dates)
    if (keywordDates[kw].size >= 2) {
      trends.push(`Repeated mention across visits: ${kw} (${keywordDates[kw].size} times)`);
    }
  }

  // Add recency trend
  if (relevantItems.length > 0) {
    const newestRelevant = [...relevantItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    const newestDate = new Date(newestRelevant.date);
    const now = new Date(DEMO_NOW);
    const diffDays = Math.ceil(Math.abs(now.getTime() - newestDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 30) {
      trends.push(`Recency: Newest relevant item is within 30 days of today.`);
    }
  }

  // 4. Gaps
  const gaps: string[] = [];
  
  // Detect "referral" events without a subsequent visit within 90 days
  const referrals = timeline.filter((e) => e.title.toLowerCase().includes("referral") || e.summary.toLowerCase().includes("referral"));
  const visits = timeline.filter((e) => e.type === "visit");

  for (const referral of referrals) {
    const refDate = new Date(referral.date);
    const followUp = visits.find((v) => {
      const vDate = new Date(v.date);
      const diff = (vDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 90;
    });

    if (!followUp) {
      gaps.push(`Referral with no follow-up visit within 90 days: ${referral.title} (${referral.date})`);
    }
  }

  // Detect time gaps > 90 days between encounters (visit or note)
  const sortedTimeline = [...timeline]
    .filter((e) => e.type === "visit" || e.type === "note")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (let i = 0; i < sortedTimeline.length - 1; i++) {
    const curr = new Date(sortedTimeline[i].date);
    const next = new Date(sortedTimeline[i+1].date);
    const diff = Math.ceil((next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 90) {
      gaps.push(`Care gap: ${sortedTimeline[i].date} to ${sortedTimeline[i+1].date} (${diff} days)`);
    }
  }

  // 5. Evidence attribution
  const evidenceAttribution: string[] = [];
  const usedDates = new Set<string>();
  
  // Last encounter
  if (lastEncounter) {
    evidenceAttribution.push(`${lastEncounter.date}: ${lastEncounter.title}`);
    usedDates.add(lastEncounter.date);
  }

  // Items used for trends/gaps
  for (const item of relevantItems) {
    if (!usedDates.has(item.date)) {
      evidenceAttribution.push(`${item.date}: ${item.title}`);
      usedDates.add(item.date);
    }
  }

  return {
    lastEncounter: lastEncounter ? `${lastEncounter.date}: ${lastEncounter.title}` : undefined,
    timeSinceLastEncounterDays,
    differencesVsLastEncounter: differencesVsLastEncounter.slice(0, 4),
    trends: trends.slice(0, 4),
    gaps: gaps.slice(0, 4),
    evidenceAttribution,
  };
}
