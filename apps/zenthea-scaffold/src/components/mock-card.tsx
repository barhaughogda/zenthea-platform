/**
 * READ-ONLY / NON-OPERATIONAL
 * Mock card component for Phase AJ-03.
 * Visual primitive only - no workflow semantics.
 */

import Link from "next/link";

interface MockCardProps {
  title: string;
  subtitle?: string;
  description: string;
  status?: string;
  statusColor?: "gray" | "green" | "yellow" | "blue";
  inspectHref?: string;
  previewHref?: string;
}

const STATUS_COLORS = {
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
};

export function MockCard({
  title,
  subtitle,
  description,
  status,
  statusColor = "gray",
  inspectHref,
  previewHref,
}: MockCardProps) {
  return (
    <div className="surface-card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold">{title}</h4>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {status && (
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${STATUS_COLORS[statusColor]}`}
          >
            {status}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex gap-2">
        {inspectHref && (
          <Link href={inspectHref} className="btn-inspect">
            Inspect
          </Link>
        )}
        {previewHref && (
          <Link href={previewHref} className="btn-preview">
            Preview
          </Link>
        )}
      </div>
    </div>
  );
}
