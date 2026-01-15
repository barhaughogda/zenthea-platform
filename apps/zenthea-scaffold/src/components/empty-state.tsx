/**
 * READ-ONLY / NON-OPERATIONAL
 * Empty state component for Phase AJ-03.
 * Visual primitive only - no workflow semantics.
 */

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon className="h-12 w-12 mb-4 text-muted-foreground/50" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm max-w-md">{description}</p>
    </div>
  );
}
