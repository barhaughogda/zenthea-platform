import React, { useState } from "react";

export interface FailurePanelProps {
  sliceId: string;
  outcomeType: "DENY" | "ERROR";
  gate: "SL-01" | "SL-03" | "Tenant" | "Unknown";
  message: string;
  raw: any;
}

export function FailurePanel({ sliceId, outcomeType, gate, message, raw }: FailurePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const bgColor = outcomeType === "DENY" ? "bg-orange-50" : "bg-red-50";
  const borderColor = outcomeType === "DENY" ? "border-orange-200" : "border-red-200";
  const textColor = outcomeType === "DENY" ? "text-orange-800" : "text-red-800";
  const tagColor = outcomeType === "DENY" ? "bg-orange-600" : "bg-red-600";

  return (
    <div className={`mt-4 border rounded-lg overflow-hidden ${bgColor} ${borderColor} animate-in fade-in slide-in-from-top-2`}>
      <div className="px-4 py-3 flex items-center justify-between border-b border-inherit">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-xs font-bold text-white uppercase ${tagColor}`}>
            {outcomeType}
          </span>
          <span className="text-sm font-mono font-bold text-gray-500">
            {sliceId}
          </span>
          <span className={`text-sm font-semibold ${textColor}`}>
            Gate: {gate}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <p className={`text-sm font-medium ${textColor} mb-3`}>
          {message}
        </p>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
        >
          {isExpanded ? "▼ Hide Verbatim JSON" : "▶ Show Verbatim JSON"}
        </button>

        {isExpanded && (
          <div className="mt-3">
            <pre className="bg-gray-900 text-gray-300 p-3 rounded text-[10px] overflow-auto max-h-60 border border-gray-800">
              {JSON.stringify(raw, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
