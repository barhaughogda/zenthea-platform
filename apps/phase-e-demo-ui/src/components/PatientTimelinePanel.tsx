"use client";

import React, { useState } from "react";
import { PatientTimeline, getRelevanceSummary } from "@/lib/demoPatientTimeline";

interface PatientTimelinePanelProps {
  timeline: PatientTimeline;
}

export function PatientTimelinePanel({ timeline }: PatientTimelinePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const summary = getRelevanceSummary(timeline);
  
  // Chronological sort (newest first)
  const sortedEvents = [...timeline.events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white border border-blue-200 rounded-lg overflow-hidden mb-6 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-2 bg-blue-50 border-b border-blue-200 hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold text-blue-800">
            Read-only Patient Timeline (Demo)
          </span>
        </div>
        <span className="text-xs text-blue-500 font-medium">
          {isExpanded ? "Collapse" : "Expand"}
        </span>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-800">
            <div className="flex gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                <strong>DEMO DATA:</strong> This timeline is static and read-only. 
                The assistant uses this history to provide contextually grounded responses.
                No data is persisted or modified.
              </span>
            </div>
          </div>

          {/* Relevance Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Relevance Summary</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Most recent visit:</span> {summary.mostRecentVisit}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Relevant to this session:</span> {summary.relevantContext}
              </p>
              <p className="text-gray-700 italic">
                <span className="font-semibold text-gray-900 not-italic">Potential gaps:</span> {summary.potentialGaps}
              </p>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {sortedEvents.map((event, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                    event.type === 'visit' ? 'bg-blue-500' : 
                    event.type === 'note' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {event.type === 'visit' && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {event.type === 'note' && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {event.type === 'event' && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-gray-400 font-mono">{event.date}</span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                        event.type === 'visit' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        event.type === 'note' ? 'bg-green-50 text-green-700 border-green-200' : 
                        'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-gray-900">{event.title}</h5>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {event.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center">
            NON-AUTHORITATIVE READ-ONLY HISTORY
          </div>
        </div>
      )}
    </div>
  );
}
