import React from "react";

interface DemoLayoutProps {
  leftColumn: React.ReactNode;
  centerColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

/**
 * Phase R-04: Demo Layout Decomposition
 * 
 * Recomposes the assistant UI into a stable 3-column demo layout.
 * Presentation ONLY — NO behavioral changes.
 */
export const DemoLayout: React.FC<DemoLayoutProps> = ({
  leftColumn,
  centerColumn,
  rightColumn,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN — Context & Evidence */}
        <aside className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-2">
              Context & Evidence
            </h3>
            {leftColumn}
          </div>
        </aside>

        {/* CENTER COLUMN — Conversation */}
        <main className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <div className="flex flex-col gap-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-2">
              Interaction & Narrative
            </h3>
            {centerColumn}
          </div>
        </main>

        {/* RIGHT COLUMN — Governance & Trust */}
        <aside className="lg:col-span-3 space-y-6 order-3">
          <div className="flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-2">
              Governance & Trust
            </h3>
            {rightColumn}
          </div>
        </aside>
      </div>
    </div>
  );
};
