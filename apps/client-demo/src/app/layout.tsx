import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Link from 'next/link';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Users,
  Briefcase,
  Wallet
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-platform-monorepo-starter Client Demo",
  description: "Composite application demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Sales', href: '/sales', icon: Briefcase, disabled: true },
    { name: 'Projects', href: '/projects', icon: Users, disabled: true },
    { name: 'Accounting', href: '/accounting', icon: Wallet, disabled: true },
    { name: 'Settings', href: '/settings', icon: Settings, disabled: true },
  ];

  return (
    <html lang="en">
      <body className={cn(inter.className, "flex h-screen overflow-hidden")}>
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold tracking-tight text-indigo-400">AI-platform-monorepo-starter</h1>
            <p className="text-xs text-gray-400 mt-1">Client Demo Application</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  item.disabled 
                    ? "text-gray-600 cursor-not-allowed" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.disabled && (
                  <span className="ml-auto text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 uppercase">Soon</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold">&lt;U&gt;</div>
              <div>
                <p className="text-sm font-medium">&lt;USER_NAME&gt;</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-lg font-semibold text-gray-800">AI-platform-monorepo-starter Platform</h2>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
