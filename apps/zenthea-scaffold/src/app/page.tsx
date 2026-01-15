/**
 * READ-ONLY / NON-OPERATIONAL
 * This page is part of Phase AJ-02 scaffolding.
 * Execution remains blocked. All interactive elements are proposals only.
 */

const MOCK_DATA = {
  platformStatus: "Operational (Visualization Only)",
  activeProposals: [
    { id: 1, title: "Resource Allocation Review", status: "DRAFT" },
    { id: 2, title: "Governance Parameter Adjustment", status: "DRAFT" },
  ],
};

export default function Home() {
  return (
    <div className="container py-8 space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Platform Overview (Proposal)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className="text-lg font-bold">{MOCK_DATA.platformStatus}</p>
          </div>
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="text-sm font-medium text-muted-foreground">Active Proposals</h3>
            <p className="text-lg font-bold">{MOCK_DATA.activeProposals.length}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Proposal Inspection</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-4 font-medium">Proposal ID</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.activeProposals.map((proposal) => (
                <tr key={proposal.id} className="border-t">
                  <td className="p-4">{proposal.id}</td>
                  <td className="p-4">{proposal.title}</td>
                  <td className="p-4">
                    <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
        <h3 className="font-bold mb-1">GOVERNANCE NOTICE</h3>
        <p className="text-sm">
          All interactions in this interface are non-operational. Buttons labeled "Inspect" or "View" 
          provide informational access only. No system state changes are possible within this session.
        </p>
      </div>
    </div>
  );
}
