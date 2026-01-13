"use client";

import React, { useState } from "react";
import { PatientContext } from "@/lib/demoPatientContext";

interface ContextPanelProps {
  context: PatientContext;
}

export function ContextPanel({ context }: ContextPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 border-b border-gray-200 hover:bg-gray-200 transition-colors"
      >
        <span className="text-sm font-bold text-gray-700">
          Read-only Patient Context (Demo Data)
        </span>
        <span className="text-xs text-gray-500">
          {isExpanded ? "Collapse" : "Expand"}
        </span>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-2 rounded text-xs text-amber-800">
            <strong>WARNING:</strong> This data is mock, read-only, and used for demo purposes only.
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Patient ID</label>
              <div className="text-gray-900 font-mono">{context.patientId}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Full Name</label>
              <div className="text-gray-900">{context.fullName}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Age / DOB</label>
              <div className="text-gray-900">{context.age} ({context.dateOfBirth})</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Last Visit</label>
              <div className="text-gray-900">{context.lastVisitDate}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Known Conditions</label>
            <div className="flex flex-wrap gap-2">
              {context.knownConditions.map((condition, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs border border-blue-200">
                  {condition}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Medications</label>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              {context.currentMedications.map((med, i) => (
                <li key={i}>{med}</li>
              ))}
            </ul>
          </div>

          {context.notes && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Internal Notes</label>
              <div className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-2">
                {context.notes}
              </div>
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-200 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            NON-AUTHORITATIVE ADVISORY CONTEXT ONLY
          </div>
        </div>
      )}
    </div>
  );
}
