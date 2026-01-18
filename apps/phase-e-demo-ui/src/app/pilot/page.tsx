"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { PilotSessionShell, AudioInputSim, PreparingDraftState } from "@/components/pilot";
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";

const persistenceAdapter = createPilotPersistenceAdapter();

/**
 * Pilot Clinical Experience Page
 * 
 * A visually guided demo experience with:
 * - Simulated audio input (no real capture/storage)
 * - Clear session lifecycle
 * - Deterministic "Preparing your notes draft" transition
 * 
 * IMPORTANT:
 * - No real audio APIs are used
 * - No audio is stored
 * - Persistence behavior unchanged (reuses existing logic)
 */

type PilotStep = "idle" | "session_active" | "preparing" | "draft_ready" | "finalized";

// Demo draft content for the pilot experience
const DEMO_DRAFT = {
  text: `SUBJECTIVE:
Patient presents for a routine follow-up appointment. Reports generally feeling well with no new complaints. Denies any chest pain, shortness of breath, or palpitations. Sleep and appetite are normal. No recent changes to medications.

OBJECTIVE:
Vital Signs: BP 122/78 mmHg, HR 72 bpm, RR 16, Temp 98.4°F, SpO2 98% on room air
General: Alert and oriented, no acute distress
HEENT: Normocephalic, PERRLA, oropharynx clear
Cardiovascular: Regular rate and rhythm, no murmurs
Respiratory: Clear to auscultation bilaterally
Extremities: No edema, pulses intact

ASSESSMENT:
1. Hypertension - well controlled on current regimen
2. Type 2 Diabetes - A1c pending, patient reports good glucose control
3. Hyperlipidemia - stable on statin therapy

PLAN:
1. Continue current medications
2. Review labs at next visit
3. Return in 3 months for routine follow-up
4. Patient to continue home BP monitoring`,
  labels: ["AI Suggested", "Pilot Demo", "Requires Review"],
  metadata: {
    generatedAt: new Date().toISOString(),
    draftVersion: "1.0",
    source: "pilot-demo-simulation",
    disclaimer: "This is a demonstration draft. Not for clinical use.",
  },
};

export default function PilotPage() {
  const [step, setStep] = useState<PilotStep>("idle");
  const [isListening, setIsListening] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleStartSession = useCallback(() => {
    setStep("session_active");
    setIsListening(false);
    setHasRecorded(false);
  }, []);

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      // Stopping - mark as having recorded something
      setHasRecorded(true);
    }
    setIsListening(!isListening);
  }, [isListening]);

  const handleEndSession = useCallback(async () => {
    // Stop any active listening
    setIsListening(false);
    
    // Show preparing state
    setStep("preparing");
    
    // Record draft generation (reuses existing persistence logic)
    await persistenceAdapter.recordDraftGenerated("HUMAN_CONFIRMED_END_SESSION", {
      draftId: `pilot-draft-${Date.now()}`,
      labels: DEMO_DRAFT.labels,
      authorId: "pilot-demo-clinician",
      ...({ source: "pilot-ui", humanAction: true } as any),
    } as any);

    // Deterministic delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStep("draft_ready");
  }, []);

  const handleFinalize = useCallback(async () => {
    setIsFinalizing(true);
    
    // Reuse existing finalize logic (persistence behavior unchanged)
    await persistenceAdapter.recordFinalizedNote("HUMAN_SIGNED_FINALIZE", {
      noteId: `pilot-note-${Date.now()}`,
      authorId: "pilot-demo-clinician",
      signedAt: new Date(),
      ...({ source: "pilot-ui", humanAction: true } as any),
    } as any);
    
    setIsFinalizing(false);
    setStep("finalized");
  }, []);

  const handleReset = useCallback(() => {
    setStep("idle");
    setIsListening(false);
    setHasRecorded(false);
    setIsFinalizing(false);
  }, []);

  return (
    <PilotSessionShell>
      {/* Preparing Draft State (modal overlay) */}
      <PreparingDraftState isVisible={step === "preparing"} />

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          {[
            { key: "idle", label: "1. Start" },
            { key: "session_active", label: "2. Record" },
            { key: "draft_ready", label: "3. Review" },
            { key: "finalized", label: "4. Finalize" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.key}>
              <div
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${step === s.key || (s.key === "idle" && step === "preparing") || 
                    (s.key === "draft_ready" && step === "preparing") ||
                    (arr.findIndex(x => x.key === step) > i) ||
                    (step === "finalized" && s.key !== "finalized")
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                {s.label}
              </div>
              {i < arr.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  arr.findIndex(x => x.key === step) > i || step === "finalized"
                    ? "bg-emerald-300" 
                    : "bg-gray-200"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Idle - Start Session */}
      {step === "idle" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Start Clinical Session
            </h2>
            <p className="text-slate-600 mb-6">
              Begin a simulated consultation session. You&apos;ll be able to use 
              push-to-talk to capture notes during the encounter.
            </p>
            <button
              onClick={handleStartSession}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
            >
              Start Clinical Session
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Session Active - Audio Input */}
      {step === "session_active" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Session in Progress
              </h2>
              <p className="text-sm text-slate-500">
                Use push-to-talk to capture consultation notes
              </p>
            </div>

            <AudioInputSim
              isListening={isListening}
              onToggle={handleToggleListening}
            />

            {hasRecorded && !isListening && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-700 text-center">
                  <span className="font-medium">Recording captured.</span> You can continue recording or end the session.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleEndSession}
              disabled={isListening}
              className={`
                px-8 py-3 rounded-lg font-semibold transition-colors
                ${isListening 
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                  : "bg-slate-800 text-white hover:bg-slate-900 shadow-lg"
                }
              `}
            >
              End Session
            </button>
          </div>

          {isListening && (
            <p className="text-xs text-center text-gray-500">
              Stop recording before ending the session
            </p>
          )}
        </div>
      )}

      {/* Step 3 & 4: Draft Ready - Review and Finalize */}
      {step === "draft_ready" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold border border-red-200">
                    DRAFT ONLY
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
                    Not signed
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold border border-yellow-200">
                    Requires clinician review
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                Draft Content (Review before finalizing)
              </h3>
              <div className="whitespace-pre-wrap text-gray-800 font-serif leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-200">
                {DEMO_DRAFT.text}
              </div>
            </div>

            <div className="px-6 pb-6">
              <h4 className="font-bold text-gray-700 mb-2 text-sm">Labels:</h4>
              <div className="flex flex-wrap gap-2">
                {DEMO_DRAFT.labels.map((label, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Start New Session
            </button>
            <button
              onClick={handleFinalize}
              disabled={isFinalizing}
              className="px-8 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50"
            >
              {isFinalizing ? "Finalizing..." : "Sign and Finalize"}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Finalized */}
      {step === "finalized" && (
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Notes Finalized
            </h2>
            <p className="text-slate-600 mb-6">
              The clinical notes have been signed and finalized. In a production environment,
              this would be persisted to the clinical record.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Start New Session
              </button>
              <Link
                href="/"
                className="px-6 py-3 rounded-lg font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </PilotSessionShell>
  );
}
