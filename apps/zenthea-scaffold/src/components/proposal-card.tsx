/**
 * READ-ONLY / NON-OPERATIONAL
 * Proposal card component for Phase AJ-04.
 * Visual primitive only - no workflow semantics.
 * No ranking, scoring, or recommendation.
 */

interface ProposalAttribute {
  label: string;
  value: string;
}

interface ProposalCardProps {
  variantLabel: string;
  title: string;
  description: string;
  attributes: ProposalAttribute[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function ProposalCard({
  variantLabel,
  title,
  description,
  attributes,
  isExpanded = false,
  onToggleExpand,
}: ProposalCardProps) {
  return (
    <div className="proposal-card">
      {/* Variant Label - Neutral identifier only */}
      <div className="flex items-center justify-between mb-3">
        <span className="proposal-variant-label">{variantLabel}</span>
        <span className="text-xs text-muted-foreground">READ-ONLY</span>
      </div>

      {/* Proposal Title */}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      {/* Proposal Description */}
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {/* Attributes List */}
      <div className="space-y-2">
        {attributes.slice(0, isExpanded ? attributes.length : 3).map((attr, index) => (
          <div
            key={index}
            className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0"
          >
            <span className="text-muted-foreground">{attr.label}</span>
            <span className="font-medium">{attr.value}</span>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Toggle */}
      {attributes.length > 3 && onToggleExpand && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="btn-view mt-4 w-full text-center"
        >
          {isExpanded ? "View Less" : `View All (${attributes.length} attributes)`}
        </button>
      )}

      {/* Non-Operational Notice */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          This proposal is for visualization only. No action can be taken.
        </p>
      </div>
    </div>
  );
}
