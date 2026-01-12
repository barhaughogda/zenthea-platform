"use client";

import React, { useState } from "react";
import { Banners } from "@/components/Banners";
import { submitProviderDecision } from "./actions";
import { ProviderReviewOutcome, ProviderReviewResponse } from "@starter/patient-portal-agent/orchestration/provider-review-workflow";

const STATIC_PROPOSAL_FIXTURE = {
  proposal_id: "prop-fixture-001",
  proposed_by: "patient-portal-agent",
  timestamp: "2026-01-12T12:00:00Z",
  domain: "scheduling",
  tool: { name: "scheduling:create_appointment_proposal", version: "1.0.0" },
  intent: { summary: "Follow-up for hypertension", reasoning: "Patient requested routine checkup." },
  parameters: {
    patientId: "patient-456",
    appointmentType: "follow_up",
    preferredTime: "Next Monday",
    reason: "Hypertension follow-up",
    status: "PENDING_APPROVAL"
  }
};

export default function ProviderPage() {
  const [activeProposal, setActiveProposal] = useState(STATIC_PROPOSAL_FIXTURE);
  const [pasteValue, setPasteValue] = useState("");
  const [result, setResult] = useState<ProviderReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [reasonCode, setReasonCode] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);

  async function handleDecision(outcome: ProviderReviewOutcome) {
    if (outcome === ProviderReviewOutcome.REJECTED && !reasonCode) {
      alert("Reason code is required for REJECT");
      return;
    }

    setLoading(true);
    try {
      const res = await submitProviderDecision(activeProposal.proposal_id, outcome, reasonCode || undefined);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Error submitting decision");
    } finally {
      setLoading(false);
    }
  }

  function handlePaste() {
    try {
      const parsed = JSON.parse(pasteValue);
      if (!parsed.proposal_id) throw new Error("Missing proposal_id");
      setActiveProposal(parsed);
      alert("Proposal updated from paste");
    } catch (err) {
      alert("Invalid JSON or missing proposal_id");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Banners slice="SL-08" />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Provider Review Demo View (SL-08)</h2>
        
        <div className="mb-8 bg-blue-50 border border-blue-100 p-4 rounded-md">
          <h3 className="font-bold text-blue-900 mb-2">Active Proposal</h3>
          <pre className="text-xs text-blue-800 bg-blue-100/50 p-2 rounded max-h-40 overflow-auto">
            {JSON.stringify(activeProposal, null, 2)}
          </pre>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Paste Proposal JSON (optional)</label>
            <div className="flex gap-2">
              <input 
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                className="flex-1 text-xs border border-blue-200 rounded p-1"
                placeholder='{"proposal_id": "...", ...}'
              />
              <button 
                onClick={handlePaste}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-700">Submit Decision</h3>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                setShowRejectReason(false);
                handleDecision(ProviderReviewOutcome.ACCEPTED);
              }}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              ACCEPT
            </button>
            <button 
              onClick={() => {
                setShowRejectReason(true);
              }}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              REJECT
            </button>
            <button 
              onClick={() => {
                setShowRejectReason(false);
                handleDecision(ProviderReviewOutcome.REQUEST_CHANGES);
              }}
              disabled={loading}
              className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
            >
              REQUEST_CHANGES
            </button>
          </div>

          {showRejectReason && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-md animate-in fade-in slide-in-from-top-1">
              <label className="block text-sm font-medium text-red-900 mb-1">Reason code (required for REJECT)</label>
              <div className="flex gap-2">
                <input 
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className="flex-1 border border-red-200 rounded p-2 text-sm"
                  placeholder="e.g. PROVIDER_UNAVAILABLE"
                />
                <button 
                  onClick={() => handleDecision(ProviderReviewOutcome.REJECTED)}
                  className="bg-red-800 text-white px-4 py-2 rounded text-sm hover:bg-red-900"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-6 pt-6 border-t border-gray-100 mt-8">
            <div className={`p-4 rounded-md border ${result.status === 'SUCCESS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`font-bold mb-1 ${result.status === 'SUCCESS' ? 'text-green-800' : 'text-red-800'}`}>
                Result: {result.status}
              </h3>
              <p className="text-sm italic italic text-gray-700">{result.message}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-2">Audit Metadata (Verbatim JSON):</h3>
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
