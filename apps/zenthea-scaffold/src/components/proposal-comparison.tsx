"use client";

/**
 * READ-ONLY / NON-OPERATIONAL
 * Proposal comparison component for Phase AJ-04.
 * Visual primitive only - no workflow semantics.
 * No ranking, scoring, or recommendation.
 * Equal visual weight for all proposals.
 */

import { useState } from "react";

interface ProposalAttribute {
  label: string;
  value: string;
}

interface Proposal {
  variantLabel: string;
  title: string;
  description: string;
  attributes: ProposalAttribute[];
}

interface ProposalComparisonProps {
  proposals: Proposal[];
}

export function ProposalComparison({ proposals }: ProposalComparisonProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "diff">("side-by-side");
  const [activeProposal, setActiveProposal] = useState(0);

  // Get all unique attribute labels across proposals
  const allAttributeLabels = Array.from(
    new Set(proposals.flatMap((p) => p.attributes.map((a) => a.label)))
  );

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("side-by-side")}
            className={viewMode === "side-by-side" ? "btn-inspect" : "btn-view"}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode("diff")}
            className={viewMode === "diff" ? "btn-inspect" : "btn-view"}
          >
            Diff View
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          READ-ONLY / NON-OPERATIONAL
        </span>
      </div>

      {/* Side-by-Side View */}
      {viewMode === "side-by-side" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proposals.map((proposal, index) => (
            <div key={index} className="proposal-card">
              <div className="flex items-center justify-between mb-3">
                <span className="proposal-variant-label">{proposal.variantLabel}</span>
              </div>
              <h4 className="font-semibold mb-2">{proposal.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {proposal.description}
              </p>
              <div className="space-y-2">
                {proposal.attributes.map((attr, attrIndex) => (
                  <div
                    key={attrIndex}
                    className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0"
                  >
                    <span className="text-muted-foreground">{attr.label}</span>
                    <span className="font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diff View */}
      {viewMode === "diff" && (
        <div className="space-y-4">
          {/* Proposal Toggle */}
          <div className="flex gap-2 border-b pb-4">
            {proposals.map((proposal, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveProposal(index)}
                className={
                  activeProposal === index
                    ? "proposal-toggle-active"
                    : "proposal-toggle-inactive"
                }
              >
                {proposal.variantLabel}
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="surface-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                    Attribute
                  </th>
                  {proposals.map((proposal, index) => (
                    <th
                      key={index}
                      className={`text-left py-2 px-3 font-medium ${
                        activeProposal === index
                          ? "bg-primary/5 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {proposal.variantLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allAttributeLabels.map((label, rowIndex) => {
                  const values = proposals.map(
                    (p) => p.attributes.find((a) => a.label === label)?.value || "—"
                  );
                  const hasDifference = new Set(values).size > 1;

                  return (
                    <tr
                      key={rowIndex}
                      className={`border-b last:border-0 ${
                        hasDifference ? "bg-yellow-50/50" : ""
                      }`}
                    >
                      <td className="py-2 px-3 text-muted-foreground">{label}</td>
                      {values.map((value, colIndex) => (
                        <td
                          key={colIndex}
                          className={`py-2 px-3 ${
                            activeProposal === colIndex ? "bg-primary/5" : ""
                          } ${hasDifference ? "font-medium" : ""}`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Diff Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded" />
              <span>Attributes with differences</span>
            </div>
          </div>
        </div>
      )}

      {/* Governance Notice */}
      <div className="governance-notice">
        <p className="text-sm">
          <strong>Comparison is for visualization only.</strong> All proposals are 
          displayed with equal visual weight. No ranking, scoring, or recommendation 
          is provided. All proposal state is ephemeral and will be lost on browser refresh.
        </p>
      </div>
    </div>
  );
}
