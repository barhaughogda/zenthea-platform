/**
 * READ-ONLY / NON-OPERATIONAL
 * Proposals surface landing page for Phase AJ-04.
 * All proposal data is static, inline mock data.
 * No backend calls, no persistence, no execution semantics.
 */

import Link from "next/link";
import { SurfaceLayout } from "@/components/surface-layout";
import { ProposalCard } from "@/components/proposal-card";

// Static, inline mock proposal data - no external data sources
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
    ],
  },
];

export default function ProposalsPage() {
  return (
    <SurfaceLayout
      title="Proposals"
      description="View and compare proposals in a read-only visualization format. No actions can be taken."
      canDo={[
        "View proposal details",
        "Compare proposals side-by-side",
        "Toggle between proposal variants",
        "Inspect attribute differences",
      ]}
      cannotDo={[
        "Select, confirm, or approve any proposal",
        "Save, rank, or score proposals",
        "Execute or apply any proposal",
        "Persist any proposal state",
      ]}
    >
      {/* Proposal Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available Proposals</h2>
          <Link href="/proposals/compare" className="btn-inspect">
            Compare All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_PROPOSALS.map((proposal, index) => (
            <ProposalCard
              key={index}
              variantLabel={proposal.variantLabel}
              title={proposal.title}
              description={proposal.description}
              attributes={proposal.attributes}
            />
          ))}
        </div>
      </div>

      {/* Phase Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Phase AJ-04 Notice</h3>
        <p className="text-sm text-blue-700">
          This surface visualizes proposals for human comprehension only. Proposals 
          are ephemeral, exist only in browser memory, and will be completely erased 
          upon page refresh. No proposal carries execution authority.
        </p>
      </div>
    </SurfaceLayout>
  );
}
