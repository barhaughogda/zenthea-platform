import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"] });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: "Website Builder | Zenthea",
  description: "Create and customize your website with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen flex flex-col")}>
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight">Zenthea Builder</div>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#" className="text-gray-900">Templates</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Components</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Settings</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Preview</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Publish</button>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Zenthea Platform. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
