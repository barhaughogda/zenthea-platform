"use client";

import React, { useState } from "react";
import { Banners } from "@/components/Banners";
import { generateSchedulingProposal } from "./actions";
import { SchedulingProposalResponse } from "@starter/patient-portal-agent/orchestration/scheduling-proposal-workflow";

export default function PatientPage() {
  const [result, setResult] = useState<SchedulingProposalResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await generateSchedulingProposal(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Error generating proposal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Banners slice="SL-07" />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Patient Demo View (SL-07)</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Intent (required)</label>
            <input 
              name="intent" 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g. I need to see a doctor for my back pain"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Time (optional)</label>
              <input 
                name="preferredTime" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g. Tuesday morning"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Appointment Type (optional)</label>
              <input 
                name="appointmentType" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g. checkup"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason (optional)</label>
            <input 
              name="reason" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate scheduling proposal"}
          </button>
        </form>

        {result && (
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex gap-4">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold border border-yellow-200">
                Not confirmed
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold border border-blue-200">
                Pending provider approval
              </span>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-2">Returned Message:</h3>
              <p className="bg-gray-50 p-4 rounded border border-gray-200 text-gray-800 italic">
                {result.message}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-2">Proposal Object (Verbatim JSON):</h3>
              <pre className="bg-black text-green-400 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(result.proposal, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-2">Metadata (Verbatim JSON):</h3>
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
