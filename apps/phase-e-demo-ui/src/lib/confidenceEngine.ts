/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Deterministic Confidence & Uncertainty Annotation engine.
 * Classifies insights into epistemic categories with associated confidence levels.
 * No LLM inference — purely rule-based analysis.
 */

import {
  RelevanceResult,
  ComparativeInsights,
  ConfidenceAnnotation,
  ConfidenceLevel,
  EpistemicCategory,
} from "./types";

/**
 * Builds an array of confidence annotations based on the reasoning results.
 * 
 * @param relevance - The results from the relevance selector
 * @param comparative - The results from the comparative engine
 * @returns Array of annotated statements
 */
export function buildConfidenceAnnotations(
  relevance: RelevanceResult,
  comparative: ComparativeInsights
): ConfidenceAnnotation[] {
  const annotations: ConfidenceAnnotation[] = [];

  // 1. OBSERVED: High confidence items directly from the timeline
  if (relevance.selectedItems.length > 0) {
    const topItem = relevance.selectedItems[0];
    annotations.push({
      statement: `Directly referenced record from ${topItem.date}: "${topItem.title}".`,
      category: "OBSERVED",
      confidence: "High",
      reason: "This information is explicitly recorded in the patient timeline.",
    });
  }

  // 2. PATTERN: Medium confidence trends
  if (comparative.trends.length > 0) {
    annotations.push({
      statement: comparative.trends[0],
      category: "PATTERN",
      confidence: "Medium",
      reason: "Derived from recurring data points or temporal patterns in the records.",
    });
  }

  // 3. COMPARATIVE: Medium confidence differences
  if (comparative.differencesVsLastEncounter.length > 0) {
    annotations.push({
      statement: comparative.differencesVsLastEncounter[0],
      category: "COMPARATIVE",
      confidence: "Medium",
      reason: "Calculated by comparing the current context against the previous visit record.",
    });
  }

  // 4. UNCERTAIN: Low confidence gaps or missing data
  if (comparative.gaps.length > 0) {
    annotations.push({
      statement: comparative.gaps[0],
      category: "UNCERTAIN",
      confidence: "Low",
      reason: "Identified a potential gap or missing follow-up in the historical record.",
    });
  } else if (!relevance.hasEvidence) {
    annotations.push({
      statement: "No relevant evidence found for this specific query in the demo dataset.",
      category: "UNCERTAIN",
      confidence: "Low",
      reason: "The query does not match any items in the current static demo timeline.",
    });
  }

  // 5. INTENT UNCERTAINTY
  if (relevance.intent === "unknown") {
    annotations.push({
      statement: "The query's clinical or administrative intent is ambiguous.",
      category: "UNCERTAIN",
      confidence: "Low",
      reason: "Insufficient keyword matches to confidently categorize this request.",
    });
  }

  return annotations;
}

/**
 * Helper to get the color scheme for a confidence level.
 */
export function getConfidenceColor(level: ConfidenceLevel): string {
  switch (level) {
    case "High":
      return "text-green-700 bg-green-50 border-green-200";
    case "Medium":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "Low":
      return "text-red-700 bg-red-50 border-red-200";
    default:
      return "text-gray-700 bg-gray-50 border-gray-200";
  }
}

/**
 * Helper to get the icon/label for an epistemic category.
 */
export function getCategoryLabel(category: EpistemicCategory): string {
  switch (category) {
    case "OBSERVED":
      return "Fact (Observed)";
    case "PATTERN":
      return "Inference (Pattern)";
    case "COMPARATIVE":
      return "Inference (Comparative)";
    case "UNCERTAIN":
      return "Uncertainty (Gap)";
    default:
      return "Annotation";
  }
}
