"use client";

import React, { useState } from "react";
import { Banners } from "@/components/Banners";
import { FailurePanel } from "@/components/FailurePanel";
import { ContextPanel } from "@/components/ContextPanel";
import { PatientTimelinePanel } from "@/components/PatientTimelinePanel";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "@/lib/demoPatientTimeline";
import { generateClinicalDraft } from "./actions";
import { ClinicalDraftingResponse } from "@starter/patient-portal-agent/orchestration/clinical-drafting-workflow";
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";

const persistenceAdapter = createPilotPersistenceAdapter();

export default function ClinicianPage() {
  const [result, setResult] = useState<ClinicalDraftingResponse | null>(null);
  const [failure, setFailure] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [useInvalidContext, setUseInvalidContext] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  async function handleFinalize() {
    setIsFinalizing(true);
    // TEMPORARY DRY-RUN LOGS
    console.log("[PILOT DRY-RUN] Invoking persistenceAdapter.recordFinalizedNote");
    const result = await persistenceAdapter.recordFinalizedNote("HUMAN_SIGNED_FINALIZE", {
      noteId: `note-${Date.now()}`,
      authorId: "demo-clinician",
      signedAt: new Date(),
      ...({ source: "ui", humanAction: true } as any)
    } as any);
    console.log("[PILOT DRY-RUN] recordFinalizedNote result:", result);
    setIsFinalizing(false);
    alert(`Finalize attempt complete. Success: ${result.success}. Message: ${result.message}`);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFailure(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await generateClinicalDraft(formData, useInvalidContext);
      
      if (res.status === "DENY" || res.status === "ERROR") {
        setFailure({
          sliceId: "SL-04",
          outcomeType: res.status,
          gate: res.metadata?.denialReason?.gate || "Unknown",
          message: res.message,
          raw: res
        });
      } else {
        setResult(res);
      }
    } catch (err: any) {
      console.error(err);
      setFailure({
        sliceId: "SL-04",
        outcomeType: "ERROR",
        gate: "Unknown",
        message: err.message || "Error generating clinical draft",
        raw: err
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Banners slice="SL-04" />

      <ContextPanel context={DEMO_PATIENT_CONTEXT} />
      <PatientTimelinePanel timeline={DEMO_PATIENT_TIMELINE} />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Clinician Drafting Demo View (SL-04)</h2>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase">Context:</span>
            <button 
              onClick={() => setUseInvalidContext(false)}
              className={`text-xs px-2 py-0.5 rounded ${!useInvalidContext ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Valid
            </button>
            <button 
              onClick={() => setUseInvalidContext(true)}
              className={`text-xs px-2 py-0.5 rounded ${useInvalidContext ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Invalid
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Intent (required)</label>
            <textarea 
              name="intent" 
              required 
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g. Draft a SOAP note for an encounter where the patient complained of sharp chest pain but ECG was normal."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Structure (optional)</label>
              <input 
                name="structure" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g. SOAP, Narrative"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tone (optional)</label>
              <input 
                name="tone" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g. Professional, Concise"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Drafting..." : "Generate clinical draft"}
          </button>
        </form>

        {failure && (
          <div className="mb-8">
            <FailurePanel {...failure} />
          </div>
        )}

        {result && result.draft && (
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold border border-red-200">
                DRAFT ONLY
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
                Not signed
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold border border-yellow-200">
                Requires clinician review
              </span>
              <button
                onClick={handleFinalize}
                disabled={isFinalizing}
                className="ml-auto bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isFinalizing ? "Finalizing..." : "Sign and Finalize"}
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">Draft Content (Verbatim)</h3>
              <div className="whitespace-pre-wrap text-gray-800 font-serif leading-relaxed">
                {result.draft.text}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-2">Returned Labels:</h3>
              <div className="flex flex-col gap-2">
                {result.draft.labels.map((label, i) => (
                  <span key={i} className="text-sm text-gray-600 italic">
                    • {label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-2">Draft Metadata (Verbatim JSON):</h3>
              <pre className="bg-black text-blue-400 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(result.draft.metadata, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-2">Response Metadata (Verbatim JSON):</h3>
              <pre className="bg-black text-gray-300 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(result.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
