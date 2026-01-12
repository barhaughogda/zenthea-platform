import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phase E Demo UI",
  description: "Temporary reference surface for Phase E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="bg-white border-b px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900">Phase E Demo UI</h1>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
          <footer className="bg-white border-t px-6 py-4 text-sm text-gray-500 text-center">
            Phase E Demo Surface - Non-Executing
          </footer>
        </div>
      </body>
    </html>
  );
}
