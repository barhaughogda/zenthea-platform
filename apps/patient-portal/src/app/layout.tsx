import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@starter/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenthea Patient Portal",
  description: "Secure patient access to healthcare services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full bg-gray-50 flex flex-col")}>
        <header className="sticky top-0 z-40 w-full border-b bg-white">
          <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Zenthea</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>

        <footer className="border-t bg-white px-4 py-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Zenthea Healthcare Platform. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
