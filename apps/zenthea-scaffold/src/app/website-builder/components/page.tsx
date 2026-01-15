/**
 * READ-ONLY / NON-OPERATIONAL
 * Component library inspection page for Phase AJ-03.
 * Execution remains blocked. Inspect-only view.
 */

import Link from "next/link";
import { ArrowLeft, Layout, Type, Image, Square, Layers, Grid } from "lucide-react";

const MOCK_COMPONENTS = [
  {
    id: "COMP-001",
    name: "Hero Banner",
    category: "Layout",
    description: "Full-width hero section with headline, subheadline, and CTA",
    usage: 5,
    icon: Layout,
  },
  {
    id: "COMP-002",
    name: "Feature Grid",
    category: "Content",
    description: "Grid layout for displaying service features or benefits",
    usage: 8,
    icon: Grid,
  },
  {
    id: "COMP-003",
    name: "Text Block",
    category: "Typography",
    description: "Rich text content block with various heading options",
    usage: 15,
    icon: Type,
  },
  {
    id: "COMP-004",
    name: "Image Gallery",
    category: "Media",
    description: "Responsive image gallery with lightbox support",
    usage: 3,
    icon: Image,
  },
  {
    id: "COMP-005",
    name: "Card",
    category: "Content",
    description: "Versatile card component for content display",
    usage: 12,
    icon: Square,
  },
  {
    id: "COMP-006",
    name: "Accordion",
    category: "Interactive",
    description: "Expandable content sections for FAQs and details",
    usage: 4,
    icon: Layers,
  },
];

const CATEGORIES = ["All", "Layout", "Content", "Typography", "Media", "Interactive"];

export default function ComponentLibraryPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/website-builder"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Website Builder
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Component Library (Inspect)</h1>
        <p className="text-muted-foreground">
          Browse available UI components and design patterns. This is a read-only
          inspection view.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="surface-card text-center">
          <p className="text-3xl font-bold text-primary">24</p>
          <p className="text-sm text-muted-foreground">Total Components</p>
        </div>
        <div className="surface-card text-center">
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-sm text-muted-foreground">Categories</p>
        </div>
        <div className="surface-card text-center">
          <p className="text-3xl font-bold text-green-600">47</p>
          <p className="text-sm text-muted-foreground">Total Usages</p>
        </div>
        <div className="surface-card text-center">
          <p className="text-3xl font-bold text-yellow-600">6</p>
          <p className="text-sm text-muted-foreground">Recently Added</p>
        </div>
      </div>

      {/* Category Filter (Read-only) */}
      <div className="surface-card">
        <h2 className="font-semibold mb-3">Filter by Category (Preview)</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category, index) => (
            <span
              key={category}
              className={`px-3 py-1 rounded text-sm ${
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {category}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Filter controls are for preview only. No filtering occurs in read-only mode.
        </p>
      </div>

      {/* Component Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Available Components (Mock Data)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_COMPONENTS.map((component) => {
            const Icon = component.icon;
            return (
              <div key={component.id} className="surface-card">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{component.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded">
                      {component.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {component.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Used {component.usage} times
                  </span>
                  <button className="btn-inspect text-xs">Inspect</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Preview Area */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Component Preview Area</h2>
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Select a component to preview its appearance and configuration options.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            (Preview only - no component insertion available in read-only mode)
          </p>
        </div>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">INSPECT MODE</h3>
        <p className="text-sm">
          This is a read-only inspection view. You cannot add, modify, or remove
          components. Component configurations shown are for reference only. All
          data is static mock data for visualization purposes.
        </p>
      </div>
    </div>
  );
}
