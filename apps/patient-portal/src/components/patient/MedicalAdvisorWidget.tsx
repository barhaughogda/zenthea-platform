'use client';

import React from 'react';
import { useMedicalAdvisor } from '@/hooks/useMedicalAdvisor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Info, Loader2 } from 'lucide-react';

/**
 * Medical Advisor Widget
 * 
 * Displays non-authoritative clinical guidance from the Medical Advisor Agent.
 * 
 * Safety Guardrails (Step 4.4):
 * - Displays NON-AUTHORITATIVE guidance.
 * - Clearly labeled as "informational" or "advisory".
 * - No clinical directives or implied diagnosis.
 */
export const MedicalAdvisorWidget = () => {
  const { advisory, isLoading, error } = useMedicalAdvisor();

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <CardTitle className="text-sm font-medium">Loading Clinical Advisory...</CardTitle>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (error || !advisory) {
    // Silent failure as per deterministic UX requirements (fall back to same UI behavior as mock/empty)
    return null;
  }

  return (
    <Card className="border-zenthea-teal/20 bg-surface-elevated overflow-hidden">
      <div className="bg-zenthea-teal/10 px-4 py-2 flex items-center justify-between border-b border-zenthea-teal/10">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-zenthea-teal" />
          <span className="text-xs font-bold text-zenthea-teal uppercase tracking-wider">
            {advisory.metadata.isDraft ? 'Draft' : ''} {advisory.metadata.isAdvisory ? 'Advisory' : ''}
          </span>
        </div>
        {advisory.metadata.confidenceScore && (
          <span className="text-[10px] text-text-secondary">
            Confidence: {(advisory.metadata.confidenceScore * 100).toFixed(0)}%
          </span>
        )}
      </div>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-bold text-text-primary">
          Clinical Guidance Summary
        </CardTitle>
        <CardDescription className="text-xs">
          Last updated: {new Date(advisory.metadata.updatedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-text-secondary leading-relaxed bg-background/50 p-3 rounded-md border border-border/50">
          {advisory.advisoryText}
        </div>

        {advisory.evidenceReferences.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-text-primary uppercase tracking-tight">Supporting Evidence</h4>
            <div className="space-y-1">
              {advisory.evidenceReferences.map((ref, i) => (
                <div key={i} className="text-[10px] text-text-secondary flex gap-2 items-start">
                  <span className="font-bold text-zenthea-teal">[{ref.sourceId}]</span>
                  <span>
                    {ref.description}
                    {ref.citation && <span className="opacity-70 ml-1 italic">— {ref.citation}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-[10px] text-text-secondary bg-muted/30 p-2 rounded border border-border/50">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <p>
            <strong>Advisory Notice:</strong> This information is for general educational purposes only and does not constitute 
            medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified 
            health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
