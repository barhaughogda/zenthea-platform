import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css"; // We'll create this later

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenthea Platform - Preview",
  description: "Governance-controlled read-only UI scaffolding",
};

/**
 * READ-ONLY / NON-OPERATIONAL
 * This layout is part of Phase AJ-02 scaffolding.
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
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-muted/40 p-4">
            <div className="container flex items-center justify-between">
              <h1 className="text-xl font-bold">ZENTHEA PLATFORM (PREVIEW)</h1>
              <nav className="flex gap-4">
                <span className="text-sm font-medium text-yellow-600 uppercase tracking-wider">
                  READ-ONLY MODE
                </span>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t bg-muted/10 p-4 text-center text-xs text-muted-foreground">
            <p>Phase AJ-02: READ-ONLY / NON-OPERATIONAL. Execution is not enabled.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
