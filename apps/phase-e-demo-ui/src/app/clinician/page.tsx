"use client";

import React, { useState } from "react";
import { Banners } from "@/components/Banners";
import { generateClinicalDraft } from "./actions";
import { ClinicalDraftingResponse } from "@starter/patient-portal-agent/orchestration/clinical-drafting-workflow";

export default function ClinicianPage() {
  const [result, setResult] = useState<ClinicalDraftingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await generateClinicalDraft(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Error generating clinical draft");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Banners slice="SL-04" />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Clinician Drafting Demo View (SL-04)</h2>
        
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

        {result && result.draft && (
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-4">
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
