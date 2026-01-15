/**
 * READ-ONLY / NON-OPERATIONAL
 * Platform overview page for Phase AJ-03.
 * Execution remains blocked. All interactive elements are proposals only.
 */

import Link from "next/link";
import { Calendar, User, Stethoscope, Globe, Bot } from "lucide-react";

const SURFACES = [
  {
    href: "/booking",
    label: "Booking",
    icon: Calendar,
    description: "View and inspect booking schedules, appointments, and availability (read-only)",
    status: "Available for Preview",
  },
  {
    href: "/patient-portal",
    label: "Patient Portal",
    icon: User,
    description: "View patient profiles, health records, and communication history (read-only)",
    status: "Available for Preview",
  },
  {
    href: "/provider-workbench",
    label: "Provider Workbench",
    icon: Stethoscope,
    description: "Inspect provider workflows, schedules, and task queues (read-only)",
    status: "Available for Preview",
  },
  {
    href: "/website-builder",
    label: "Website Builder",
    icon: Globe,
    description: "Preview website layouts, content blocks, and design proposals (read-only)",
    status: "Available for Preview",
  },
  {
    href: "/assistant",
    label: "Assistant",
    icon: Bot,
    description: "Explore AI assistant capabilities and conversation previews (read-only)",
    status: "Available for Preview",
  },
];

export default function Home() {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground max-w-2xl">
          Welcome to the Zenthea Platform preview. This interface allows you to
          explore and inspect the various surfaces of the platform in read-only
          mode. No actions performed here will modify any system state.
        </p>
      </section>

      {/* Surfaces Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Available Surfaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SURFACES.map((surface) => {
            const Icon = surface.icon;
            return (
              <Link
                key={surface.href}
                href={surface.href}
                className="surface-card hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {surface.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {surface.description}
                    </p>
                    <span className="inline-block mt-3 text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      {surface.status}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">GOVERNANCE NOTICE</h3>
        <p className="text-sm">
          This platform preview operates under Phase AJ-03 governance. All
          interactions are non-operational. Data displayed is static mock data
          for visualization purposes only. No backend connections are active. No
          data persistence is possible. All proposals are ephemeral and will be
          cleared on page refresh.
        </p>
      </div>
    </div>
  );
}
