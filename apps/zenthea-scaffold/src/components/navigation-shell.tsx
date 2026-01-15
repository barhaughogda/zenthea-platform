"use client";

/**
 * READ-ONLY / NON-OPERATIONAL
 * Navigation shell for Phase AJ-03.
 * Client-side routing only - no server actions, no data persistence.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  User,
  Stethoscope,
  Globe,
  Bot,
  Home,
  GitCompare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Overview",
    icon: Home,
    description: "Platform overview",
  },
  {
    href: "/booking",
    label: "Booking",
    icon: Calendar,
    description: "Read-only booking management",
  },
  {
    href: "/patient-portal",
    label: "Patient Portal",
    icon: User,
    description: "Read-only patient information",
  },
  {
    href: "/provider-workbench",
    label: "Provider Workbench",
    icon: Stethoscope,
    description: "Read-only provider workflows",
  },
  {
    href: "/website-builder",
    label: "Website Builder",
    icon: Globe,
    description: "Read-only website preview",
  },
  {
    href: "/assistant",
    label: "Assistant",
    icon: Bot,
    description: "Read-only AI assistant preview",
  },
  {
    href: "/proposals",
    label: "Proposals",
    icon: GitCompare,
    description: "Read-only proposal visualization",
  },
];

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">ZENTHEA</h1>
          <p className="text-xs text-muted-foreground mt-1">Platform Preview</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link",
                  isActive ? "nav-link-active" : "nav-link-inactive"
                )}
                title={item.description}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Phase AJ-04</p>
            <p>Read-Only Mode</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Read-Only Banner */}
        <div className="read-only-banner">
          READ-ONLY / NON-OPERATIONAL — All interactions are proposals only. No
          data is persisted.
        </div>

        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">
                Current Surface
              </span>
              <h2 className="text-lg font-semibold">
                {NAV_ITEMS.find(
                  (item) =>
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                )?.label || "Unknown"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
                PREVIEW MODE
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-muted/10 p-4 text-center text-xs text-muted-foreground">
          <p>
            Phase AJ-04: READ-ONLY / NON-OPERATIONAL. Execution is not enabled.
            All proposals are ephemeral.
          </p>
        </footer>
      </div>
    </div>
  );
}
