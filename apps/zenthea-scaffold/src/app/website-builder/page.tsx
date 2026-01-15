/**
 * READ-ONLY / NON-OPERATIONAL
 * Website Builder surface landing page for Phase AJ-03.
 * Execution remains blocked. All interactive elements are proposals only.
 */

import { SurfaceLayout } from "@/components/surface-layout";
import { MockCard } from "@/components/mock-card";

const CAN_DO = [
  "View website pages (mock data)",
  "Inspect page layouts",
  "Preview content blocks",
  "Browse component library",
  "View design proposals (read-only)",
];

const CANNOT_DO = [
  "Create or edit pages",
  "Modify content",
  "Publish changes",
  "Upload media",
  "Change site settings",
  "Deploy to production",
];

const MOCK_PAGES = [
  {
    id: "PAGE-001",
    title: "Homepage",
    path: "/",
    lastModified: "2026-01-10",
    status: "PUBLISHED",
  },
  {
    id: "PAGE-002",
    title: "About Us",
    path: "/about",
    lastModified: "2026-01-08",
    status: "PUBLISHED",
  },
  {
    id: "PAGE-003",
    title: "Services",
    path: "/services",
    lastModified: "2026-01-12",
    status: "DRAFT",
  },
  {
    id: "PAGE-004",
    title: "Contact",
    path: "/contact",
    lastModified: "2025-12-20",
    status: "PUBLISHED",
  },
];

export default function WebsiteBuilderPage() {
  return (
    <SurfaceLayout
      title="Website Builder (Read-Only)"
      description="Preview website layouts, content blocks, and design proposals. All data is static mock data for visualization purposes."
      canDo={CAN_DO}
      cannotDo={CANNOT_DO}
    >
      {/* Quick Stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Website Overview (Mock Data)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-primary">12</p>
            <p className="text-sm text-muted-foreground">Total Pages</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-green-600">9</p>
            <p className="text-sm text-muted-foreground">Published</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-yellow-600">3</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-blue-600">24</p>
            <p className="text-sm text-muted-foreground">Components</p>
          </div>
        </div>
      </section>

      {/* Site Pages */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Site Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_PAGES.map((page) => (
            <MockCard
              key={page.id}
              title={page.title}
              subtitle={`Path: ${page.path}`}
              description={`Last modified: ${page.lastModified}`}
              status={page.status}
              statusColor={page.status === "PUBLISHED" ? "green" : "yellow"}
              previewHref={`/website-builder/pages?id=${page.id}`}
            />
          ))}
        </div>
      </section>

      {/* Navigation to Detail Pages */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Explore Website Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MockCard
            title="Page Editor Preview"
            description="Preview page layouts, content sections, and visual hierarchy"
            previewHref="/website-builder/pages"
          />
          <MockCard
            title="Component Library"
            description="Inspect available UI components and design patterns"
            inspectHref="/website-builder/components"
          />
        </div>
      </section>
    </SurfaceLayout>
  );
}
