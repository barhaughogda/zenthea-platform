import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { NavigationShell } from "@/components/navigation-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenthea Platform - Preview",
  description: "Governance-controlled read-only UI scaffolding - Phase AJ-03",
};

/**
 * READ-ONLY / NON-OPERATIONAL
 * Root layout for Phase AJ-03 scaffolding.
 * Execution remains blocked. All interactive elements are proposals only.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationShell>{children}</NavigationShell>
      </body>
    </html>
  );
}
