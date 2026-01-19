"use client";

import React from "react";

/**
 * SOAP Section Display Component
 * 
 * Parses and displays SOAP note sections with visual clarity for demo audiences.
 * Each section has:
 * - A clear section header
 * - A subtle background/border difference
 * - A badge indicating content origin
 * 
 * PRESENTATION ONLY: This component does not modify any data.
 */

interface SoapSection {
  key: "SUBJECTIVE" | "OBJECTIVE" | "ASSESSMENT" | "PLAN";
  title: string;
  content: string;
  originBadge: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
}

const SOAP_CONFIG: Record<string, Omit<SoapSection, "key" | "content">> = {
  SUBJECTIVE: {
    title: "Subjective",
    originBadge: "Derived from patient speech",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    bgColor: "bg-blue-50/30",
    borderColor: "border-blue-200",
  },
  OBJECTIVE: {
    title: "Objective",
    originBadge: "Clinician-entered",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bgColor: "bg-emerald-50/30",
    borderColor: "border-emerald-200",
  },
  ASSESSMENT: {
    title: "Assessment",
    originBadge: "Clinician reasoning · AI-assisted",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    bgColor: "bg-amber-50/30",
    borderColor: "border-amber-200",
  },
  PLAN: {
    title: "Plan",
    originBadge: "Clinician instructions · AI-assisted",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    bgColor: "bg-purple-50/30",
    borderColor: "border-purple-200",
  },
};

/**
 * Parse SOAP draft text into structured sections.
 * 
 * SAFETY: Pure function, no side effects, no persistence.
 */
function parseSoapSections(text: string): SoapSection[] {
  const sections: SoapSection[] = [];
  const soapKeys = ["SUBJECTIVE", "OBJECTIVE", "ASSESSMENT", "PLAN"] as const;
  
  // Create regex pattern to find section headers
  const sectionPattern = /^(SUBJECTIVE|OBJECTIVE|ASSESSMENT|PLAN):?\s*/gim;
  
  // Find all section positions
  const matches: { key: string; start: number; headerEnd: number }[] = [];
  let match;
  
  while ((match = sectionPattern.exec(text)) !== null) {
    const key = match[1].toUpperCase();
    if (soapKeys.includes(key as typeof soapKeys[number])) {
      matches.push({
        key,
        start: match.index,
        headerEnd: match.index + match[0].length,
      });
    }
  }
  
  // Extract content for each section
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const contentEnd = next ? next.start : text.length;
    const content = text.slice(current.headerEnd, contentEnd).trim();
    const config = SOAP_CONFIG[current.key];
    
    if (config) {
      sections.push({
        key: current.key as SoapSection["key"],
        ...config,
        content,
      });
    }
  }
  
  return sections;
}

interface SoapSectionDisplayProps {
  draftText: string;
  className?: string;
}

export function SoapSectionDisplay({ draftText, className = "" }: SoapSectionDisplayProps) {
  const sections = parseSoapSections(draftText);
  
  // If no SOAP sections found, show the raw text
  if (sections.length === 0) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <p className="text-sm text-gray-500 mb-2 italic">
          No standard SOAP sections detected. Showing raw content:
        </p>
        <div className="text-gray-800 font-serif leading-relaxed whitespace-pre-wrap">
          {draftText}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {sections.map((section) => (
        <div
          key={section.key}
          className={`rounded-lg border ${section.borderColor} ${section.bgColor} overflow-hidden`}
        >
          {/* Section header */}
          <div className={`px-4 py-2.5 border-b ${section.borderColor} bg-white/60 flex items-center justify-between gap-3`}>
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
              {section.title}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${section.badgeColor} font-medium`}>
              {section.originBadge}
            </span>
          </div>
          
          {/* Section content */}
          <div className="px-4 py-3">
            <div className="text-gray-800 font-serif leading-relaxed whitespace-pre-wrap text-sm">
              {section.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Compact version for inline display
 */
export function SoapSectionBadges() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {Object.entries(SOAP_CONFIG).map(([key, config]) => (
        <div key={key} className={`px-2 py-1 rounded border ${config.badgeColor}`}>
          <span className="font-semibold">{config.title}:</span>{" "}
          <span className="opacity-80">{config.originBadge}</span>
        </div>
      ))}
    </div>
  );
}
