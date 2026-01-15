/**
 * READ-ONLY / NON-OPERATIONAL
 * Website page editor preview for Phase AJ-03.
 * Execution remains blocked. Preview proposal only.
 */

import Link from "next/link";
import { ArrowLeft, Layout, Type, Image, Square } from "lucide-react";

const MOCK_PAGE = {
  id: "PAGE-001",
  title: "Homepage",
  path: "/",
  status: "PUBLISHED",
  lastModified: "January 10, 2026",
  sections: [
    {
      id: "SEC-001",
      type: "Hero",
      name: "Hero Section",
      content: {
        headline: "Welcome to Zenthea Healthcare",
        subheadline: "Providing compassionate care for your family",
        ctaText: "Book Appointment",
        backgroundImage: "hero-bg.jpg",
      },
    },
    {
      id: "SEC-002",
      type: "Features",
      name: "Services Grid",
      content: {
        title: "Our Services",
        items: [
          "Primary Care",
          "Pediatrics",
          "Women's Health",
          "Preventive Care",
        ],
      },
    },
    {
      id: "SEC-003",
      type: "Testimonials",
      name: "Patient Reviews",
      content: {
        title: "What Our Patients Say",
        count: 3,
      },
    },
    {
      id: "SEC-004",
      type: "CTA",
      name: "Call to Action",
      content: {
        headline: "Ready to Get Started?",
        buttonText: "Contact Us",
      },
    },
  ],
};

const SECTION_ICONS: Record<string, typeof Layout> = {
  Hero: Layout,
  Features: Square,
  Testimonials: Type,
  CTA: Image,
};

export default function PageEditorPreview() {
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Page Editor (Preview)</h1>
          <p className="text-muted-foreground">
            Preview page layout for &quot;{MOCK_PAGE.title}&quot;. This is a non-persistent
            visualization only.
          </p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
          {MOCK_PAGE.status}
        </span>
      </div>

      {/* Page Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="surface-card">
          <p className="text-sm text-muted-foreground">Page Title</p>
          <p className="font-semibold">{MOCK_PAGE.title}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-muted-foreground">URL Path</p>
          <p className="font-semibold font-mono">{MOCK_PAGE.path}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-muted-foreground">Last Modified</p>
          <p className="font-semibold">{MOCK_PAGE.lastModified}</p>
        </div>
      </div>

      {/* Page Structure */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Page Structure (Mock Data)</h2>
        <p className="text-sm text-muted-foreground">
          This preview shows the section structure of the page. In a real editor,
          you would be able to drag, reorder, and edit sections.
        </p>

        <div className="space-y-3">
          {MOCK_PAGE.sections.map((section, index) => {
            const Icon = SECTION_ICONS[section.type] || Layout;
            return (
              <div
                key={section.id}
                className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs font-mono">{index + 1}</span>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{section.name}</h3>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {section.type}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {section.type === "Hero" && (
                        <p>
                          Headline: &quot;{section.content.headline}&quot;
                        </p>
                      )}
                      {section.type === "Features" && (
                        <p>
                          {(section.content.items as string[]).length} service items
                        </p>
                      )}
                      {section.type === "Testimonials" && (
                        <p>{section.content.count} testimonials</p>
                      )}
                      {section.type === "CTA" && (
                        <p>
                          Button: &quot;{section.content.buttonText}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="btn-view text-xs">View</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Preview */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Visual Preview (Mockup)</h2>
        <div className="border rounded-lg overflow-hidden">
          {/* Simulated page preview */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Welcome to Zenthea Healthcare
            </h2>
            <p className="text-blue-100 mb-4">
              Providing compassionate care for your family
            </p>
            <span className="inline-block px-4 py-2 bg-white/20 rounded">
              [Button Preview]
            </span>
          </div>
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-center mb-4">
              Our Services
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {["Primary Care", "Pediatrics", "Women's Health", "Preventive Care"].map(
                (service) => (
                  <div
                    key={service}
                    className="p-4 bg-white rounded-lg text-center text-sm"
                  >
                    {service}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="p-6 bg-white border-t">
            <p className="text-center text-muted-foreground text-sm">
              [Additional sections preview...]
            </p>
          </div>
        </div>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">PREVIEW MODE</h3>
        <p className="text-sm">
          This is a preview-only view. No page modifications are possible. You
          cannot edit content, reorder sections, or publish changes. All data
          shown is static mock data for visualization purposes only.
        </p>
      </div>
    </div>
  );
}
