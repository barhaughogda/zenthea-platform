"use client";

/**
 * DEMO LANDING GATE — PHASE R-05
 * 
 * A UX-only, read-only entry point that frames the demo before the assistant loads.
 * This page forces explicit perspective and mode selection to ensure intentionality.
 * 
 * Constraints:
 * - Read-only, no actions executed
 * - Boring, safe aesthetic (no green, no excitement)
 * - Explicit selection required (no defaults)
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Perspective = "patient" | "clinician" | "operator";
type Mode = "guided" | "free";

export default function DemoLandingGate() {
  const router = useRouter();
  const [perspective, setPerspective] = useState<Perspective | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);

  const handleEnterDemo = () => {
    if (perspective && mode) {
      router.push(`/assistant?perspective=${perspective}&mode=${mode}`);
    }
  };

  const isButtonDisabled = !perspective || !mode;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* 1. Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-gray-900">Zenthea Demo</h1>
          <p className="text-sm text-gray-500 mt-1">Read-only assistant • No actions executed</p>
        </div>

        <div className="p-8 space-y-8">
          {/* 2. Perspective Selection */}
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Step 1: Select Perspective
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: "patient",
                  title: "Patient demo",
                  description: "Observational view focusing on patient-facing explanations and basic timeline visibility. This perspective emphasizes transparency and clarity for the individual.",
                },
                {
                  id: "clinician",
                  title: "Clinician demo",
                  description: "Professional view focusing on clinical synthesis, action readiness, and human confirmation previews. This perspective emphasizes decision support without automation.",
                },
                {
                  id: "operator",
                  title: "Operator / Governance demo",
                  description: "Administrative view focusing on audit trails, execution plans, and system transparency. This perspective emphasizes accountability and regulatory visibility.",
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                    perspective === item.id
                      ? "border-slate-600 bg-slate-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="perspective"
                      value={item.id}
                      checked={perspective === item.id}
                      onChange={() => setPerspective(item.id as Perspective)}
                      className="mt-1 h-4 w-4 text-slate-600 border-gray-300 focus:ring-slate-500"
                    />
                    <div>
                      <span className="block font-bold text-gray-900 text-sm">
                        {item.title}
                      </span>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* 3. Demo Mode Selection */}
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Step 2: Select Demo Mode
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: "guided",
                  title: "Guided demo",
                  description: "Follows a fixed narrative sequence. Improvisation is prohibited to ensure repeatable results.",
                },
                {
                  id: "free",
                  title: "Free exploration",
                  description: "Allows open interaction with the assistant using provided data. All interactions remain read-only.",
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                    mode === item.id
                      ? "border-slate-600 bg-slate-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="mode"
                      value={item.id}
                      checked={mode === item.id}
                      onChange={() => setMode(item.id as Mode)}
                      className="mt-1 h-4 w-4 text-slate-600 border-gray-300 focus:ring-slate-500"
                    />
                    <div>
                      <span className="block font-bold text-gray-900 text-sm">
                        {item.title}
                      </span>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* 4. Execution Boundary Notice */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex gap-3 text-slate-600">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                  Execution Boundary Notice
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  This demo shows intelligence only. No actions, automation, or
                  execution occur. All clinical signals and insights are
                  simulated for observational purposes.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Enter Demo Button */}
          <div className="pt-4">
            <button
              onClick={handleEnterDemo}
              disabled={isButtonDisabled}
              className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                isButtonDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-slate-800 text-white hover:bg-slate-900 shadow-sm"
              }`}
            >
              Enter Demo (Read-Only)
            </button>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Non-Executing Demo Environment • Regulatory Reference Surface
          </p>
        </div>
      </div>
    </div>
  );
}
