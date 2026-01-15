"use client";

/**
 * READ-ONLY / NON-OPERATIONAL
 * Proposal comparison page for Phase AJ-04.
 * All proposal data is static, inline mock data.
 * No backend calls, no persistence, no execution semantics.
 * No ranking, scoring, or recommendation.
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProposalComparison } from "@/components/proposal-comparison";

// Static, inline mock proposal data - no external data sources
// All proposals displayed with equal visual weight
const MOCK_PROPOSALS = [
  {
    variantLabel: "Option A",
    title: "Standard Configuration",
    description:
      "A baseline configuration with standard parameters suitable for general use cases.",
    attributes: [
      { label: "Processing Time", value: "2-3 days" },
      { label: "Resource Allocation", value: "Standard" },
      { label: "Coverage Scope", value: "Regional" },
      { label: "Support Level", value: "Basic" },
      { label: "Review Cycle", value: "Monthly" },
      { label: "Access Tier", value: "Standard" },
    ],
  },
  {
    variantLabel: "Option B",
    title: "Enhanced Configuration",
    description:
      "An enhanced configuration with additional parameters for specialized requirements.",
    attributes: [
      { label: "Processing Time", value: "1-2 days" },
      { label: "Resource Allocation", value: "Priority" },
      { label: "Coverage Scope", value: "National" },
      { label: "Support Level", value: "Advanced" },
      { label: "Review Cycle", value: "Weekly" },
      { label: "Access Tier", value: "Premium" },
    ],
  },
];

export default function ProposalComparePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/proposals"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposals
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Compare Proposals</h1>
          <p className="text-muted-foreground mt-1">
            Side-by-side comparison for visualization only. All proposals have 
            equal weight. No ranking or recommendation is provided.
          </p>
        </div>
      </div>

      {/* Read-Only Banner */}
      <div className="read-only-banner rounded-lg">
        READ-ONLY / NON-OPERATIONAL — Comparison is for visualization only. 
        All state is ephemeral and will be lost on browser refresh.
      </div>

      {/* Comparison Component */}
      <ProposalComparison proposals={MOCK_PROPOSALS} />

      {/* Assistant Participation Notice */}
      <div className="surface-card">
        <h3 className="font-semibold mb-2">Assistant Participation</h3>
        <p className="text-sm text-muted-foreground mb-3">
          An AI assistant MAY describe proposal contents and explain differences 
          factually. The assistant MUST NOT:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-red-600 mt-0.5">✗</span>
            Evaluate proposals against each other
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 mt-0.5">✗</span>
            Recommend or suggest which proposal is better
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 mt-0.5">✗</span>
            Rank proposals by any criterion
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 mt-0.5">✗</span>
            Conclude which proposal should be selected
          </li>
        </ul>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">GOVERNANCE NOTICE</h3>
        <p className="text-sm">
          This comparison surface operates under Phase AJ-04 governance. No 
          proposal displayed here can be selected, confirmed, approved, or 
          executed. All proposals are ephemeral and carry no execution authority. 
          Browser refresh will completely erase all proposal state.
        </p>
      </div>
    </div>
  );
}
