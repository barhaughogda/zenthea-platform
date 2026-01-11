import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldCheck, ShieldAlert, FileText, Info } from 'lucide-react';
import { useZentheaSession } from '@/hooks/useZentheaSession';
import { 
  evaluatePatientScopeGate, 
  AccessPurpose, 
  ActorType 
} from '@starter/patient-scope-gate';

// SL-02 Constraints
const RECORD_SUMMARY_LABELS = [
  'Read-only',
  'Informational only',
  'Not medical advice'
];

const RECORD_SUMMARY_DISCLAIMER = "This record summary is provided for informational purposes only. It is not medical advice and should not be used for self-diagnosis or treatment. Please consult with a healthcare professional for clinical decisions.";

export function PatientRecordSummary() {
  const { data: session } = useZentheaSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'ALLOW' | 'DENY';
    summary?: string;
    justification?: string;
    metadata?: any;
  } | null>(null);

  const handleInquiry = async () => {
    if (!session?.user) return;

    setLoading(true);
    
    // Simulate a short delay for the "backend" call
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // SL-01: Hard Gate invocation
      const request = {
        actor: {
          id: session.user.id,
          type: ActorType.PATIENT,
          tenantId: (session.user as any).tenantId || 'tenant-default',
          role: 'patient'
        },
        tenantId: (session.user as any).tenantId || 'tenant-default',
        targetPatientId: session.user.id,
        purpose: AccessPurpose.PATIENT_REQUEST
      };

      const decision = evaluatePatientScopeGate(request);

      if (decision.effect === 'DENY') {
        setResult({
          status: 'DENY',
          justification: decision.metadata.justification as string,
          metadata: decision.metadata
        });
      } else {
        // Mock data for SL-02
        setResult({
          status: 'ALLOW',
          summary: `Patient Record Summary:
- Last Visit: 2025-12-10 (Follow-up)
- Active Conditions: Hypertension, Type 2 Diabetes
- Recent Labs: HbA1c 6.8% (2025-12-05)
- Medications: Lisinopril 10mg, Metformin 500mg
- Vitals: BP 128/82, Pulse 72 (Captured 2025-12-10)`,
          metadata: decision.metadata
        });
      }
    } catch (err) {
      console.error('Inquiry failed:', err);
      setResult({
        status: 'DENY',
        justification: 'An internal error occurred during verification.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Record Summary Inquiry
            </CardTitle>
            <CardDescription>
              Request a plain-language summary of your medical record. This request is subject to identity and consent verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleInquiry} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Access...
                </>
              ) : (
                'View Record Summary'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {result?.status === 'DENY' && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            {result.justification || 'We could not verify your access rights to this record summary at this time.'}
          </AlertDescription>
        </Alert>
      )}

      {result?.status === 'ALLOW' && (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <AlertTitle>Access Granted</AlertTitle>
            <AlertDescription>
              Your identity and consent have been verified.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {RECORD_SUMMARY_LABELS.map(label => (
                  <span key={label} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200">
                    {label}
                  </span>
                ))}
              </div>
              <CardTitle>Medical Record Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100 font-mono text-sm whitespace-pre-wrap">
                {result.summary}
              </div>
              
              <div className="flex items-start gap-2 text-xs text-slate-500 bg-blue-50/50 p-3 rounded border border-blue-100">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p>{RECORD_SUMMARY_DISCLAIMER}</p>
              </div>

              <div className="pt-4 border-t text-[10px] text-slate-400">
                Audit ID: {result.metadata?.decisionId || 'unknown'} | 
                Timestamp: {result.metadata?.timestamp || new Date().toISOString()}
              </div>
            </CardContent>
          </Card>

          <Button variant="ghost" onClick={() => setResult(null)} size="sm">
            Close Summary
          </Button>
        </div>
      )}
    </div>
  );
}
