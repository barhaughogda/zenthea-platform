/**
 * READ-ONLY / NON-OPERATIONAL
 * Surface layout component for Phase AJ-03.
 * Visual primitive only - no workflow semantics.
 */

interface SurfaceLayoutProps {
  title: string;
  description: string;
  canDo: string[];
  cannotDo: string[];
  children: React.ReactNode;
}

export function SurfaceLayout({
  title,
  description,
  canDo,
  cannotDo,
  children,
}: SurfaceLayoutProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Surface Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Capability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What you CAN do */}
        <div className="surface-card">
          <h3 className="font-semibold text-green-700 mb-3">
            What you can do here (read-only)
          </h3>
          <ul className="space-y-2">
            {canDo.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-green-600 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What you CANNOT do */}
        <div className="surface-card">
          <h3 className="font-semibold text-red-700 mb-3">
            What you CANNOT do here
          </h3>
          <ul className="space-y-2">
            {cannotDo.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-red-600 mt-0.5">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Surface Content */}
      {children}

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">GOVERNANCE NOTICE</h3>
        <p className="text-sm">
          All interactions in this surface are non-operational. Buttons labeled
          "Inspect", "View", "Preview", or "Propose" provide informational
          access only. No system state changes are possible. All proposals are
          ephemeral and will be lost upon page refresh.
        </p>
      </div>
    </div>
  );
}
